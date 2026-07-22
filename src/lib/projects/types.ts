import { z } from "zod";

import { baseFrontmatterSchema, type Entry, type Variant } from "@/lib/content/types";

export { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "@/lib/i18n/routing";
export { resolveVariant } from "@/lib/content/types";

export const PROJECT_STATUSES = ["completed", "wip", "archived"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const projectFrontmatterSchema = baseFrontmatterSchema.extend({
	status: z.enum(PROJECT_STATUSES).default("completed"),
	// Presence decides whether the project reaches the homepage; the value orders it.
	featured: z.number().int().optional(),
	stack: z.array(z.string()).default([]),
	links: z
		.object({ repo: z.string().url().optional(), live: z.string().url().optional() })
		.default({}),
	gallery: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
	authors: z.array(z.object({ id: z.string(), roleKey: z.string().optional() })).default([]),
});

export type ProjectFrontmatter = typeof projectFrontmatterSchema._output;
export type ProjectVariant = Variant<ProjectFrontmatter>;
export type Project = Entry<ProjectFrontmatter>;
