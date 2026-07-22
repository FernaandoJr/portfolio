import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import { makeParser } from "./parse";
import { resolveVariant, type BaseFrontmatter, type Entry, type Locale, type Variant } from "./types";
import type { z } from "zod";

export type Collection<F extends BaseFrontmatter> = {
	dir: string;
	getAll: () => Promise<Entry<F>[]>;
	get: (slug: string) => Promise<Entry<F> | null>;
	getAllSlugs: () => Promise<string[]>;
	variantFor: (entry: Entry<F>, locale: Locale) => Variant<F>;
};

export function defineCollection<F extends BaseFrontmatter>({
	name,
	schema,
}: {
	name: string;
	schema: z.ZodType<F, unknown>;
}): Collection<F> {
	const dir = path.join(process.cwd(), "content", name);
	const parse = makeParser(schema, name);

	async function listFiles(): Promise<string[]> {
		try {
			return await readdir(dir);
		} catch {
			return [];
		}
	}

	async function readVariant(file: string): Promise<Variant<F> | null> {
		if (!file.endsWith(".mdx")) return null;

		const raw = await readFile(path.join(dir, file), "utf8");
		return parse(file, raw);
	}

	const getAll = cache(async (): Promise<Entry<F>[]> => {
		const files = await listFiles();
		const variants = (await Promise.all(files.map(readVariant))).filter(
			(variant): variant is Variant<F> => variant !== null
		);

		const bySlug = new Map<string, Entry<F>>();

		for (const variant of variants) {
			const existing = bySlug.get(variant.slug);
			const isSource = variant.frontmatter.translatedFrom === undefined;

			if (!existing) {
				bySlug.set(variant.slug, {
					slug: variant.slug,
					sourceLocale: variant.locale,
					variants: { [variant.locale]: variant },
				});
				continue;
			}

			existing.variants[variant.locale] = variant;
			if (isSource) existing.sourceLocale = variant.locale;
		}

		const entries = [...bySlug.values()].filter((entry) => {
			const source = entry.variants[entry.sourceLocale];
			if (!source) return false;
			return process.env.NODE_ENV === "development" || !source.frontmatter.draft;
		});

		return entries.sort((a, b) => {
			const dateA = a.variants[a.sourceLocale]?.frontmatter.date ?? "";
			const dateB = b.variants[b.sourceLocale]?.frontmatter.date ?? "";
			return dateB.localeCompare(dateA);
		});
	});

	const get = cache(async (slug: string): Promise<Entry<F> | null> => {
		const entries = await getAll();
		return entries.find((entry) => entry.slug === slug) ?? null;
	});

	return {
		dir,
		getAll,
		get,
		getAllSlugs: async () => (await getAll()).map((entry) => entry.slug),
		variantFor: resolveVariant,
	};
}
