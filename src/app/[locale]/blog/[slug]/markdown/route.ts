import { getAllPosts, getPost, variantFor } from "@/lib/blog/source";
import { toMarkdown } from "@/lib/content/to-markdown";
import { isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return LOCALE_SEGMENTS.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ locale: string; slug: string }> }
) {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) return new Response("Not found", { status: 404 });

	const post = await getPost(slug);
	if (!post) return new Response("Not found", { status: 404 });

	const variant = variantFor(post, toLocale(segment));

	return new Response(toMarkdown(variant, `/${segment}/blog/${slug}`), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
