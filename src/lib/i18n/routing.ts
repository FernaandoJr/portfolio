export const LOCALES = ["ptBR", "enUS"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ptBR";

/** What appears in the URL. Kept short on purpose: /pt/blog, not /ptBR/blog. */
export const LOCALE_SEGMENTS = ["pt", "en"] as const;

export type LocaleSegment = (typeof LOCALE_SEGMENTS)[number];

export const DEFAULT_SEGMENT: LocaleSegment = "pt";

const SEGMENT_TO_LOCALE: Record<LocaleSegment, Locale> = { pt: "ptBR", en: "enUS" };
const LOCALE_TO_SEGMENT: Record<Locale, LocaleSegment> = { ptBR: "pt", enUS: "en" };

/** BCP 47 tags for <html lang> and hreflang. */
export const HTML_LANG: Record<Locale, string> = { ptBR: "pt-BR", enUS: "en-US" };

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}

export function isLocaleSegment(value: string): value is LocaleSegment {
	return (LOCALE_SEGMENTS as readonly string[]).includes(value);
}

export function toLocale(segment: LocaleSegment): Locale {
	return SEGMENT_TO_LOCALE[segment];
}

export function toSegment(locale: Locale): LocaleSegment {
	return LOCALE_TO_SEGMENT[locale];
}

/**
 * Builds a locale-prefixed path. `path` is the locale-agnostic route, so
 * localeHref("en", "/blog") is "/en/blog" and localeHref("pt", "/") is "/pt".
 */
export function localeHref(locale: Locale | LocaleSegment, path = "/"): string {
	const segment = isLocaleSegment(locale) ? locale : toSegment(locale);
	const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
	return `/${segment}${suffix}`;
}

/** Strips a leading locale segment, returning the locale-agnostic path. */
export function stripLocale(pathname: string): string {
	const [, first, ...rest] = pathname.split("/");
	if (first && isLocaleSegment(first)) {
		return rest.length > 0 ? `/${rest.join("/")}` : "/";
	}
	return pathname || "/";
}
