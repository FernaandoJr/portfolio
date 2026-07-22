import { SITE_URL } from "@/constants/profile";
import { getAllPosts } from "@/lib/blog/source";

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET() {
	const posts = await getAllPosts();

	const items = posts
		.map((post) => {
			const variant = post.variants[post.sourceLocale];
			if (!variant) return "";

			const url = `${SITE_URL}/blog/${post.slug}`;
			const pubDate = new Date(`${variant.frontmatter.date}T12:00:00Z`).toUTCString();

			return [
				"    <item>",
				`      <title>${escapeXml(variant.frontmatter.title)}</title>`,
				`      <link>${url}</link>`,
				`      <guid isPermaLink="true">${url}</guid>`,
				`      <description>${escapeXml(variant.frontmatter.description)}</description>`,
				`      <pubDate>${pubDate}</pubDate>`,
				...variant.frontmatter.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
				"    </item>",
			].join("\n");
		})
		.filter(Boolean)
		.join("\n");

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
		"  <channel>",
		"    <title>Fernando Jr — Blog</title>",
		`    <link>${SITE_URL}/blog</link>`,
		"    <description>Decisões de arquitetura, erros caros e o que eu faria diferente — escrito enquanto construo.</description>",
		"    <language>pt-BR</language>",
		`    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>`,
		items,
		"  </channel>",
		"</rss>",
	].join("\n");

	return new Response(xml, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
