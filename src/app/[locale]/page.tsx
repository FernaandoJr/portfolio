import { notFound } from "next/navigation";

import AboutSection from "@/components/aboutSection";
import ExperienceSection from "@/components/experienceSection";
import InfoSection from "@/components/infoSection";
import { LocalizedRouteSync } from "@/components/localized-route-sync";
import ProjectsSection from "@/components/projectsSection";
import QuoteSection from "@/components/quoteSection";
import { TranslatedSectionHeading } from "@/components/ui/translated-section-heading";
import { isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";

export function generateStaticParams() {
	return LOCALE_SEGMENTS.map((locale) => ({ locale }));
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale: segment } = await params;
	if (!isLocaleSegment(segment)) notFound();

	return (
		<main className="flex flex-col gap-y-18">
			<LocalizedRouteSync locale={toLocale(segment)} />

			<section id="hero">
				<InfoSection />
			</section>

			<section id="about">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<TranslatedSectionHeading id="about" tKey="aboutTitle" className="mb-6" />
					<AboutSection />
				</div>
			</section>

			<section id="projects">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<TranslatedSectionHeading id="projects" tKey="projectsTitle" />
					<ProjectsSection />
				</div>
			</section>

			<section id="experience">
				<div className="w-full max-w-3xl mx-auto px-6 lg:px-0">
					<TranslatedSectionHeading id="experience" tKey="experienceTitle" />
					<ExperienceSection />
				</div>
			</section>

			<QuoteSection />
		</main>
	);
}
