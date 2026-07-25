import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { ProjectsEmptyState, ProjectsIntro } from "@/components/projects/projects-intro";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";
import { getAllProjects, variantFor } from "@/lib/projects/source";

export default async function ProjectsPage() {
	const projects = await getAllProjects();

	const cards: ProjectCardData[] = projects.map((project) => {
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

	return (
		<div className="flex flex-col gap-10">
			<ProjectsIntro />

			{cards.length === 0 ? (
				<ProjectsEmptyState />
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{cards.map((project) => (
						<ProjectCard key={project.slug} project={project} />
					))}
				</div>
			)}
		</div>
	);
}
