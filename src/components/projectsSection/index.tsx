import { Localized } from "@/components/localized";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import type { ProjectCardData } from "@/components/projects/project-card";
import type { Locale } from "@/lib/i18n/routing";
import { getFeaturedProjects, variantFor, type Project } from "@/lib/projects/source";

function Featured({ projects, locale }: { projects: Project[]; locale: Locale }) {
	const cards = projects.map((project): ProjectCardData => {
		const variant = variantFor(project, locale);

		return {
			slug: project.slug,
			href: `/projects/${project.slug}`,
			title: variant.frontmatter.title,
			description: variant.frontmatter.description,
			cover: variant.frontmatter.cover,
			stack: variant.frontmatter.stack,
			status: variant.frontmatter.status,
		};
	});

	return <FeaturedProjects projects={cards} />;
}

export default async function ProjectsSection() {
	const projects = await getFeaturedProjects();

	return (
		<Localized
			variants={{
				ptBR: <Featured projects={projects} locale="ptBR" />,
				enUS: <Featured projects={projects} locale="enUS" />,
			}}
		/>
	);
}
