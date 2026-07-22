"use client";

import { useEffect } from "react";

import i18n from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/routing";

/**
 * Under /blog and /projects the URL owns the language, so the shared i18n
 * instance and the cookie are pulled to match it. Without this the page could
 * render in English while the header and buttons stayed in Portuguese. The
 * cookie keeps the ptBR/enUS form the rest of the app already reads.
 */
export function LocalizedRouteSync({ locale }: { locale: Locale }) {
	useEffect(() => {
		if (i18n.language !== locale) {
			void i18n.changeLanguage(locale);
		}

		document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
	}, [locale]);

	return null;
}
