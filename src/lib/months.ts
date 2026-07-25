export const MONTHS = [
	{ abbreviation: "Jan", key: "monthJan" },
	{ abbreviation: "Feb", key: "monthFeb" },
	{ abbreviation: "Mar", key: "monthMar" },
	{ abbreviation: "Apr", key: "monthApr" },
	{ abbreviation: "May", key: "monthMay" },
	{ abbreviation: "Jun", key: "monthJun" },
	{ abbreviation: "Jul", key: "monthJul" },
	{ abbreviation: "Aug", key: "monthAug" },
	{ abbreviation: "Sep", key: "monthSep" },
	{ abbreviation: "Oct", key: "monthOct" },
	{ abbreviation: "Nov", key: "monthNov" },
	{ abbreviation: "Dec", key: "monthDec" },
] as const;

export const MONTH_ABBREVIATIONS: string[] = MONTHS.map((month) => month.abbreviation);

export function monthByNumber(monthNumber: number) {
	return MONTHS[monthNumber - 1];
}

export function monthKeyByAbbreviation(abbreviation: string): string | undefined {
	return MONTHS.find((month) => month.abbreviation === abbreviation)?.key;
}

export function translateDate(date: string, t: (key: string) => string): string {
	return date.replace(/^([A-Za-z]{3})/, (abbreviation) => {
		const key = monthKeyByAbbreviation(abbreviation);
		return key ? t(key) : abbreviation;
	});
}
