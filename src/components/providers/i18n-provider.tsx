"use client";

import { useRef } from "react";

import i18n, { I18nextProvider } from "@/lib/i18n";

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
	const applied = useRef<string | null>(null);

	// Sync only when the server-sent locale actually changes. Doing it on every
	// render would fight the language switcher: the prop still holds the locale
	// from the request that rendered this tree, so any later re-render would
	// revert the language the user just picked.
	if (applied.current !== locale) {
		applied.current = locale;
		if (i18n.isInitialized && i18n.language !== locale) {
			void i18n.changeLanguage(locale);
		}
	}

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
