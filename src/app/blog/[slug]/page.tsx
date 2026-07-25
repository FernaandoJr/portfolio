import { notFound } from "next/navigation";
import Script from "next/script";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { BackLink } from "@/components/blog/back-link";
import { BackToTop } from "@/components/blog/back-to-top";
import { CopyPageButton } from "@/components/blog/copy-page-button";
import { PostMeta } from "@/components/blog/post-meta";
import { PostScrubber } from "@/components/blog/post-scrubber";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { SITE_URL } from "@/constants/profile";
import { mdxOptions } from "@/lib/blog/mdx-options";
import { getAllPosts, getPost, variantFor } from "@/lib/blog/source";
import { extractToc } from "@/lib/blog/toc";
import { toMarkdown } from "@/lib/content/to-markdown";
import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;

	const post = await getPost(slug);
	if (!post) notFound();

	const variant = variantFor(post, DEFAULT_LOCALE);
	const { title, description, date, tags, cover } = variant.frontmatter;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: title,
		description,
		datePublished: date,
		keywords: tags.join(", "),
		inLanguage: HTML_LANG[DEFAULT_LOCALE],
		mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
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

			<div className="flex items-center justify-between gap-4">
				<BackLink href="/blog" labelKey="blogBack" />
				<CopyPageButton
					markdownPath={`/blog/${slug}/markdown`}
					markdown={toMarkdown(variant, `/blog/${slug}`)}
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
