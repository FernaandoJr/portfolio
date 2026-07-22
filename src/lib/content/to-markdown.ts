import { SITE_URL } from "@/constants/profile";

import type { BaseFrontmatter, Variant } from "./types";

/** `path` is the site-absolute page path, e.g. /blog/pt/my-post. */
export function toMarkdown(variant: Variant<BaseFrontmatter>, path: string): string {
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
		`${SITE_URL}${path}`,
	].join("\n");
}
