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
