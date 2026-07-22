import matter from "gray-matter";
import readingTime from "reading-time";

import { frontmatterSchema, isLocale, type Frontmatter, type PostVariant } from "./types";

export const FILE_PATTERN = /^(.+)\.([A-Za-z]+)\.mdx$/;

export function fileNameFor(slug: string, locale: string): string {
	return `${slug}.${locale}.mdx`;
}

export function parseVariant(file: string, raw: string): PostVariant | null {
	const match = FILE_PATTERN.exec(file);
	if (!match) return null;

	const [, slug, locale] = match;
	if (!slug || !locale || !isLocale(locale)) return null;

	const { data, content } = matter(raw);
	const parsed = frontmatterSchema.safeParse(data);

	if (!parsed.success) {
		const issues = parsed.error.issues
			.map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("\n");
		throw new Error(`Invalid frontmatter in content/blog/${file}:\n${issues}`);
	}

	return {
		slug,
		locale,
		frontmatter: parsed.data,
		body: content,
		readingMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
	};
}

export function serializeVariant(frontmatter: Frontmatter, body: string): string {
	const data: Record<string, unknown> = {
		title: frontmatter.title,
		description: frontmatter.description,
		date: frontmatter.date,
		tags: frontmatter.tags,
	};

	if (frontmatter.cover) data.cover = frontmatter.cover;
	data.draft = frontmatter.draft;

	if (frontmatter.translatedFrom) {
		data.translatedFrom = frontmatter.translatedFrom;
		data.sourceHash = frontmatter.sourceHash;
		data.translatedBy = frontmatter.translatedBy;
		data.translatedAt = frontmatter.translatedAt;
	}

	return matter.stringify(`\n${body.trim()}\n`, data);
}
