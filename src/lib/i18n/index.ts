import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LOCALE } from "@/lib/i18n/routing";

import commonEnUS from "./locales/enUS/common.json";
import commonPtBR from "./locales/ptBR/common.json";

const i18n = createInstance();

i18n.use(initReactI18next).init({
	resources: {
		ptBR: { common: commonPtBR },
		enUS: { common: commonEnUS },
	},
	ns: ["common"],
	lng: DEFAULT_LOCALE,
	fallbackLng: DEFAULT_LOCALE,
	defaultNS: "common",
	interpolation: { escapeValue: false },
	initImmediate: false,
	react: { useSuspense: false },
});

export default i18n;
export { I18nextProvider, Trans, useTranslation } from "react-i18next";
