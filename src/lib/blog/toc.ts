import GithubSlugger from "github-slugger";

import { normalizeNewlines } from "./hash";

export type TocEntry = {
	id: string;
	text: string;
	depth: 2 | 3;
};

const FENCE = /^\s*(`{3,}|~{3,})/;
const HEADING = /^(#{2,3})\s+(.+?)\s*$/;

function stripInline(value: string): string {
	return value
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\*\*([^*]+)\*\*/g, "$1")
		.replace(/\*([^*]+)\*/g, "$1")
		.replace(/_([^_]+)_/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, "")
		.trim();
}

export function extractToc(body: string): TocEntry[] {
	const slugger = new GithubSlugger();
	const entries: TocEntry[] = [];

	let fence: string | null = null;

	for (const line of normalizeNewlines(body).split("\n")) {
		const fenceMatch = FENCE.exec(line);

		if (fence) {
			if (fenceMatch?.[1] && fenceMatch[1][0] === fence[0]) fence = null;
			continue;
		}
		if (fenceMatch?.[1]) {
			fence = fenceMatch[1];
			continue;
		}

		const heading = HEADING.exec(line);
		if (!heading?.[1] || !heading[2]) continue;

		const text = stripInline(heading[2]);
		if (!text) continue;

		entries.push({
			id: slugger.slug(text),
			text,
			depth: heading[1].length as 2 | 3,
		});
	}

	return entries;
}
