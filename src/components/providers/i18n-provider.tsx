"use client";

import { useRef } from "react";

import i18n, { I18nextProvider } from "@/lib/i18n";

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
	const applied = useRef<string | null>(null);

	if (applied.current !== locale) {
		applied.current = locale;
		if (i18n.isInitialized && i18n.language !== locale) {
			void i18n.changeLanguage(locale);
		}
	}

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
