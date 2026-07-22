import { z } from "zod";

export const LOCALES = ["ptBR", "enUS"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ptBR";

const calendarDate = z
	.union([z.string(), z.date()])
	.transform((value) => (typeof value === "string" ? value : value.toISOString().slice(0, 10)))
	.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"));

export const frontmatterSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	date: calendarDate,
	tags: z.array(z.string()).default([]),
	cover: z.string().optional(),
	draft: z.boolean().default(false),
	translatedFrom: z.enum(LOCALES).optional(),
	sourceHash: z.string().optional(),
	translatedBy: z.string().optional(),
	translatedAt: z.string().optional(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;

export type PostVariant = {
	slug: string;
	locale: Locale;
	frontmatter: Frontmatter;
	body: string;
	readingMinutes: number;
};

export type Post = {
	slug: string;
	sourceLocale: Locale;
	variants: Partial<Record<Locale, PostVariant>>;
};

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}

export function resolveVariant(post: Post, locale: Locale): PostVariant {
	return post.variants[locale] ?? (post.variants[post.sourceLocale] as PostVariant);
}
