import { describe, expect, it } from "vitest";

import { makeParser } from "./parse";
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
