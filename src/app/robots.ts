import type { MetadataRoute } from "next";

import { SITE_URL } from "@/constants/profile";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				// Raw markdown mirrors the page that already ranks; indexing both
				// would put two URLs with the same content against each other.
				disallow: ["/api/", "/blog/*/*/markdown", "/projects/*/*/markdown"],
			},
		],
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
