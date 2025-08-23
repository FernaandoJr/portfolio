import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enCommon from "@/public/locales/en/common.json"
import ptBRCommon from "@/public/locales/pt-BR/common.json"

// Initialize i18next on the client only once
if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		resources: {
			en: { common: enCommon as unknown as Record<string, string> },
			pt: { common: ptBRCommon as unknown as Record<string, string> },
		},
		lng: "en",
		fallbackLng: "en",
		supportedLngs: ["en", "pt"],
		defaultNS: "common",
		ns: ["common"],
		interpolation: { escapeValue: false },
		returnEmptyString: false,
	})
}

export default i18n
