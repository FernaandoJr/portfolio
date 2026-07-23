import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/profile";
import { getAllPosts } from "@/lib/blog/source";
import { LOCALE_SEGMENTS } from "@/lib/i18n/routing";
import { getAllProjects } from "@/lib/projects/source";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

	const homeRoutes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.map((segment) => ({
		url: `${SITE_URL}/${segment}`,
		changeFrequency: "monthly",
		priority: 1,
		alternates: {
			languages: { "pt-BR": `${SITE_URL}/pt-br`, "en-US": `${SITE_URL}/en` },
		},
	}));

	const aboutRoutes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.map((segment) => ({
		url: `${SITE_URL}/${segment}/about`,
		changeFrequency: "yearly",
		priority: 0.6,
		alternates: {
			languages: { "pt-BR": `${SITE_URL}/pt-br/about`, "en-US": `${SITE_URL}/en/about` },
		},
	}));

	const blogIndexes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.map((segment) => ({
		url: `${SITE_URL}/${segment}/blog`,
		changeFrequency: "weekly",
		priority: 0.8,
		alternates: {
			languages: {
				"pt-BR": `${SITE_URL}/pt-br/blog`,
				"en-US": `${SITE_URL}/en/blog`,
			},
		},
	}));

	const postRoutes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.flatMap((segment) =>
		posts.map((post) => {
			const cover = post.variants[post.sourceLocale]?.frontmatter.cover;

			return {
				url: `${SITE_URL}/${segment}/blog/${post.slug}`,
				lastModified: post.variants[post.sourceLocale]?.frontmatter.date,
				changeFrequency: "yearly" as const,
				priority: 0.7,
				...(cover ? { images: [absoluteUrl(cover)] } : {}),
				alternates: {
					languages: {
						"pt-BR": `${SITE_URL}/pt-br/blog/${post.slug}`,
						"en-US": `${SITE_URL}/en/blog/${post.slug}`,
					},
				},
			};
		})
	);

	const projectIndexes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.map((segment) => ({
		url: `${SITE_URL}/${segment}/projects`,
		changeFrequency: "monthly",
		priority: 0.8,
		alternates: {
			languages: {
				"pt-BR": `${SITE_URL}/pt-br/projects`,
				"en-US": `${SITE_URL}/en/projects`,
			},
		},
	}));

	const projectRoutes: MetadataRoute.Sitemap = LOCALE_SEGMENTS.flatMap((segment) =>
		projects.map((project) => {
			const source = project.variants[project.sourceLocale];
			const cover = source?.frontmatter.cover;
			const gallery = source?.frontmatter.gallery ?? [];

			const images = [
				...new Set(
					[...(cover ? [cover] : []), ...gallery.map((image) => image.src)].map(absoluteUrl)
				),
			];

			return {
				url: `${SITE_URL}/${segment}/projects/${project.slug}`,
				lastModified: source?.frontmatter.date,
				changeFrequency: "yearly" as const,
				priority: 0.7,
				...(images.length > 0 ? { images } : {}),
				alternates: {
					languages: {
						"pt-BR": `${SITE_URL}/pt-br/projects/${project.slug}`,
						"en-US": `${SITE_URL}/en/projects/${project.slug}`,
					},
				},
			};
		})
	);

	return [
		...homeRoutes,
		...aboutRoutes,
		...blogIndexes,
		...postRoutes,
		...projectIndexes,
		...projectRoutes,
	];
}
