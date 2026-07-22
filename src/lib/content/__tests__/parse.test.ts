import { describe, expect, it } from "vitest";

import { makeParser, serializeVariant } from "../parse";
import { projectFrontmatterSchema } from "@/lib/projects/types";

const parseProject = makeParser(projectFrontmatterSchema, "projects");

const raw = `---
title: AstroVista
description: Arquivo do APOD
date: 2024-08-12
tags:
  - Next.js
status: wip
featured: 1
stack:
  - Next.js
  - Hono
links:
  repo: https://github.com/FernaandoJr/AstroVista
  live: https://astrovista.fernaandojr.dev
gallery:
  - src: /projects/astrovista/home.webp
    alt: Tela inicial
authors:
  - id: fernaandojr
    roleKey: roleLead
---

Corpo do case study.
`;

describe("makeParser", () => {
	it("reads the extended project frontmatter", () => {
		const variant = parseProject("astrovista.ptBR.mdx", raw);

		expect(variant).not.toBeNull();
		expect(variant?.slug).toBe("astrovista");
		expect(variant?.locale).toBe("ptBR");
		expect(variant?.frontmatter.status).toBe("wip");
		expect(variant?.frontmatter.featured).toBe(1);
		expect(variant?.frontmatter.authors).toEqual([{ id: "fernaandojr", roleKey: "roleLead" }]);
	});

	it("applies schema defaults for omitted collection fields", () => {
		const minimal = `---
title: Void CLI
description: CLI
date: 2023-01-02
---

Corpo.
`;
		const variant = parseProject("void-cli.ptBR.mdx", minimal);

		expect(variant?.frontmatter.status).toBe("completed");
		expect(variant?.frontmatter.featured).toBeUndefined();
		expect(variant?.frontmatter.gallery).toEqual([]);
		expect(variant?.frontmatter.links).toEqual({});
	});

	it("rejects a file name without a locale suffix", () => {
		expect(parseProject("astrovista.mdx", raw)).toBeNull();
	});

	it("names the collection in the validation error", () => {
		expect(() => parseProject("broken.ptBR.mdx", "---\ntitle: only\n---\n")).toThrow(
			/content\/projects\/broken\.ptBR\.mdx/
		);
	});
});

describe("serializeVariant", () => {
	it("round-trips fields the base schema does not know about", () => {
		const source = parseProject("astrovista.ptBR.mdx", raw);
		expect(source).not.toBeNull();

		// This is what the translator writes: base fields replaced, everything the
		// project schema added copied from the source variant.
		const translated = serializeVariant(
			{
				...source!.frontmatter,
				title: "AstroVista",
				description: "APOD archive",
				translatedFrom: "ptBR" as const,
				sourceHash: "abc123",
			},
			"Case study body."
		);

		const reparsed = parseProject("astrovista.enUS.mdx", translated);

		expect(reparsed?.frontmatter.description).toBe("APOD archive");
		expect(reparsed?.frontmatter.translatedFrom).toBe("ptBR");
		expect(reparsed?.frontmatter.status).toBe("wip");
		expect(reparsed?.frontmatter.featured).toBe(1);
		expect(reparsed?.frontmatter.stack).toEqual(["Next.js", "Hono"]);
		expect(reparsed?.frontmatter.links.repo).toBe("https://github.com/FernaandoJr/AstroVista");
		expect(reparsed?.frontmatter.gallery).toEqual([
			{ src: "/projects/astrovista/home.webp", alt: "Tela inicial" },
		]);
		expect(reparsed?.frontmatter.authors).toEqual([{ id: "fernaandojr", roleKey: "roleLead" }]);
	});
});
