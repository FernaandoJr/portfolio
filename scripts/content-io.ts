import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { computeSourceHash } from "../src/lib/blog/hash";
import { parseVariant as parsePost } from "../src/lib/blog/parse";
import type { BaseFrontmatter, Locale, Variant } from "../src/lib/content/types";
import { LOCALES } from "../src/lib/content/types";
import { parseVariant as parseProject } from "../src/lib/projects/parse";

export const COLLECTIONS = ["blog", "projects"] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

export const DEFAULT_COLLECTION: CollectionName = "blog";

const PARSERS: Record<CollectionName, (file: string, raw: string) => Variant | null> = {
	blog: parsePost,
	projects: parseProject,
};

export function isCollectionName(value: string): value is CollectionName {
	return (COLLECTIONS as readonly string[]).includes(value);
}

export function contentDir(collection: CollectionName): string {
	return path.join(process.cwd(), "content", collection);
}

export type Job = {
	slug: string;
	source: Variant;
	target: Locale;
	existing: Variant | null;
	reason: "missing" | "stale" | "forced";
};

export function hashOf(variant: Variant<BaseFrontmatter>): string {
	return computeSourceHash({
		title: variant.frontmatter.title,
		description: variant.frontmatter.description,
		tags: variant.frontmatter.tags,
		body: variant.body,
	});
}

export async function readAllVariants(collection: CollectionName): Promise<Variant[]> {
	const dir = contentDir(collection);
	const parse = PARSERS[collection];

	let files: string[];
	try {
		files = await readdir(dir);
	} catch {
		return [];
	}

	const variants: Variant[] = [];

	for (const file of files) {
		if (!file.endsWith(".mdx")) continue;
		const raw = await readFile(path.join(dir, file), "utf8");
		const variant = parse(file, raw);
		if (variant) variants.push(variant);
	}

	return variants;
}

export async function planJobs(
	collection: CollectionName,
	{ force = false, only }: { force?: boolean; only?: string | undefined } = {}
): Promise<Job[]> {
	const variants = await readAllVariants(collection);
	const bySlug = new Map<string, Variant[]>();

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

export function parseArgs(args: string[]): {
	collection: CollectionName;
	only: string | undefined;
	force: boolean;
} {
	const positional = args.filter((arg) => !arg.startsWith("--"));
	const first = positional[0];
	const named = first !== undefined && isCollectionName(first);

	return {
		collection: named ? first : DEFAULT_COLLECTION,
		only: positional[named ? 1 : 0],
		force: args.includes("--force"),
	};
}
