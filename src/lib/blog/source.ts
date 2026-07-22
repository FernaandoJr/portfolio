import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import { parseVariant } from "./parse";
import type { Locale, Post, PostVariant } from "./types";

export const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

async function listFiles(): Promise<string[]> {
	try {
		return await readdir(CONTENT_DIR);
	} catch {
		return [];
	}
}

async function readVariant(file: string): Promise<PostVariant | null> {
	if (!file.endsWith(".mdx")) return null;

	const raw = await readFile(path.join(CONTENT_DIR, file), "utf8");
	return parseVariant(file, raw);
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
	const files = await listFiles();
	const variants = (await Promise.all(files.map(readVariant))).filter(
		(variant): variant is PostVariant => variant !== null
	);

	const bySlug = new Map<string, Post>();

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

	const posts = [...bySlug.values()].filter((post) => {
		const source = post.variants[post.sourceLocale];
		if (!source) return false;
		return process.env.NODE_ENV === "development" || !source.frontmatter.draft;
	});

	return posts.sort((a, b) => {
		const dateA = a.variants[a.sourceLocale]?.frontmatter.date ?? "";
		const dateB = b.variants[b.sourceLocale]?.frontmatter.date ?? "";
		return dateB.localeCompare(dateA);
	});
});

export const getPost = cache(async (slug: string): Promise<Post | null> => {
	const posts = await getAllPosts();
	return posts.find((post) => post.slug === slug) ?? null;
});

export async function getAllSlugs(): Promise<string[]> {
	return (await getAllPosts()).map((post) => post.slug);
}

export function variantFor(post: Post, locale: Locale): PostVariant {
	return post.variants[locale] ?? (post.variants[post.sourceLocale] as PostVariant);
}
