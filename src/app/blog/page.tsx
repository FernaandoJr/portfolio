import { BlogEmptyState, BlogIntro } from "@/components/blog/blog-intro";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts, variantFor } from "@/lib/blog/source";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";

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
						const variant = variantFor(post, DEFAULT_LOCALE);

						return (
							<PostCard
								key={post.slug}
								href={`/blog/${post.slug}`}
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
