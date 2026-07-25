"use client";

import { useTranslation } from "@/lib/i18n";
import { monthByNumber } from "@/lib/months";

export function formatCalendarDate(date: string, t: (key: string) => string): string {
	const [year, month, day] = date.split("-");
	const entry = monthByNumber(Number(month));
	if (!year || !day || !entry) return date;
	return `${day} ${t(entry.key)} ${year}`;
}

export function PostDate({ date, className }: { date: string; className?: string }) {
	const { t } = useTranslation();

	return (
		<time dateTime={date} className={className}>
			{formatCalendarDate(date, t)}
		</time>
	);
}

export function PostMeta({ date, readingMinutes }: { date: string; readingMinutes: number }) {
	const { t } = useTranslation();

	return (
		<div className="flex items-center gap-2 text-muted-foreground/70 text-xs font-serif select-none">
			<PostDate date={date} />
			<span>·</span>
			<span>{t("blogReadingTime", { count: readingMinutes })}</span>
		</div>
	);
}
