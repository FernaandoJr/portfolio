import { describe, expect, it } from "vitest";

import {
	isLocale,
	isLocaleSegment,
	localeHref,
	stripLocale,
	toLocale,
	toSegment,
} from "../routing";

describe("locale mapping", () => {
	it("maps segments to locales and back", () => {
		expect(toLocale("pt-br")).toBe("ptBR");
		expect(toLocale("en")).toBe("enUS");
		expect(toSegment("ptBR")).toBe("pt-br");
		expect(toSegment("enUS")).toBe("en");
	});

	it("guards unknown values", () => {
		expect(isLocale("ptBR")).toBe(true);
		expect(isLocale("fr")).toBe(false);
		expect(isLocaleSegment("pt-br")).toBe(true);
		expect(isLocaleSegment("ptBR")).toBe(false);
		expect(isLocaleSegment("pt")).toBe(false);
	});
});

describe("localeHref", () => {
	it("prefixes a path", () => {
		expect(localeHref("pt-br", "/blog")).toBe("/pt-br/blog");
		expect(localeHref("enUS", "/blog/meu-post")).toBe("/en/blog/meu-post");
	});

	it("collapses the root path", () => {
		expect(localeHref("pt-br", "/")).toBe("/pt-br");
		expect(localeHref("en")).toBe("/en");
	});

	it("tolerates a missing leading slash", () => {
		expect(localeHref("pt-br", "blog")).toBe("/pt-br/blog");
	});

	it("keeps hashes attached", () => {
		expect(localeHref("pt-br", "/#about")).toBe("/pt-br/#about");
	});
});

describe("stripLocale", () => {
	it("removes a leading locale segment", () => {
		expect(stripLocale("/pt-br/blog")).toBe("/blog");
		expect(stripLocale("/en/blog/meu-post")).toBe("/blog/meu-post");
	});

	it("returns root when only the segment is present", () => {
		expect(stripLocale("/pt-br")).toBe("/");
		expect(stripLocale("/en")).toBe("/");
	});

	it("leaves unprefixed paths untouched", () => {
		expect(stripLocale("/blog")).toBe("/blog");
		expect(stripLocale("/")).toBe("/");
	});
});
