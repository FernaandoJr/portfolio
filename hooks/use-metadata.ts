"use client"

import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export function useMetadata() {
	const { t, i18n } = useTranslation()

	useEffect(() => {
		const updateMetadata = () => {
			const isPortuguese = i18n.language === "pt"

			const title = document.querySelector("title")
			if (title) {
				title.textContent = t("home.title", { ns: "metadata" })
			}

			const metaDescription = document.querySelector(
				'meta[name="description"]'
			)
			if (metaDescription) {
				metaDescription.setAttribute(
					"content",
					t("home.description", { ns: "metadata" })
				)
			}

			const ogTitle = document.querySelector('meta[property="og:title"]')
			if (ogTitle) {
				ogTitle.setAttribute(
					"content",
					t("home.ogTitle", { ns: "metadata" })
				)
			}

			const ogDescription = document.querySelector(
				'meta[property="og:description"]'
			)
			if (ogDescription) {
				ogDescription.setAttribute(
					"content",
					t("home.ogDescription", { ns: "metadata" })
				)
			}

			const twitterTitle = document.querySelector(
				'meta[name="twitter:title"]'
			)
			if (twitterTitle) {
				twitterTitle.setAttribute(
					"content",
					t("home.twitterTitle", { ns: "metadata" })
				)
			}

			const twitterDescription = document.querySelector(
				'meta[name="twitter:description"]'
			)
			if (twitterDescription) {
				twitterDescription.setAttribute(
					"content",
					t("home.twitterDescription", { ns: "metadata" })
				)
			}

			const ogLocale = document.querySelector(
				'meta[property="og:locale"]'
			)
			if (ogLocale) {
				ogLocale.setAttribute(
					"content",
					isPortuguese ? "pt_BR" : "en_US"
				)
			}
		}

		updateMetadata()
		i18n.on("languageChanged", updateMetadata)
		return () => {
			i18n.off("languageChanged", updateMetadata)
		}
	}, [i18n, t])

	return {
		currentLanguage: i18n.language,
		isPortuguese: i18n.language === "pt",
	}
}
