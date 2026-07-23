export const LOCALES = ["ptBR", "enUS"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "enUS";

export const LOCALE_SEGMENTS = ["pt-br", "en"] as const;

export type LocaleSegment = (typeof LOCALE_SEGMENTS)[number];

export const DEFAULT_SEGMENT: LocaleSegment = "en";

const SEGMENT_TO_LOCALE: Record<LocaleSegment, Locale> = { "pt-br": "ptBR", en: "enUS" };
const LOCALE_TO_SEGMENT: Record<Locale, LocaleSegment> = { ptBR: "pt-br", enUS: "en" };

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

export function localeHref(locale: Locale | LocaleSegment, path = "/"): string {
	const segment = isLocaleSegment(locale) ? locale : toSegment(locale);
	const suffix = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
	return `/${segment}${suffix}`;
}

export function stripLocale(pathname: string): string {
	const [, first, ...rest] = pathname.split("/");
	if (first && isLocaleSegment(first)) {
		return rest.length > 0 ? `/${rest.join("/")}` : "/";
	}
	return pathname || "/";
}
