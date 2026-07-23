import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogEmptyState, BlogIntro } from "@/components/blog/blog-intro";
import { PostCard } from "@/components/blog/post-card";
import { LocalizedRouteSync } from "@/components/localized-route-sync";
import { getAllPosts, variantFor } from "@/lib/blog/source";
import { isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

const COPY = {
	ptBR: {
		description:
			"Decisões de arquitetura, erros caros e o que eu faria diferente — escrito enquanto construo.",
	},
	enUS: {
		description:
			"Architecture decisions, expensive mistakes and what I would do differently — written while building.",
	},
} as const;

export function generateStaticParams() {
	return LOCALE_SEGMENTS.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale: segment } = await params;
	if (!isLocaleSegment(segment)) return {};

	return {
		title: "Blog — Fernando Jr",
		description: COPY[toLocale(segment)].description,
		alternates: {
			canonical: `/${segment}/blog`,
			languages: { "pt-BR": "/pt-br/blog", "en-US": "/en/blog" },
		},
	};
}

export default async function BlogPage({ params }: PageProps) {
	const { locale: segment } = await params;
	if (!isLocaleSegment(segment)) notFound();

	const locale = toLocale(segment);
	const posts = await getAllPosts();

	return (
		<div className="flex flex-col gap-10">
			<LocalizedRouteSync locale={locale} />
			<BlogIntro />

			{posts.length === 0 ? (
				<BlogEmptyState />
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{posts.map((post) => {
						const variant = variantFor(post, locale);

						return (
							<PostCard
								key={post.slug}
								href={`/${segment}/blog/${post.slug}`}
								title={variant.frontmatter.title}
								description={variant.frontmatter.description}
								date={variant.frontmatter.date}
								readingMinutes={variant.readingMinutes}
								cover={variant.frontmatter.cover}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
