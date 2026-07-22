import "server-only";

import { defineCollection } from "@/lib/content/collection";

import { projectFrontmatterSchema, type Project, type ProjectFrontmatter } from "./types";

const projects = defineCollection<ProjectFrontmatter>({
	name: "projects",
	schema: projectFrontmatterSchema,
});

export const CONTENT_DIR = projects.dir;
export const getAllProjects = projects.getAll;
export const getProject = projects.get;
export const getAllSlugs = projects.getAllSlugs;
export const variantFor = projects.variantFor;

/** The homepage grid is two columns, so anything past four leaves a ragged row. */
export const FEATURED_LIMIT = 4;

/** Homepage selection: only entries carrying `featured`, ordered by its value. */
export async function getFeaturedProjects(): Promise<Project[]> {
	const all = await getAllProjects();

	return all
		.filter((project) => project.variants[project.sourceLocale]?.frontmatter.featured !== undefined)
		.sort((a, b) => {
			const orderA = a.variants[a.sourceLocale]?.frontmatter.featured ?? 0;
			const orderB = b.variants[b.sourceLocale]?.frontmatter.featured ?? 0;
			return orderA - orderB;
		})
		.slice(0, FEATURED_LIMIT);
}
