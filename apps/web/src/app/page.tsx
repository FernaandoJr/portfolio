"use client"

import AboutSection from "@/components/aboutSection"
import InfoSection from "@/components/infoSection"
import { useTranslation } from "@repo/i18n"

export default function Home() {
	const { t } = useTranslation()

	return (
		<main className="flex flex-col">
			<section id="hero" className="">
				<InfoSection />
			</section>

			<section id="about" className="py-24">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<h2 className="text-3xl font-bold mb-6">{t("aboutTitle")}</h2>
					<AboutSection />
				</div>
			</section>

			<section id="projects" className="min-h-screen py-24">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<h2 className="text-3xl font-bold">{t("projectsTitle")}</h2>
					<p className="mt-4 text-muted-foreground">
						{t("projectsSoon")}
					</p>
				</div>
			</section>

			<section id="contact" className="min-h-screen py-24">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<h2 className="text-3xl font-bold">{t("contactTitle")}</h2>
					<p className="mt-4 text-muted-foreground">
						{t("contactSoon")}
					</p>
				</div>
			</section>
		</main>
	)
}
