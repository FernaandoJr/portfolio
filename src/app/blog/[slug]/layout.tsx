import type { Metadata } from "next";

import { getPost, variantFor } from "@/lib/blog/source";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";

type LayoutProps = { children: React.ReactNode; params: Promise<{ slug: string }> };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	const post = await getPost(slug);
	if (!post) return {};

	const { title, description, date } = variantFor(post, DEFAULT_LOCALE).frontmatter;

	return {
		title,
		description,
		alternates: { canonical: `/blog/${slug}` },
		openGraph: {
			type: "article",
			title,
			description,
			publishedTime: date,
			url: `/blog/${slug}`,
		},
		twitter: { card: "summary_large_image", title, description },
	};
}

export default function PostLayout({ children }: LayoutProps) {
	return children;
}
