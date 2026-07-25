import { FeaturedProjects } from "@/components/projects/featured-projects";
import type { ProjectCardData } from "@/components/projects/project-card";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";
import { getFeaturedProjects, variantFor } from "@/lib/projects/source";

export default async function ProjectsSection() {
	const projects = await getFeaturedProjects();

	const cards = projects.map((project): ProjectCardData => {
		const variant = variantFor(project, DEFAULT_LOCALE);

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
