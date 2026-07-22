import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { BackLink } from "@/components/blog/back-link";
import { BackToTop } from "@/components/blog/back-to-top";
import { CopyPageButton } from "@/components/blog/copy-page-button";
import { PostMeta } from "@/components/blog/post-meta";
import { PostScrubber } from "@/components/blog/post-scrubber";
import { LocalizedRouteSync } from "@/components/localized-route-sync";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { SITE_URL } from "@/constants/profile";
import { mdxOptions } from "@/lib/blog/mdx-options";
import { getAllPosts, getPost, variantFor } from "@/lib/blog/source";
import { toMarkdown } from "@/lib/content/to-markdown";
import { extractToc } from "@/lib/blog/toc";
import { HTML_LANG, isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return LOCALE_SEGMENTS.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) return {};

	const post = await getPost(slug);
	if (!post) return {};

	const variant = variantFor(post, toLocale(segment));
	const { title, description, date } = variant.frontmatter;

	// No `images` here on purpose: that would override opengraph-image.tsx.
	return {
		title: `${title} — Fernando Jr`,
		description,
		alternates: {
			canonical: `/blog/${segment}/${slug}`,
			languages: {
				"pt-BR": `/blog/pt/${slug}`,
				"en-US": `/blog/en/${slug}`,
			},
		},
		openGraph: {
			type: "article",
			locale: HTML_LANG[toLocale(segment)],
			title,
			description,
			publishedTime: date,
			url: `/blog/${segment}/${slug}`,
		},
		twitter: { card: "summary_large_image", title, description },
	};
}

export default async function PostPage({ params }: PageProps) {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) notFound();

	const post = await getPost(slug);
	if (!post) notFound();

	const locale = toLocale(segment);
	const variant = variantFor(post, locale);
	const { title, description, date, tags, cover } = variant.frontmatter;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		description,
		datePublished: date,
		keywords: tags.join(", "),
		inLanguage: HTML_LANG[locale],
		mainEntityOfPage: `${SITE_URL}/blog/${segment}/${slug}`,
		author: { "@type": "Person", name: "Fernando Junior", url: SITE_URL },
		...(cover ? { image: `${SITE_URL}${cover}` } : {}),
	};

	return (
		<div className="flex flex-col gap-10">
			<Script
				id={`jsonld-${slug}`}
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<LocalizedRouteSync locale={locale} />

			<div className="flex items-center justify-between gap-4">
				<BackLink href={`/blog/${segment}`} labelKey="blogBack" />
				<CopyPageButton
					markdownPath={`/blog/${segment}/${slug}/markdown`}
					markdown={toMarkdown(variant, `/blog/${segment}/${slug}`)}
				/>
			</div>

			<PostScrubber toc={extractToc(variant.body)} />

			<article className="flex flex-col gap-8">
				<header className="flex flex-col gap-3">
					<h1 className="text-3xl font-bold leading-tight">{title}</h1>
					<p className="text-muted-foreground leading-relaxed">{description}</p>
					<PostMeta date={date} readingMinutes={variant.readingMinutes} />
				</header>

				<div className="prose prose-neutral max-w-none">
					<MDXRemote source={variant.body} components={mdxComponents} options={mdxOptions} />
				</div>
			</article>

			<BackToTop />
		</div>
	);
}
