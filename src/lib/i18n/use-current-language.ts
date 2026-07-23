"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import i18n from "@/lib/i18n";
import {
	DEFAULT_LOCALE,
	DEFAULT_SEGMENT,
	isLocale,
	isLocaleSegment,
	type Locale,
	type LocaleSegment,
} from "@/lib/i18n/routing";

export function useSegment(): LocaleSegment {
	const params = useParams<{ locale?: string }>();
	return params.locale && isLocaleSegment(params.locale) ? params.locale : DEFAULT_SEGMENT;
}

export function useCurrentLanguage(): Locale {
	const [language, setLanguage] = useState<Locale>(() =>
		isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE
	);

	useEffect(() => {
		function apply(next: string) {
			setLanguage(isLocale(next) ? next : DEFAULT_LOCALE);
		}

		apply(i18n.language);

		i18n.on("languageChanged", apply);
		return () => {
			i18n.off("languageChanged", apply);
		};
	}, []);

	return language;
}
