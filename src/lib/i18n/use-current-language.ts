"use client";

import { useEffect, useState } from "react";

import i18n from "@/lib/i18n";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/routing";

/**
 * Reads the active language as React state.
 *
 * Do not derive UI from `useTranslation().i18n.language` directly: that object
 * keeps the same identity forever and only mutates its `language` field, so the
 * React Compiler memoizes anything computed from it and never recomputes. Text
 * still updates because `t` gets a new identity, which makes the bug look like
 * "only some things refresh".
 */
export function useCurrentLanguage(): Locale {
	const [language, setLanguage] = useState<Locale>(() =>
		isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE
	);

	useEffect(() => {
		function apply(next: string) {
			setLanguage(isLocale(next) ? next : DEFAULT_LOCALE);
		}

		// The language may have changed between first render and this effect.
		apply(i18n.language);

		i18n.on("languageChanged", apply);
		return () => {
			i18n.off("languageChanged", apply);
		};
	}, []);

	return language;
}
