import { BlogEmptyState, BlogIntro } from "@/components/blog/blog-intro";
import { PostCard } from "@/components/blog/post-card";
import { Localized } from "@/components/localized";
import { assignBlogCovers } from "@/lib/blog/cover-pool";
import { getAllPosts, variantFor, type Post } from "@/lib/blog/source";
import type { Locale } from "@/lib/i18n/routing";

function PostGrid({
	posts,
	locale,
	covers,
}: {
	posts: Post[];
	locale: Locale;
	covers: Record<string, string>;
}) {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{posts.map((post) => {
				const variant = variantFor(post, locale);
				const cover = covers[post.slug];
				if (!cover) return null;

				return (
					<PostCard
						key={post.slug}
						href={`/blog/${post.slug}`}
						title={variant.frontmatter.title}
						description={variant.frontmatter.description}
						date={variant.frontmatter.date}
						readingMinutes={variant.readingMinutes}
						cover={cover}
					/>
				);
			})}
		</div>
	);
}

export default async function BlogPage() {
	const posts = await getAllPosts();

	if (posts.length === 0) {
		return (
			<div className="flex flex-col gap-10">
				<BlogIntro />
				<BlogEmptyState />
			</div>
		);
	}

	const covers = assignBlogCovers(posts.map((post) => post.slug));

	return (
		<div className="flex flex-col gap-10">
			<BlogIntro />

			<Localized
				variants={{
					ptBR: <PostGrid posts={posts} locale="ptBR" covers={covers} />,
					enUS: <PostGrid posts={posts} locale="enUS" covers={covers} />,
				}}
			/>
		</div>
	);
}
