import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { BackLink } from "@/components/blog/back-link";
import { BackToTop } from "@/components/blog/back-to-top";
import { CopyPageButton } from "@/components/blog/copy-page-button";
import { LocalizedContent } from "@/components/blog/localized-content";
import { mdxComponents } from "@/components/blog/mdx-components";
import { PostMeta } from "@/components/blog/post-meta";
import { SITE_URL } from "@/constants/profile";
import { PostScrubber } from "@/components/blog/post-scrubber";
import { mdxOptions } from "@/lib/blog/mdx-options";
import { extractToc, type TocEntry } from "@/lib/blog/toc";
import { toMarkdown } from "@/lib/blog/to-markdown";
import { getAllPosts, getPost } from "@/lib/blog/source";
import { LOCALES, type Locale, type PostVariant } from "@/lib/blog/types";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPost(slug);
	if (!post) return {};

	const canonical = post.variants[post.sourceLocale];
	if (!canonical) return {};

	const { title, description, date } = canonical.frontmatter;

	// No `images` here on purpose: that would override opengraph-image.tsx.
	return {
		title: `${title} — Fernando Jr`,
		description,
		alternates: { canonical: `/blog/${slug}` },
		openGraph: {
			type: "article",
			title,
			description,
			publishedTime: date,
			url: `/blog/${slug}`,
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
	};
}

function Article({ variant }: { variant: PostVariant }) {
	const { title, description, date } = variant.frontmatter;

	return (
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
	);
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;
	const post = await getPost(slug);
	if (!post) notFound();

	const content: Partial<Record<Locale, ReactNode>> = {};
	const markdown: Partial<Record<Locale, string>> = {};
	const toc: Partial<Record<Locale, TocEntry[]>> = {};

	for (const locale of LOCALES) {
		const variant = post.variants[locale];
		if (!variant) continue;
		content[locale] = <Article variant={variant} />;
		markdown[locale] = toMarkdown(variant, slug);
		toc[locale] = extractToc(variant.body);
	}

	const canonical = post.variants[post.sourceLocale];

	const jsonLd = canonical && {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: canonical.frontmatter.title,
		description: canonical.frontmatter.description,
		datePublished: canonical.frontmatter.date,
		keywords: canonical.frontmatter.tags.join(", "),
		inLanguage: post.sourceLocale === "ptBR" ? "pt-BR" : "en-US",
		mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
		author: { "@type": "Person", name: "Fernando Junior", url: SITE_URL },
		...(canonical.frontmatter.cover ? { image: `${SITE_URL}${canonical.frontmatter.cover}` } : {}),
	};

	return (
		<div className="flex flex-col gap-10">
			{jsonLd && (
				<Script
					id={`jsonld-${slug}`}
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			)}
			<div className="flex items-center justify-between gap-4">
				<BackLink href="/blog" labelKey="blogBack" />
				<CopyPageButton slug={slug} markdown={markdown} sourceLocale={post.sourceLocale} />
			</div>
			<PostScrubber toc={toc} sourceLocale={post.sourceLocale} />
			<LocalizedContent content={content} sourceLocale={post.sourceLocale} />
			<BackToTop />
		</div>
	);
}
