import { notFound } from "next/navigation";
import Script from "next/script";

import { MDXRemote } from "next-mdx-remote-client/rsc";

import { BackLink } from "@/components/blog/back-link";
import { BackToTop } from "@/components/blog/back-to-top";
import { CopyPageButton } from "@/components/blog/copy-page-button";
import { PostMeta } from "@/components/blog/post-meta";
import { PostScrubber } from "@/components/blog/post-scrubber";
import { Localized } from "@/components/localized";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { SITE_URL } from "@/constants/profile";
import { mdxOptions } from "@/lib/blog/mdx-options";
import { getAllPosts, getPost, variantFor, type Post } from "@/lib/blog/source";
import { extractToc } from "@/lib/blog/toc";
import { toMarkdown } from "@/lib/content/to-markdown";
import { DEFAULT_LOCALE, HTML_LANG, type Locale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({ slug: post.slug }));
}

function PostBody({ post, locale }: { post: Post; locale: Locale }) {
	const variant = variantFor(post, locale);
	const { title, description, date } = variant.frontmatter;
	const path = `/blog/${post.slug}`;

	return (
		<div className="flex flex-col gap-10">
			<div className="flex items-center justify-between gap-4">
				<BackLink href="/blog" labelKey="blogBack" />
				<CopyPageButton markdownPath={`${path}/markdown`} markdown={toMarkdown(variant, path)} />
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
		</div>
	);
}

export default async function PostPage({ params }: PageProps) {
	const { slug } = await params;

	const post = await getPost(slug);
	if (!post) notFound();

	const { title, description, date, tags, cover } = variantFor(post, DEFAULT_LOCALE).frontmatter;

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

			<Localized
				variants={{
					ptBR: <PostBody post={post} locale="ptBR" />,
					enUS: <PostBody post={post} locale="enUS" />,
				}}
			/>

			<BackToTop />
		</div>
	);
}
