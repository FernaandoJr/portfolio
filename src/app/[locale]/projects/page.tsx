import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalizedRouteSync } from "@/components/localized-route-sync";
import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { ProjectsEmptyState, ProjectsIntro } from "@/components/projects/projects-intro";
import { getAllProjects, variantFor } from "@/lib/projects/source";
import { isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

const COPY = {
	ptBR: {
		title: "Projetos — Fernando Jr",
		description: "Tudo que eu construí, com o contexto por trás de cada decisão.",
	},
	enUS: {
		title: "Projects — Fernando Jr",
		description: "Everything I have built, with the context behind each decision.",
	},
} as const;

export function generateStaticParams() {
	return LOCALE_SEGMENTS.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale: segment } = await params;
	if (!isLocaleSegment(segment)) return {};

	const copy = COPY[toLocale(segment)];

	return {
		title: copy.title,
		description: copy.description,
		alternates: {
			canonical: `/${segment}/projects`,
			languages: { "pt-BR": "/pt-br/projects", "en-US": "/en/projects" },
		},
	};
}

export default async function ProjectsPage({ params }: PageProps) {
	const { locale: segment } = await params;
	if (!isLocaleSegment(segment)) notFound();

	const locale = toLocale(segment);
	const projects = await getAllProjects();

	const cards: ProjectCardData[] = projects.map((project) => {
		const variant = variantFor(project, locale);

		return {
			slug: project.slug,
			href: `/${segment}/projects/${project.slug}`,
			title: variant.frontmatter.title,
			description: variant.frontmatter.description,
			cover: variant.frontmatter.cover,
			stack: variant.frontmatter.stack,
			status: variant.frontmatter.status,
		};
	});

	return (
		<div className="flex flex-col gap-10">
			<LocalizedRouteSync locale={locale} />
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
