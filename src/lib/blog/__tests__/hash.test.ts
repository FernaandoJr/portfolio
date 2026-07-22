import { describe, expect, it } from "vitest";

import { computeSourceHash } from "../hash";

const base = {
	title: "Offline-first",
	description: "Sincronização e conflitos.",
	tags: ["Expo", "Arquitetura"],
	body: "# Título\n\nCorpo do post.",
};

describe("computeSourceHash", () => {
	it("is stable across calls", () => {
		expect(computeSourceHash(base)).toBe(computeSourceHash(base));
	});

	it("ignores CRLF differences", () => {
		const crlf = { ...base, body: base.body.replace(/\n/g, "\r\n") };

		expect(computeSourceHash(crlf)).toBe(computeSourceHash(base));
	});

	it("ignores tag ordering", () => {
		const reordered = { ...base, tags: ["Arquitetura", "Expo"] };

		expect(computeSourceHash(reordered)).toBe(computeSourceHash(base));
	});

	it("ignores surrounding whitespace", () => {
		const padded = { ...base, title: "  Offline-first  ", body: `\n${base.body}\n\n` };

		expect(computeSourceHash(padded)).toBe(computeSourceHash(base));
	});

	it("changes when the body changes", () => {
		const edited = { ...base, body: `${base.body} Mais uma frase.` };

		expect(computeSourceHash(edited)).not.toBe(computeSourceHash(base));
	});

	it("changes when the title changes", () => {
		const edited = { ...base, title: "Outro título" };

		expect(computeSourceHash(edited)).not.toBe(computeSourceHash(base));
	});
});
