export const LOCALES = ["ptBR", "enUS"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "enUS";

export const HTML_LANG: Record<Locale, string> = { ptBR: "pt-BR", enUS: "en-US" };

export function isLocale(value: string): value is Locale {
	return (LOCALES as readonly string[]).includes(value);
}
