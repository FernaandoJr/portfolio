import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/profile";
import { getAllPosts } from "@/lib/blog/source";
import { getAllProjects } from "@/lib/projects/source";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: "monthly", priority: 1 },
		{ url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
		{ url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
		{ url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
	];

	const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
		const cover = post.variants[post.sourceLocale]?.frontmatter.cover;

		return {
			url: `${SITE_URL}/blog/${post.slug}`,
			lastModified: post.variants[post.sourceLocale]?.frontmatter.date,
			changeFrequency: "yearly" as const,
			priority: 0.7,
			...(cover ? { images: [absoluteUrl(cover)] } : {}),
		};
	});

	const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => {
		const source = project.variants[project.sourceLocale];
		const cover = source?.frontmatter.cover;
		const gallery = source?.frontmatter.gallery ?? [];

		const images = [
			...new Set([...(cover ? [cover] : []), ...gallery.map((image) => image.src)].map(absoluteUrl)),
		];

		return {
			url: `${SITE_URL}/projects/${project.slug}`,
			lastModified: source?.frontmatter.date,
			changeFrequency: "yearly" as const,
			priority: 0.7,
			...(images.length > 0 ? { images } : {}),
		};
	});

	return [...staticRoutes, ...postRoutes, ...projectRoutes];
}
