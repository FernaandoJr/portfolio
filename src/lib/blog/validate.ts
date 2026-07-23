import { extractPlaceholderIndexes } from "./mask";

export type TranslationInput = {
	maskedSource: string;
	tokenCount: number;
	translatedBody: string;
};

function countHeadings(value: string): number {
	return (value.match(/^#{1,6}\s+\S/gm) ?? []).length;
}

export function validateTranslation({
	maskedSource,
	tokenCount,
	translatedBody,
}: TranslationInput): string[] {
	const issues: string[] = [];

	if (translatedBody.trim().length === 0) {
		issues.push("translated body is empty");
		return issues;
	}

	const expected = extractPlaceholderIndexes(maskedSource);
	const received = extractPlaceholderIndexes(translatedBody);

	const missing = expected.filter((index) => !received.includes(index));
	if (missing.length > 0) {
		issues.push(`dropped placeholders: ${missing.map((i) => `⟦C${i}⟧`).join(", ")}`);
	}

	const unknown = received.filter((index) => index >= tokenCount || index < 0);
	if (unknown.length > 0) {
		issues.push(`invented placeholders: ${unknown.map((i) => `⟦C${i}⟧`).join(", ")}`);
	}

	const duplicated = received.filter((index, i) => received.indexOf(index) !== i);
	if (duplicated.length > 0) {
		issues.push(
			`duplicated placeholders: ${[...new Set(duplicated)].map((i) => `⟦C${i}⟧`).join(", ")}`
		);
	}

	const sourceHeadings = countHeadings(maskedSource);
	const targetHeadings = countHeadings(translatedBody);
	if (sourceHeadings !== targetHeadings) {
		issues.push(`heading count changed: ${sourceHeadings} → ${targetHeadings}`);
	}

	return issues;
}
