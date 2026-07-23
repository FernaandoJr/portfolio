import { z } from "zod";

import { LOCALES, type Locale } from "@/lib/i18n/routing";

export { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "@/lib/i18n/routing";

const calendarDate = z
	.union([z.string(), z.date()])
	.transform((value) => (typeof value === "string" ? value : value.toISOString().slice(0, 10)))
	.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"));

export const baseFrontmatterSchema = z.object({
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

export type BaseFrontmatter = z.infer<typeof baseFrontmatterSchema>;

export type Variant<F extends BaseFrontmatter = BaseFrontmatter> = {
	slug: string;
	locale: Locale;
	frontmatter: F;
	body: string;
	readingMinutes: number;
};

export type Entry<F extends BaseFrontmatter = BaseFrontmatter> = {
	slug: string;
	sourceLocale: Locale;
	variants: Partial<Record<Locale, Variant<F>>>;
};

export function resolveVariant<F extends BaseFrontmatter>(
	entry: Entry<F>,
	locale: Locale
): Variant<F> {
	return entry.variants[locale] ?? (entry.variants[entry.sourceLocale] as Variant<F>);
}
