import { SITE_URL } from "@/constants/profile";
import { getAllPosts, variantFor } from "@/lib/blog/source";
import { HTML_LANG, isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";

const CHANNEL = {
	ptBR: {
		description:
			"Decisões de arquitetura, erros caros e o que eu faria diferente — escrito enquanto construo.",
	},
	enUS: {
		description:
			"Architecture decisions, expensive mistakes and what I would do differently — written while building.",
	},
} as const;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export function generateStaticParams() {
	return LOCALE_SEGMENTS.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
	const { locale: segment } = await params;
	if (!isLocaleSegment(segment)) return new Response("Not found", { status: 404 });

	const locale = toLocale(segment);
	const posts = await getAllPosts();

	const items = posts
		.map((post) => {
			const variant = variantFor(post, locale);
			const url = `${SITE_URL}/${segment}/blog/${post.slug}`;
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
		.join("\n");

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
		"  <channel>",
		"    <title>Fernando Jr — Blog</title>",
		`    <link>${SITE_URL}/${segment}/blog</link>`,
		`    <description>${escapeXml(CHANNEL[locale].description)}</description>`,
		`    <language>${HTML_LANG[locale]}</language>`,
		`    <atom:link href="${SITE_URL}/${segment}/blog/rss.xml" rel="self" type="application/rss+xml"/>`,
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
