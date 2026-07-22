import { FeaturedProjects } from "@/components/projects/featured-projects";
import type { ProjectCardData } from "@/components/projects/project-card";
import { LOCALES, toSegment, type Locale } from "@/lib/i18n/routing";
import { getFeaturedProjects } from "@/lib/projects/source";
import { variantFor } from "@/lib/projects/source";

export default async function ProjectsSection() {
	const projects = await getFeaturedProjects();

	const byLocale = Object.fromEntries(
		LOCALES.map((locale) => [
			locale,
			projects.map((project): ProjectCardData => {
				const variant = variantFor(project, locale);

				return {
					slug: project.slug,
					href: `/projects/${toSegment(locale)}/${project.slug}`,
					title: variant.frontmatter.title,
					description: variant.frontmatter.description,
					cover: variant.frontmatter.cover,
					stack: variant.frontmatter.stack,
					status: variant.frontmatter.status,
				};
			}),
		])
	) as Record<Locale, ProjectCardData[]>;

	return <FeaturedProjects byLocale={byLocale} />;
}
