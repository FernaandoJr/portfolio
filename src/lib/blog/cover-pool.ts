const COVER_COUNT = 113;

export const BLOG_COVERS = Array.from(
	{ length: COVER_COUNT },
	(_, i) => `/blog/covers/cover-${String(i + 1).padStart(3, "0")}.webp`
);

function hashSlug(slug: string): number {
	let hash = 2166136261;
	for (let i = 0; i < slug.length; i++) {
		hash ^= slug.charCodeAt(i);
		hash = Math.imul(hash, 16777619);
	}
	return hash >>> 0;
}

export function assignBlogCovers(slugs: readonly string[]): Record<string, string> {
	const remaining = [...BLOG_COVERS];
	const assigned: Record<string, string> = {};

	for (const slug of [...slugs].sort((a, b) => a.localeCompare(b))) {
		if (remaining.length === 0) break;
		const index = hashSlug(slug) % remaining.length;
		assigned[slug] = remaining.splice(index, 1)[0]!;
	}

	return assigned;
}
