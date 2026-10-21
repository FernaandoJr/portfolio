import AboutSection from "@/components/aboutSection";
import ExperienceSection from "@/components/experienceSection";
import InfoSection from "@/components/infoSection";
import ProjectsSection from "@/components/projectsSection";
import QuoteSection from "@/components/quoteSection";
import { TranslatedSectionHeading } from "@/components/ui/translated-section-heading";

export default function Home() {
	return (
		<main className="flex flex-col gap-y-18">
			<section id="hero">
				<InfoSection />
			</section>

			<section id="about">
				<TranslatedSectionHeading id="about" tKey="aboutTitle" className="mb-6" />
				<AboutSection />
			</section>

			<section id="projects">
				<TranslatedSectionHeading id="projects" tKey="projectsTitle" />
				<ProjectsSection />
			</section>

			<section id="experience">
				<TranslatedSectionHeading id="experience" tKey="experienceTitle" />
				<ExperienceSection />
			</section>

			<QuoteSection />
		</main>
	);
}
