import { normalizeNewlines } from "./hash";

export type MaskResult = {
	masked: string;
	tokens: string[];
};

const PLACEHOLDER_PATTERN = /⟦C(\d+)⟧/g;

function placeholder(index: number): string {
	return `⟦C${index}⟧`;
}

function maskFencedBlocks(body: string, push: (raw: string) => string): string {
	const lines = normalizeNewlines(body).split("\n");
	const output: string[] = [];

	let buffer: string[] | null = null;
	let fenceChar = "`";
	let fenceLength = 3;

	for (const line of lines) {
		const opening = /^\s*(`{3,}|~{3,})/.exec(line);

		if (buffer === null) {
			if (opening?.[1]) {
				fenceChar = opening[1][0] as string;
				fenceLength = opening[1].length;
				buffer = [line];
			} else {
				output.push(line);
			}
			continue;
		}

		buffer.push(line);

		const closing = new RegExp(`^\\s*\\${fenceChar}{${fenceLength},}\\s*$`);
		if (closing.test(line)) {
			output.push(push(buffer.join("\n")));
			buffer = null;
		}
	}

	if (buffer !== null) {
		output.push(push(buffer.join("\n")));
	}

	return output.join("\n");
}

export function maskContent(body: string): MaskResult {
	const tokens: string[] = [];

	const push = (raw: string): string => {
		tokens.push(raw);
		return placeholder(tokens.length - 1);
	};

	let masked = maskFencedBlocks(body, push);

	masked = masked.replace(/^[ \t]*(?:import|export)\s[^\n]*$/gm, (raw) => push(raw));
	masked = masked.replace(/<!--[\s\S]*?-->/g, (raw) => push(raw));
	masked = masked.replace(/<[A-Za-z][\w.]*(?:\s[^<>]*?)?\/>/g, (raw) => push(raw));
	masked = masked.replace(/<\/?[A-Z][\w.]*(?:\s[^<>]*?)?>/g, (raw) => push(raw));
	masked = masked.replace(/\{[^{}\n]*\}/g, (raw) => push(raw));
	masked = masked.replace(/`[^`\n]+`/g, (raw) => push(raw));
	masked = masked.replace(/(\]\()([^)\s]+)/g, (_, bracket: string, url: string) => {
		return `${bracket}${push(url)}`;
	});

	return { masked, tokens };
}

export function extractPlaceholderIndexes(value: string): number[] {
	return [...value.matchAll(PLACEHOLDER_PATTERN)].map((match) => Number(match[1]));
}

export function unmaskContent(masked: string, tokens: string[]): string {
	return masked.replace(PLACEHOLDER_PATTERN, (raw, index: string) => {
		return tokens[Number(index)] ?? raw;
	});
}
