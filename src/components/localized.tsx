"use client";

import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n/routing";
import { useLocaleStore } from "@/lib/i18n/store";

export function Localized({ variants }: { variants: Record<Locale, ReactNode> }) {
	const locale = useLocaleStore((state) => state.locale);

	return variants[locale];
}
