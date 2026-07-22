import { createHash } from "node:crypto";

export type HashInput = {
	title: string;
	description: string;
	tags: string[];
	body: string;
};

export function normalizeNewlines(value: string): string {
	return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

export function computeSourceHash(input: HashInput): string {
	const canonical = JSON.stringify({
		title: input.title.trim(),
		description: input.description.trim(),
		tags: [...input.tags].map((tag) => tag.trim()).sort(),
		body: normalizeNewlines(input.body).trim(),
	});

	return createHash("sha256").update(canonical, "utf8").digest("hex").slice(0, 16);
}
