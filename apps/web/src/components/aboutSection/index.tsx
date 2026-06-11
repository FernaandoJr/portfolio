"use client"

import { useTranslation } from "@repo/i18n"
import Link from "next/link"

export default function AboutSection() {
	const { t } = useTranslation()

	return (
		<ul className="flex flex-col gap-3 text-muted-foreground text-sm leading-relaxed list-disc list-outside ml-4 marker:text-muted-foreground/40">
			<li>{t("aboutP1")}</li>
			<li>{t("aboutP2")}</li>
			<li>{t("aboutP3")}</li>
			<li>
				{t("aboutCreator")}{" "}
				<Link
					href="https://github.com/FernaandoJr/astrovista"
					target="_blank"
					rel="noopener noreferrer"
					className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
				>
					{t("aboutAstroVista")}
				</Link>{" "}
				{t("aboutAstroVistaDesc")}
			</li>
		</ul>
	)
}
