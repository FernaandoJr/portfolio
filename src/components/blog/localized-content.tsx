"use client";

import type { ReactNode } from "react";

import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/blog/types";
import { useTranslation } from "@/lib/i18n";

type LocalizedContentProps = {
	content: Partial<Record<Locale, ReactNode>>;
	sourceLocale: Locale;
};

const LANGUAGE_KEY: Record<Locale, string> = {
	ptBR: "portuguese",
	enUS: "english",
};

export function LocalizedContent({ content, sourceLocale }: LocalizedContentProps) {
	const { t, i18n } = useTranslation();

	const active = isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
	const translated = content[active];

	return (
		<>
			{translated === undefined && (
				<p className="rounded-lg border border-border bg-card px-4 py-3 text-muted-foreground text-sm">
					{t("blogNoTranslation", { language: t(LANGUAGE_KEY[sourceLocale]) })}
				</p>
			)}
			{translated ?? content[sourceLocale]}
		</>
	);
}
