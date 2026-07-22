import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { computeSourceHash } from "../src/lib/blog/hash";
import { parseVariant } from "../src/lib/blog/parse";
import { LOCALES, type Locale, type PostVariant } from "../src/lib/blog/types";

export const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type Job = {
	slug: string;
	source: PostVariant;
	target: Locale;
	existing: PostVariant | null;
	reason: "missing" | "stale" | "forced";
};

export function hashOf(variant: PostVariant): string {
	return computeSourceHash({
		title: variant.frontmatter.title,
		description: variant.frontmatter.description,
		tags: variant.frontmatter.tags,
		body: variant.body,
	});
}

export async function readAllVariants(): Promise<PostVariant[]> {
	let files: string[];
	try {
		files = await readdir(CONTENT_DIR);
	} catch {
		return [];
	}

	const variants: PostVariant[] = [];

	for (const file of files) {
		if (!file.endsWith(".mdx")) continue;
		const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
		const variant = parseVariant(file, raw);
		if (variant) variants.push(variant);
	}

	return variants;
}

export async function planJobs(force = false, only?: string): Promise<Job[]> {
	const variants = await readAllVariants();
	const bySlug = new Map<string, PostVariant[]>();

	for (const variant of variants) {
		if (only && variant.slug !== only) continue;
		bySlug.set(variant.slug, [...(bySlug.get(variant.slug) ?? []), variant]);
	}

	const jobs: Job[] = [];

	for (const [slug, group] of bySlug) {
		const source = group.find((v) => v.frontmatter.translatedFrom === undefined);
		if (!source) {
			process.stdout.write(`! ${slug}: no source variant found — skipped\n`);
			continue;
		}

		for (const target of LOCALES) {
			if (target === source.locale) continue;

			const existing = group.find((v) => v.locale === target) ?? null;

			if (!existing) {
				jobs.push({ slug, source, target, existing: null, reason: "missing" });
			} else if (force) {
				jobs.push({ slug, source, target, existing, reason: "forced" });
			} else if (existing.frontmatter.sourceHash !== hashOf(source)) {
				jobs.push({ slug, source, target, existing, reason: "stale" });
			}
		}
	}

	return jobs;
}
