import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/profile";
import { getAllPosts } from "@/lib/blog/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: "monthly", priority: 1 },
		{ url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.6 },
		{ url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
	];

	const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${SITE_URL}/blog/${post.slug}`,
		lastModified: post.variants[post.sourceLocale]?.frontmatter.date,
		changeFrequency: "yearly",
		priority: 0.7,
	}));

	return [...staticRoutes, ...postRoutes];
}
