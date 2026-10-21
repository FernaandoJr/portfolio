import matter from "gray-matter";
import readingTime from "reading-time";
import type { z } from "zod";

import { isLocale } from "@/lib/i18n/routing";

import type { BaseFrontmatter, Variant } from "./types";

export const FILE_PATTERN = /^(.+)\.([A-Za-z]+)\.mdx$/;

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
