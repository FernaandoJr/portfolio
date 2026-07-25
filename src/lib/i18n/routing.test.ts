import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, HTML_LANG, isLocale } from "./routing";

describe("locales", () => {
	it("defaults to english", () => {
		expect(DEFAULT_LOCALE).toBe("enUS");
	});

	it("guards unknown values", () => {
		expect(isLocale("ptBR")).toBe(true);
		expect(isLocale("enUS")).toBe(true);
		expect(isLocale("pt-br")).toBe(false);
		expect(isLocale("fr")).toBe(false);
	});

	it("maps locales to html lang tags", () => {
		expect(HTML_LANG.ptBR).toBe("pt-BR");
		expect(HTML_LANG.enUS).toBe("en-US");
	});
});
