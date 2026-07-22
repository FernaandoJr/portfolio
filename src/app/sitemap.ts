import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/profile";
import { getAllPosts } from "@/lib/blog/source";
import { LOCALE_SEGMENTS } from "@/lib/i18n/routing";
import { getAllProjects } from "@/lib/projects/source";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: "monthly", priority: 1 },
		{ url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
	];

	const blogIndexes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.map((segment) => ({
		url: `${SITE_URL}/blog/${segment}`,
		changeFrequency: "weekly",
		priority: 0.8,
		alternates: {
			languages: {
				"pt-BR": `${SITE_URL}/blog/pt`,
				"en-US": `${SITE_URL}/blog/en`,
			},
		},
	}));

	const postRoutes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.flatMap((segment) =>
		posts.map((post) => {
			const cover = post.variants[post.sourceLocale]?.frontmatter.cover;

			return {
				url: `${SITE_URL}/blog/${segment}/${post.slug}`,
				lastModified: post.variants[post.sourceLocale]?.frontmatter.date,
				changeFrequency: "yearly" as const,
				priority: 0.7,
				...(cover ? { images: [absoluteUrl(cover)] } : {}),
				alternates: {
					languages: {
						"pt-BR": `${SITE_URL}/blog/pt/${post.slug}`,
						"en-US": `${SITE_URL}/blog/en/${post.slug}`,
					},
				},
			};
		})
	);

	const projectIndexes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.map((segment) => ({
		url: `${SITE_URL}/projects/${segment}`,
		changeFrequency: "monthly",
		priority: 0.8,
		alternates: {
			languages: {
				"pt-BR": `${SITE_URL}/projects/pt`,
				"en-US": `${SITE_URL}/projects/en`,
			},
		},
	}));

	const projectRoutes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.flatMap((segment) =>
		projects.map((project) => {
			const source = project.variants[project.sourceLocale];
			const cover = source?.frontmatter.cover;
			const gallery = source?.frontmatter.gallery ?? [];

			// Image sitemaps are how Google associates a screenshot with the page
			// it belongs to — the carousel shots are never crawled on their own.
			// Deduped because the same file may serve as both cover and slide.
			const images = [
				...new Set(
					[...(cover ? [cover] : []), ...gallery.map((image) => image.src)].map(absoluteUrl)
				),
			];

			return {
				url: `${SITE_URL}/projects/${segment}/${project.slug}`,
				lastModified: source?.frontmatter.date,
				changeFrequency: "yearly" as const,
				priority: 0.7,
				...(images.length > 0 ? { images } : {}),
				alternates: {
					languages: {
						"pt-BR": `${SITE_URL}/projects/pt/${project.slug}`,
						"en-US": `${SITE_URL}/projects/en/${project.slug}`,
					},
				},
			};
		})
	);

	return [
		...staticRoutes,
		...blogIndexes,
		...postRoutes,
		...projectIndexes,
		...projectRoutes,
	];
}
