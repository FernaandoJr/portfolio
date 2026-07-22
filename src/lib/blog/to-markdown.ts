import { SITE_URL } from "@/constants/profile";

import type { PostVariant } from "./types";

export function toMarkdown(variant: PostVariant, slug: string): string {
	const { title, description } = variant.frontmatter;

	return [
		`# ${title}`,
		"",
		`> ${description}`,
		"",
		variant.body.trim(),
		"",
		"---",
		"",
		`${SITE_URL}/blog/${slug}`,
	].join("\n");
}
