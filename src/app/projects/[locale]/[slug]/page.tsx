import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { BackLink } from "@/components/blog/back-link";
import { BackToTop } from "@/components/blog/back-to-top";
import { CopyPageButton } from "@/components/blog/copy-page-button";
import { PostDate } from "@/components/blog/post-meta";
import { PostScrubber } from "@/components/blog/post-scrubber";
import { LocalizedRouteSync } from "@/components/localized-route-sync";
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
import { HTML_LANG, isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";
import { getAllProjects, getProject, variantFor } from "@/lib/projects/source";
import { absoluteUrl } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
	const projects = await getAllProjects();

	return LOCALE_SEGMENTS.flatMap((locale) =>
		projects.map((project) => ({ locale, slug: project.slug }))
	);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) return {};

	const project = await getProject(slug);
	if (!project) return {};

	const variant = variantFor(project, toLocale(segment));
	const { title, description, cover } = variant.frontmatter;

	// The cover is the product shot, so it beats any card we could generate.
	const images = cover ? [{ url: absoluteUrl(cover), alt: title }] : undefined;

	return {
		title: `${title} — Fernando Jr`,
		description,
		alternates: {
			canonical: `/projects/${segment}/${slug}`,
			languages: {
				"pt-BR": `/projects/pt/${slug}`,
				"en-US": `/projects/en/${slug}`,
			},
		},
		openGraph: {
			type: "article",
			locale: HTML_LANG[toLocale(segment)],
			title,
			description,
			url: `/projects/${segment}/${slug}`,
			...(images ? { images } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(images ? { images } : {}),
		},
	};
}

export default async function ProjectPage({ params }: PageProps) {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) notFound();

	const project = await getProject(slug);
	if (!project) notFound();

	const locale = toLocale(segment);
	const variant = variantFor(project, locale);
	const { title, description, date, cover, status, stack, links, gallery, authors } =
		variant.frontmatter;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: title,
		description,
		dateCreated: date,
		keywords: stack.join(", "),
		inLanguage: HTML_LANG[locale],
		url: `${SITE_URL}/projects/${segment}/${slug}`,
		author: authors
			.map((author) => findPerson(author.id))
			.filter((person) => person !== undefined)
			.map((person) => ({ "@type": "Person", name: person.name, url: person.url ?? person.github })),
		...(cover ? { image: absoluteUrl(cover) } : {}),
	};

	return (
		<div className="flex flex-col gap-10">
			<Script
				id={`jsonld-project-${slug}`}
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<LocalizedRouteSync locale={locale} />

			<div className="flex items-center justify-between gap-4">
				<BackLink href={`/projects/${segment}`} labelKey="projectsBack" />
				<CopyPageButton
					markdownPath={`/projects/${segment}/${slug}/markdown`}
					markdown={toMarkdown(variant, `/projects/${segment}/${slug}`)}
				/>
			</div>

			<PostScrubber toc={extractToc(variant.body)} />

			<article className="flex flex-col gap-8">
				<header className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-3xl font-bold leading-tight">{title}</h1>
						{status !== "completed" && <ProjectStatusBadge status={status} />}
					</div>

					<p className="text-muted-foreground leading-relaxed">{description}</p>

					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<AuthorStack authors={authors} size="sm" />
							<PostDate
								date={date}
								className="font-serif text-muted-foreground/70 text-xs select-none"
							/>
						</div>

						<ProjectStack stack={stack} />
					</div>
				</header>

				<ProjectShowcase cover={cover} title={title} images={gallery} />

				<ProjectLinks repo={links.repo} live={links.live} />

				<div className="prose prose-neutral max-w-none">
					<MDXRemote source={variant.body} components={mdxComponents} options={mdxOptions} />
				</div>
			</article>

			<BackToTop />
		</div>
	);
}
