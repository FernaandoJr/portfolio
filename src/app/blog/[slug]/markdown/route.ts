import { getAllPosts, getPost, variantFor } from "@/lib/blog/source";
import { toMarkdown } from "@/lib/content/to-markdown";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({ slug: post.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const post = await getPost(slug);
	if (!post) return new Response("Not found", { status: 404 });

	const variant = variantFor(post, DEFAULT_LOCALE);

	return new Response(toMarkdown(variant, `/blog/${slug}`), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
