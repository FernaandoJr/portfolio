import type { Metadata } from "next";

import { BlogEmptyState, BlogIntro } from "@/components/blog/blog-intro";
import { PostCard, type PostCardVariant } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/blog/source";
import { LOCALES, type Locale } from "@/lib/blog/types";

export const metadata: Metadata = {
	title: "Blog — Fernando Jr",
	description:
		"Decisões de arquitetura, erros caros e o que eu faria diferente — escrito enquanto construo.",
	alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
	const posts = await getAllPosts();

	return (
		<div className="flex flex-col gap-10">
			<BlogIntro />

			{posts.length === 0 ? (
				<BlogEmptyState />
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{posts.map((post) => {
						const variants: Partial<Record<Locale, PostCardVariant>> = {};

						for (const locale of LOCALES) {
							const variant = post.variants[locale];
							if (!variant) continue;

							variants[locale] = {
								title: variant.frontmatter.title,
								description: variant.frontmatter.description,
								date: variant.frontmatter.date,
								tags: variant.frontmatter.tags,
								cover: variant.frontmatter.cover,
								readingMinutes: variant.readingMinutes,
							};
						}

						return (
							<PostCard
								key={post.slug}
								slug={post.slug}
								sourceLocale={post.sourceLocale}
								variants={variants}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
}
