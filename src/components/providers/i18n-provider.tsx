"use client";

import { useEffect } from "react";

import i18n, { I18nextProvider } from "@/lib/i18n";
import { HTML_LANG } from "@/lib/i18n/routing";
import { useLocaleStore } from "@/lib/i18n/store";

export function I18nProvider({ children }: { children: React.ReactNode }) {
	const locale = useLocaleStore((state) => state.locale);

	useEffect(() => {
		void useLocaleStore.persist.rehydrate();
	}, []);

	useEffect(() => {
		if (i18n.language !== locale) void i18n.changeLanguage(locale);
		document.documentElement.lang = HTML_LANG[locale];
	}, [locale]);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
