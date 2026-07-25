import { Localized } from "@/components/localized";
import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { ProjectsEmptyState, ProjectsIntro } from "@/components/projects/projects-intro";
import type { Locale } from "@/lib/i18n/routing";
import { getAllProjects, variantFor, type Project } from "@/lib/projects/source";

function ProjectGrid({ projects, locale }: { projects: Project[]; locale: Locale }) {
	const cards: ProjectCardData[] = projects.map((project) => {
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

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{cards.map((project) => (
				<ProjectCard key={project.slug} project={project} />
			))}
		</div>
	);
}

export default async function ProjectsPage() {
	const projects = await getAllProjects();

	if (projects.length === 0) {
		return (
			<div className="flex flex-col gap-10">
				<ProjectsIntro />
				<ProjectsEmptyState />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<ProjectsIntro />

			<Localized
				variants={{
					ptBR: <ProjectGrid projects={projects} locale="ptBR" />,
					enUS: <ProjectGrid projects={projects} locale="enUS" />,
				}}
			/>
		</div>
	);
}
