import { describe, expect, it } from "vitest";

import { fillHoles, groupByWeeks, toDateStr, toLocalDate } from "../contribution-calendar";
import type { Activity } from "../contribution-calendar";

const activities: Activity[] = [
	{ date: "2025-06-15", count: 3, level: 1 },
	{ date: "2025-09-01", count: 5, level: 2 },
	{ date: "2025-12-25", count: 2, level: 1 },
	{ date: "2026-03-10", count: 7, level: 3 },
	{ date: "2026-06-16", count: 1, level: 1 },
];

describe("toLocalDate", () => {
	it("cria meia-noite local — sem desvio de timezone", () => {
		const d = toLocalDate("2026-06-16");
		expect(d.getFullYear()).toBe(2026);
		expect(d.getMonth()).toBe(5);
		expect(d.getDate()).toBe(16);
	});
});

describe("toDateStr", () => {
	it("formata em horário local, sem conversão UTC", () => {
		const d = new Date(2026, 5, 16);
		expect(toDateStr(d)).toBe("2026-06-16");
	});

	it("adiciona zero à esquerda em mês e dia de 1 dígito", () => {
		expect(toDateStr(new Date(2025, 0, 5))).toBe("2025-01-05");
	});
});

describe("fillHoles", () => {
	const filled = fillHoles(activities);

	it("inclui o último dia do dataset (2026-06-16)", () => {
		const last = filled.at(-1);
		expect(last?.date).toBe("2026-06-16");
	});

	it("preserva count e level do dia 2026-06-16", () => {
		const entry = filled.find((a) => a.date === "2026-06-16");
		expect(entry).toEqual({ date: "2026-06-16", count: 1, level: 1 });
	});

	it("inclui o primeiro dia do dataset (2025-06-15)", () => {
		expect(filled[0]?.date).toBe("2025-06-15");
	});

	it("não tem buracos — dias consecutivos sem lacuna", () => {
		for (let i = 1; i < filled.length; i++) {
			const prev = toLocalDate(filled[i - 1]!.date);
			const curr = toLocalDate(filled[i]!.date);
			prev.setDate(prev.getDate() + 1);
			expect(toDateStr(prev)).toBe(toDateStr(curr));
		}
	});

	it("todos os dias da fixture estão presentes no resultado", () => {
		const filledDates = new Set(filled.map((a) => a.date));
		for (const entry of activities) {
			expect(filledDates.has(entry.date)).toBe(true);
		}
	});

	it("dias preenchidos com count 0 têm level 0", () => {
		const inputDates = new Set(activities.map((a) => a.date));
		const holes = filled.filter((a) => !inputDates.has(a.date));
		for (const hole of holes) {
			expect(hole.count).toBe(0);
			expect(hole.level).toBe(0);
		}
	});
});

describe("groupByWeeks", () => {
	const weeks = groupByWeeks(activities);

	it("último dia visível no grid é 2026-06-16", () => {
		const lastWeek = weeks.at(-1)!;
		const lastActivity = [...lastWeek].reverse().find((a) => a !== undefined);
		expect(lastActivity?.date).toBe("2026-06-16");
	});

	it("semanas completas têm 7 slots; última pode ter menos", () => {
		const allButLast = weeks.slice(0, -1);
		for (const week of allButLast) {
			expect(week.length).toBe(7);
		}
		expect(weeks.at(-1)!.length).toBeGreaterThanOrEqual(1);
		expect(weeks.at(-1)!.length).toBeLessThanOrEqual(7);
	});
});
