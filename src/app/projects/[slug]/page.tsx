import { notFound } from "next/navigation";
import Script from "next/script";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { BackLink } from "@/components/blog/back-link";
import { BackToTop } from "@/components/blog/back-to-top";
import { CopyPageButton } from "@/components/blog/copy-page-button";
import { PostDate } from "@/components/blog/post-meta";
import { PostScrubber } from "@/components/blog/post-scrubber";
import { Localized } from "@/components/localized";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { AuthorStack } from "@/components/projects/author-stack";
import { ProjectLinks } from "@/components/projects/project-links";
import { ProjectShowcase } from "@/components/projects/project-showcase";
import { ProjectStatusBadge } from "@/components/projects/project-status";
import { ProjectStack } from "@/components/projects/project-stack";
import { findPerson } from "@/constants/people";
import { SITE_URL } from "@/constants/profile";
import { mdxOptions } from "@/lib/blog/mdx-options";
import { extractToc } from "@/lib/blog/toc";
import { toMarkdown } from "@/lib/content/to-markdown";
import { DEFAULT_LOCALE, HTML_LANG, type Locale } from "@/lib/i18n/routing";
import { getAllProjects, getProject, variantFor, type Project } from "@/lib/projects/source";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const projects = await getAllProjects();

	return projects.map((project) => ({ slug: project.slug }));
}

function ProjectBody({ project, locale }: { project: Project; locale: Locale }) {
	const variant = variantFor(project, locale);
	const { title, description, date, cover, status, stack, links, gallery, authors } =
		variant.frontmatter;
	const path = `/projects/${project.slug}`;

	return (
		<div className="flex flex-col gap-10">
			<div className="flex items-center justify-between gap-4">
				<BackLink href="/projects" labelKey="projectsBack" />
				<CopyPageButton markdownPath={`${path}/markdown`} markdown={toMarkdown(variant, path)} />
			</div>

			<PostScrubber toc={extractToc(variant.body)} />

			<article className="flex flex-col gap-8">
				<header className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-bold leading-tight">{title}</h1>
						{status !== "completed" && <ProjectStatusBadge status={status} />}
					</div>

					<p className="text-muted-foreground leading-relaxed">{description}</p>

					<div className="flex items-center gap-3">
						<AuthorStack authors={authors} size="sm" />
						<PostDate
							date={date}
							className="font-serif text-muted-foreground/70 text-xs select-none"
						/>
					</div>
				</header>

				<ProjectShowcase cover={cover} title={title} images={gallery} />

				<div className="flex flex-wrap items-center justify-between gap-3">
					<ProjectStack stack={stack} />
					<ProjectLinks repo={links.repo} live={links.live} />
				</div>

				<div className="prose prose-neutral max-w-none">
					<MDXRemote source={variant.body} components={mdxComponents} options={mdxOptions} />
				</div>
			</article>
		</div>
	);
}

export default async function ProjectPage({ params }: PageProps) {
	const { slug } = await params;

	const project = await getProject(slug);
	if (!project) notFound();

	const { title, description, date, cover, stack, authors } = variantFor(
		project,
		DEFAULT_LOCALE
	).frontmatter;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: title,
		description,
		dateCreated: date,
		keywords: stack.join(", "),
		inLanguage: HTML_LANG[DEFAULT_LOCALE],
		url: `${SITE_URL}/projects/${slug}`,
		author: authors
			.map((author) => findPerson(author.id))
			.filter((person) => person !== undefined)
			.map((person) => ({
				"@type": "Person",
				name: person.name,
				url: person.url ?? person.github,
			})),
		...(cover ? { image: absoluteUrl(cover) } : {}),
	};

	return (
		<div className="flex flex-col gap-10">
			<Script
				id={`jsonld-project-${slug}`}
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>

			<Localized
				variants={{
					ptBR: <ProjectBody project={project} locale="ptBR" />,
					enUS: <ProjectBody project={project} locale="enUS" />,
				}}
			/>

			<BackToTop />
		</div>
	);
}
