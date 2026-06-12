"use client"

import AboutSection from "@/components/aboutSection"
import ExperienceSection from "@/components/experienceSection"
import InfoSection from "@/components/infoSection"
import ProjectsSection from "@/components/projectsSection"
import QuoteSection from "@/components/quoteSection"
import { SectionHeading } from "@/components/ui/section-heading"
import { useTranslation } from "@repo/i18n"

export default function Home() {
	const { t } = useTranslation()

	return (
		<main className="flex flex-col gap-y-18">
			<section id="hero">
				<InfoSection />
			</section>

			<section id="about">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<SectionHeading id="about" className="mb-6">{t("aboutTitle")}</SectionHeading>
					<AboutSection />
				</div>
			</section>

			<section id="projects">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<SectionHeading id="projects">{t("projectsTitle")}</SectionHeading>
					<ProjectsSection />
				</div>
			</section>

			<section id="experience">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<SectionHeading id="experience">{t("experienceTitle")}</SectionHeading>
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

			<QuoteSection />
		</main>
	)
}
