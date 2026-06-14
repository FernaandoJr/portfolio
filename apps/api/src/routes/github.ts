import { Hono } from "hono";

import { env } from "../lib/env.js";
import { connectDB } from "../lib/mongoose.js";
import { syncContributions } from "../lib/sync.js";
import { Contribution } from "../models/contribution.js";
import type { ContributionEntry } from "../types/github.js";

export const githubRoutes = new Hono();

githubRoutes.get("/contributions", async (c) => {
	try {
		await connectDB();
		const docs = await Contribution.find({}, { _id: 0, date: 1, count: 1, level: 1 })
			.sort({ date: 1 })
			.lean<ContributionEntry[]>();

		if (docs.length > 0) return c.json(docs);

		const data = await syncContributions();
		return c.json(data);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("[GitHub] Contributions failed:", message);
		return c.json({ error: message }, 502);
	}
});

githubRoutes.post("/sync", async (c) => {
	const auth = c.req.header("authorization");
	if (auth !== `Bearer ${env.CRON_SECRET}`) {
		return c.json({ error: "Unauthorized" }, 401);
	}

	try {
		const data = await syncContributions();
		return c.json({ synced: data.length });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("[GitHub] Sync failed:", message);
		return c.json({ error: message }, 502);
	}
});
