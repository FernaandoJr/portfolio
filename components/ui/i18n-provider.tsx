"use client"

import { PropsWithChildren, useEffect, Fragment } from "react"
import i18n from "@/lib/i18n"

type Props = PropsWithChildren<{
	lang?: string
}>

export function I18nProvider({ children, lang }: Props) {
	// Ensure the active language reflects the html lang (or provided lang)
	useEffect(() => {
		const raw = lang || document.documentElement.lang || "en"
		// Normalize: use base language for region variants if not available
		const base = raw.toLowerCase()
		const normalized = base.includes("-") ? base.split("-")[0] : base
		if (i18n.language !== normalized) {
			i18n.changeLanguage(normalized).catch(() => {})
		}
	}, [lang])

	return <Fragment>{children}</Fragment>
}
