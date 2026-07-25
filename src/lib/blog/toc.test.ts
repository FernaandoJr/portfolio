import { describe, expect, it } from "vitest";

import { extractToc } from "./toc";

describe("extractToc", () => {
	it("collects h2 and h3 with their depth", () => {
		const toc = extractToc(
			["# Ignorado", "", "## Primeira", "", "### Sub", "", "## Segunda"].join("\n")
		);

		expect(toc).toEqual([
			{ id: "primeira", text: "Primeira", depth: 2 },
			{ id: "sub", text: "Sub", depth: 3 },
			{ id: "segunda", text: "Segunda", depth: 2 },
		]);
	});

	it("ignores headings inside fenced code", () => {
		const toc = extractToc(["## Real", "", "```md", "## Falso", "```", "", "## Outro"].join("\n"));

		expect(toc.map((e) => e.text)).toEqual(["Real", "Outro"]);
	});

	it("ignores headings inside tilde fences", () => {
		const toc = extractToc(["~~~", "## Falso", "~~~", "## Real"].join("\n"));

		expect(toc.map((e) => e.text)).toEqual(["Real"]);
	});

	it("strips inline markdown so ids match rendered headings", () => {
		const toc = extractToc("## O **erro** do `sync` e o [link](https://x.dev)");

		expect(toc[0]).toEqual({
			id: "o-erro-do-sync-e-o-link",
			text: "O erro do sync e o link",
			depth: 2,
		});
	});

	it("slugifies accents the same way rehype-slug does", () => {
		const toc = extractToc("## Três decisões");

		expect(toc[0]?.id).toBe("três-decisões");
	});

	it("dedupes repeated headings with a numeric suffix", () => {
		const toc = extractToc(["## Notas", "## Notas"].join("\n"));

		expect(toc.map((e) => e.id)).toEqual(["notas", "notas-1"]);
	});

	it("returns an empty list when there are no headings", () => {
		expect(extractToc("Só um parágrafo.")).toEqual([]);
	});
});
