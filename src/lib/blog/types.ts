import { baseFrontmatterSchema, type Entry, type Variant } from "@/lib/content/types";

export { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "@/lib/i18n/routing";
export { resolveVariant } from "@/lib/content/types";

export const frontmatterSchema = baseFrontmatterSchema;

export type Frontmatter = typeof frontmatterSchema._output;
export type PostVariant = Variant<Frontmatter>;
export type Post = Entry<Frontmatter>;
