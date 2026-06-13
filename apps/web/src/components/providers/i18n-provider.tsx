"use client";

import i18n, { I18nextProvider } from "@repo/i18n";

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
	if (i18n.isInitialized && i18n.language !== locale) {
		i18n.changeLanguage(locale);
	}

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
