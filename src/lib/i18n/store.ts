import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/routing";

type LocaleStore = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleStore>()(
	persist(
		(set) => ({
			locale: DEFAULT_LOCALE,
			setLocale: (locale) => set({ locale }),
		}),
		{ name: "locale", skipHydration: true }
	)
);
