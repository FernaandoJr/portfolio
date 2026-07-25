import { describe, expect, it } from "vitest";

import { extractPlaceholderIndexes, maskContent, unmaskContent } from "./mask";

function roundTrip(body: string): string {
	const { masked, tokens } = maskContent(body);
	return unmaskContent(masked, tokens);
}

describe("maskContent", () => {
	it("round-trips a document unchanged", () => {
		const body = [
			"import { Card } from '@/components/ui/new-card';",
			"",
			"# Título",
			"",
			"Texto com `inline` e um [link](https://example.com/a?b=c).",
			"",
			"```ts",
			"const x: number = 1;",
			"// comentário que não pode ser traduzido",
			"```",
			"",
			"<Card interactive />",
			"",
			"<Callout>Isso aqui é prosa traduzível</Callout>",
		].join("\n");

		expect(roundTrip(body)).toBe(body);
	});

	it("hides fenced code from the masked output", () => {
		const { masked } = maskContent("Antes\n\n```js\nconst secret = 1;\n```\n\nDepois");

		expect(masked).not.toContain("const secret");
		expect(masked).toContain("Antes");
		expect(masked).toContain("Depois");
	});

	it("keeps prose inside component tags visible for translation", () => {
		const { masked } = maskContent("<Callout>Texto importante</Callout>");

		expect(masked).toContain("Texto importante");
		expect(masked).not.toContain("<Callout>");
	});

	it("masks link urls but keeps link text", () => {
		const { masked } = maskContent("Veja [a documentação](https://example.com/docs) aqui.");

		expect(masked).toContain("a documentação");
		expect(masked).not.toContain("https://example.com/docs");
	});

	it("masks nested backticks inside fenced blocks only once", () => {
		const body = "````md\n```ts\nconst a = 1;\n```\n````";
		const { masked, tokens } = maskContent(body);

		expect(tokens).toHaveLength(1);
		expect(unmaskContent(masked, tokens)).toBe(body);
	});

	it("masks an unterminated fence instead of leaking it", () => {
		const { masked, tokens } = maskContent("Texto\n\n```ts\nconst a = 1;");

		expect(tokens).toHaveLength(1);
		expect(masked).not.toContain("const a");
	});

	it("survives reordering of placeholders by a translator", () => {
		const { masked, tokens } = maskContent("`a` e depois `b`");
		const indexes = extractPlaceholderIndexes(masked);
		const swapped = masked
			.replace(`⟦C${indexes[0]}⟧`, "@@0@@")
			.replace(`⟦C${indexes[1]}⟧`, `⟦C${indexes[0]}⟧`)
			.replace("@@0@@", `⟦C${indexes[1]}⟧`);

		expect(unmaskContent(swapped, tokens)).toBe("`b` e depois `a`");
	});

	it("normalizes CRLF so hashing and masking stay stable across platforms", () => {
		const { masked } = maskContent("linha um\r\nlinha dois");

		expect(masked).toBe("linha um\nlinha dois");
	});
});

describe("extractPlaceholderIndexes", () => {
	it("reports every placeholder emitted", () => {
		const { masked, tokens } = maskContent("`a` `b` `c`");

		expect(extractPlaceholderIndexes(masked).sort()).toEqual(tokens.map((_, i) => i));
	});
});
