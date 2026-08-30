import type { Metadata } from "next";

import { DEFAULT_LOCALE } from "@/lib/i18n/routing";
import { getProject, variantFor } from "@/lib/projects/source";
import { absoluteUrl } from "@/lib/seo";

type LayoutProps = { children: React.ReactNode; params: Promise<{ slug: string }> };

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	const project = await getProject(slug);
	if (!project) return {};

	const { title, description, cover } = variantFor(project, DEFAULT_LOCALE).frontmatter;

	const images = cover ? [{ url: absoluteUrl(cover), alt: title }] : undefined;

	return {
		title: `${title} | Fernando Jr`,
		description,
		alternates: { canonical: `/projects/${slug}` },
		openGraph: {
			type: "article",
			title,
			description,
			url: `/projects/${slug}`,
			...(images ? { images } : {}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(images ? { images } : {}),
		},
	};
}

export default function ProjectLayout({ children }: LayoutProps) {
	return children;
}
