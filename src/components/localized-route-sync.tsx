"use client";

import { useEffect } from "react";

import i18n from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/routing";

export function LocalizedRouteSync({ locale }: { locale: Locale }) {
	useEffect(() => {
		if (i18n.language !== locale) {
			void i18n.changeLanguage(locale);
		}

		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
	}, [locale]);

	return null;
}
