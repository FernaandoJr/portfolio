import { Hono } from "hono";

import { syncContributions } from "../lib/sync.js";
import type { Bindings } from "../types/bindings.js";
import type { ContributionEntry } from "../types/github.js";

export const githubRoutes = new Hono<{ Bindings: Bindings }>();

githubRoutes.get("/contributions", async (c) => {
	const db = c.env.portfolio_cache;

	const rows = await db
		.prepare("SELECT date, count, level FROM contributions ORDER BY date ASC")
		.all<ContributionEntry>();

	if (rows.results.length > 0) {
		return c.json(rows.results);
	}

	try {
		const data = await syncContributions(c.env);
		return c.json(data);
	} catch (err) {
		console.error("[GitHub] Sync failed:", err instanceof Error ? err.message : err);
		return c.json({ error: "Failed to reach GitHub API" }, 502);
	}
});
