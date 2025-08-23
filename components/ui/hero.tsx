"use client"

import { Download } from "lucide-react"
import { Button } from "./button"
import { Typewriter } from "./typewriter"
import { useTranslation } from "react-i18next"

export default function Hero() {
	const { t } = useTranslation()

	return (
		<div className="py-40 container mx-auto px-4">
			<div className="">
				<div className="flex flex-col items-center justify-center gap-4 text-center">
					<h1 className="text-4xl font-bold text-center tracking-tight sm:text-5xl md:text-6xl">
						{t("hiIm")}
						<span className="text-primary">{t("fernando")}</span>
					</h1>
					<h2 className="md:text-lg text-muted-foreground sm:text-sm">
						<span>{t("passionateAbout")}</span>
						<Typewriter
							text={[
								t("technology"),
								t("programming"),
								t("webDevelopment"),
								t("openSourceProjects"),
								t("games"),
								t("ai"),
							]}
							speed={75}
							className="text-secondary dark:text-accent-foreground"
							waitTime={1500}
							deleteSpeed={50}
							cursorChar={"▏"}
						/>
					</h2>
					<div className="w-full max-w-[400px] text-center ">
						<p>{t("subtext")}</p>
					</div>
					<div className="flex flex-row gap-4">
						<Button
							variant={"secondary"}
							className="cursor-pointer">
							<Download className="text-secondary-foreground" />
							{t("downloadCV")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
