import { describe, expect, it } from "vitest";

import { maskContent } from "./mask";
import { validateTranslation } from "./validate";

const source = ["# Título", "", "Texto com `code`.", "", "## Seção", "", "Fim."].join("\n");

function inputFor(translatedBody: string) {
	const { masked, tokens } = maskContent(source);
	return { maskedSource: masked, tokenCount: tokens.length, translatedBody };
}

describe("validateTranslation", () => {
	it("accepts a faithful translation", () => {
		const { masked } = maskContent(source);
		const translated = masked.replace("Título", "Title").replace("Seção", "Section");

		expect(validateTranslation(inputFor(translated))).toEqual([]);
	});

	it("rejects an empty body", () => {
		expect(validateTranslation(inputFor("   "))).toEqual(["translated body is empty"]);
	});

	it("catches a dropped placeholder", () => {
		const { masked } = maskContent(source);
		const translated = masked.replace(/⟦C0⟧/, "code");

		expect(validateTranslation(inputFor(translated))[0]).toContain("dropped placeholders");
	});

	it("catches an invented placeholder", () => {
		const { masked } = maskContent(source);

		expect(validateTranslation(inputFor(`${masked}\n\n⟦C99⟧`))[0]).toContain(
			"invented placeholders"
		);
	});

	it("catches a duplicated placeholder", () => {
		const { masked } = maskContent(source);

		expect(validateTranslation(inputFor(`${masked}\n\n⟦C0⟧`))[0]).toContain(
			"duplicated placeholders"
		);
	});

	it("catches a lost heading", () => {
		const { masked } = maskContent(source);
		const translated = masked.replace("## Seção", "Seção");

		expect(validateTranslation(inputFor(translated)).join()).toContain("heading count changed");
	});
});
