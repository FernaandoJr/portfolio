import matter from "gray-matter";
import readingTime from "reading-time";
import type { z } from "zod";

import { isLocale, type BaseFrontmatter, type Variant } from "./types";

export const FILE_PATTERN = /^(.+)\.([A-Za-z]+)\.mdx$/;

export function fileNameFor(slug: string, locale: string): string {
	return `${slug}.${locale}.mdx`;
}

export type Parser<F extends BaseFrontmatter> = (file: string, raw: string) => Variant<F> | null;

export function makeParser<F extends BaseFrontmatter>(
	schema: z.ZodType<F, unknown>,
	collection: string
): Parser<F> {
	return function parseVariant(file, raw) {
		const match = FILE_PATTERN.exec(file);
		if (!match) return null;

		const [, slug, locale] = match;
		if (!slug || !locale || !isLocale(locale)) return null;

		const { data, content } = matter(raw);
		const parsed = schema.safeParse(data);

		if (!parsed.success) {
			const issues = parsed.error.issues
				.map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
				.join("\n");
			throw new Error(`Invalid frontmatter in content/${collection}/${file}:\n${issues}`);
		}

		return {
			slug,
			locale,
			frontmatter: parsed.data,
			body: content,
			readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
		};
	};
}

const LEADING_KEYS = new Set(["title", "description", "date", "tags"]);
const TRANSLATION_KEYS = ["translatedFrom", "sourceHash", "translatedBy", "translatedAt"] as const;

export function serializeVariant<F extends BaseFrontmatter>(frontmatter: F, body: string): string {
	const data: Record<string, unknown> = {
		title: frontmatter.title,
		description: frontmatter.description,
		date: frontmatter.date,
		tags: frontmatter.tags,
	};

	for (const [key, value] of Object.entries(frontmatter)) {
		if (LEADING_KEYS.has(key)) continue;
		if ((TRANSLATION_KEYS as readonly string[]).includes(key)) continue;
		if (value === undefined) continue;
		data[key] = value;
	}

	for (const key of TRANSLATION_KEYS) {
		if (frontmatter[key] !== undefined) data[key] = frontmatter[key];
	}

	return matter.stringify(`\n${body.trim()}\n`, data);
}
