"use client"

import AboutSection from "@/components/aboutSection"
import ExperienceSection from "@/components/experienceSection"
import InfoSection from "@/components/infoSection"
import ProjectsSection from "@/components/projectsSection"
import { useTranslation } from "@repo/i18n"

export default function Home() {
	const { t } = useTranslation()

	return (
		<main className="flex flex-col gap-y-24">
			<section id="hero">
				<InfoSection />
			</section>

			<section id="about">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<h2 className="text-3xl font-bold mb-6">{t("aboutTitle")}</h2>
					<AboutSection />
				</div>
			</section>

			<section id="projects">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<h2 className="text-3xl font-bold">{t("projectsTitle")}</h2>
					<ProjectsSection />
				</div>
			</section>

			<section id="experience">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<h2 className="text-3xl font-bold">{t("experienceTitle")}</h2>
					<ExperienceSection />
				</div>
			</section>

			<section id="contact" className="min-h-screen">
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
