import { SITE_URL } from "@/constants/profile";

import type { BaseFrontmatter, Variant } from "./types";

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
