import { describe, expect, it } from "vitest";

import { computeSourceHash } from "../hash";
import { maskContent, unmaskContent } from "../mask";
import { parseVariant, serializeVariant } from "../parse";
import type { Frontmatter } from "../types";
import { validateTranslation } from "../validate";

const SOURCE_FILE = "meu-post.ptBR.mdx";

const SOURCE = `---
title: "Título original"
description: "Descrição original."
date: "2026-07-21"
tags: ["Expo", "TypeScript"]
draft: false
---

# Cabeçalho

Texto com \`inline\` e um [link](https://example.com/docs).

\`\`\`ts
const naoPodeSerTraduzido = "valor";
// comentário sensível
\`\`\`

| Coluna | Valor |
| --- | --- |
| Um | Dois |
`;

/** Stands in for Gemini: rewrites prose only, never touching placeholders. */
function fakeTranslate(masked: string): string {
	return masked
		.replace("Cabeçalho", "Heading")
		.replace("Texto com", "Text with")
		.replace("e um", "and a")
		.replace("Coluna", "Column")
		.replace("Valor", "Value")
		.replace("Um", "One")
		.replace("Dois", "Two");
}

describe("translation pipeline", () => {
	it("preserves code and urls byte-for-byte through a full round trip", () => {
		const source = parseVariant(SOURCE_FILE, SOURCE);
		expect(source).not.toBeNull();
		if (!source) return;

		const { masked, tokens } = maskContent(source.body);
		const translatedMasked = fakeTranslate(masked);

		expect(
			validateTranslation({
				maskedSource: masked,
				tokenCount: tokens.length,
				translatedBody: translatedMasked,
			})
		).toEqual([]);

		const body = unmaskContent(translatedMasked, tokens);

		expect(body).toContain('const naoPodeSerTraduzido = "valor";');
		expect(body).toContain("// comentário sensível");
		expect(body).toContain("https://example.com/docs");
		expect(body).toContain("`inline`");
		expect(body).toContain("Heading");
		expect(body).not.toContain("Cabeçalho");
	});

	it("writes a translated file that parses back with an intact frontmatter", () => {
		const source = parseVariant(SOURCE_FILE, SOURCE);
		if (!source) throw new Error("source failed to parse");

		const hash = computeSourceHash({
			title: source.frontmatter.title,
			description: source.frontmatter.description,
			tags: source.frontmatter.tags,
			body: source.body,
		});

		const { masked, tokens } = maskContent(source.body);

		const frontmatter: Frontmatter = {
			...source.frontmatter,
			title: "Original title",
			description: "Original description.",
			translatedFrom: "ptBR",
			sourceHash: hash,
			translatedBy: "test-model",
			translatedAt: "2026-07-21T14:03:00.000Z",
		};

		const serialized = serializeVariant(frontmatter, unmaskContent(fakeTranslate(masked), tokens));
		const reparsed = parseVariant("meu-post.enUS.mdx", serialized);

		expect(reparsed).not.toBeNull();
		if (!reparsed) return;

		expect(reparsed.locale).toBe("enUS");
		expect(reparsed.slug).toBe("meu-post");
		expect(reparsed.frontmatter.title).toBe("Original title");
		expect(reparsed.frontmatter.date).toBe("2026-07-21");
		expect(reparsed.frontmatter.tags).toEqual(["Expo", "TypeScript"]);
		expect(reparsed.frontmatter.translatedFrom).toBe("ptBR");
		expect(reparsed.frontmatter.sourceHash).toBe(hash);
		expect(reparsed.body).toContain('const naoPodeSerTraduzido = "valor";');
	});

	it("detects staleness after the source is edited", () => {
		const source = parseVariant(SOURCE_FILE, SOURCE);
		if (!source) throw new Error("source failed to parse");

		const before = computeSourceHash({
			title: source.frontmatter.title,
			description: source.frontmatter.description,
			tags: source.frontmatter.tags,
			body: source.body,
		});

		const after = computeSourceHash({
			title: source.frontmatter.title,
			description: source.frontmatter.description,
			tags: source.frontmatter.tags,
			body: `${source.body}\n\nParágrafo novo.`,
		});

		expect(after).not.toBe(before);
	});

	it("rejects a translation that mangles a code placeholder", () => {
		const source = parseVariant(SOURCE_FILE, SOURCE);
		if (!source) throw new Error("source failed to parse");

		const { masked, tokens } = maskContent(source.body);
		const sabotaged = masked.replace(/⟦C\d+⟧/, "código traduzido pelo modelo");

		expect(
			validateTranslation({
				maskedSource: masked,
				tokenCount: tokens.length,
				translatedBody: sabotaged,
			}).join()
		).toContain("dropped placeholders");
	});
});
