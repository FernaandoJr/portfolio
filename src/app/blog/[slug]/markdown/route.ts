import type { NextRequest } from "next/server";

import { getAllPosts, getPost } from "@/lib/blog/source";
import { toMarkdown } from "@/lib/blog/to-markdown";
import { isLocale } from "@/lib/blog/types";

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) {
		return new Response("Not found", { status: 404 });
	}

	const requested = req.nextUrl.searchParams.get("lang");
	const locale = requested && isLocale(requested) ? requested : post.sourceLocale;
	const variant = post.variants[locale] ?? post.variants[post.sourceLocale];

	if (!variant) {
		return new Response("Not found", { status: 404 });
	}

	return new Response(toMarkdown(variant, slug), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
