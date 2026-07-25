import { describe, expect, it } from "vitest";

import {
	MONTHS,
	MONTH_ABBREVIATIONS,
	monthByNumber,
	monthKeyByAbbreviation,
	translateDate,
} from "./months";

const t = (key: string) => `t:${key}`;

describe("months", () => {
	it("covers twelve months in calendar order", () => {
		expect(MONTHS).toHaveLength(12);
		expect(MONTH_ABBREVIATIONS[0]).toBe("Jan");
		expect(MONTH_ABBREVIATIONS[11]).toBe("Dec");
	});

	it("derives the i18n key from the abbreviation", () => {
		for (const month of MONTHS) {
			expect(month.key).toBe(`month${month.abbreviation}`);
		}
	});

	it("indexes by 1-based month number", () => {
		expect(monthByNumber(1)?.abbreviation).toBe("Jan");
		expect(monthByNumber(12)?.abbreviation).toBe("Dec");
		expect(monthByNumber(0)).toBeUndefined();
		expect(monthByNumber(13)).toBeUndefined();
	});

	it("maps abbreviation to key", () => {
		expect(monthKeyByAbbreviation("Mar")).toBe("monthMar");
		expect(monthKeyByAbbreviation("mar")).toBeUndefined();
		expect(monthKeyByAbbreviation("Nope")).toBeUndefined();
	});
});

describe("translateDate", () => {
	it("translates a leading month abbreviation", () => {
		expect(translateDate("Jan 2024", t)).toBe("t:monthJan 2024");
	});

	it("leaves unknown abbreviations untouched", () => {
		expect(translateDate("Xyz 2024", t)).toBe("Xyz 2024");
		expect(translateDate("2024", t)).toBe("2024");
	});
});
