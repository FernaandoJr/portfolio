import type { Day as WeekDay } from "date-fns";
import { differenceInCalendarDays, getDay, nextDay, subWeeks } from "date-fns";

export type Activity = {
	date: string;
	count: number;
	level: number;
};

export type Week = Array<Activity | undefined>;

export const toLocalDate = (dateStr: string): Date => {
	const [y, m, d] = dateStr.split("-");
	return new Date(+y!, +m! - 1, +d!);
};

export const toDateStr = (date: Date): string =>
	`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const fillHoles = (activities: Activity[]): Activity[] => {
	if (activities.length === 0) return [];
	const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));
	const calendar = new Map<string, Activity>(activities.map((a) => [a.date, a]));
	const first = sorted[0] as Activity;
	const last = sorted.at(-1);
	if (!last) return [];
	const result: Activity[] = [];
	const cur = toLocalDate(first.date);
	const end = toLocalDate(last.date);
	while (cur <= end) {
		const date = toDateStr(cur);
		result.push(calendar.get(date) ?? { date, count: 0, level: 0 });
		cur.setDate(cur.getDate() + 1);
	}
	return result;
};

export const groupByWeeks = (activities: Activity[], weekStart: WeekDay = 0): Week[] => {
	if (activities.length === 0) return [];
	const normalized = fillHoles(activities);
	const first = normalized[0] as Activity;
	const firstDate = toLocalDate(first.date);
	const firstCalendarDate =
		getDay(firstDate) === weekStart ? firstDate : subWeeks(nextDay(firstDate, weekStart), 1);
	const padded = [
		...(new Array(differenceInCalendarDays(firstDate, firstCalendarDate)).fill(
			undefined
		) as Activity[]),
		...normalized,
	];
	const numberOfWeeks = Math.ceil(padded.length / 7);
	return new Array(numberOfWeeks).fill(undefined).map((_, i) => padded.slice(i * 7, i * 7 + 7));
};
