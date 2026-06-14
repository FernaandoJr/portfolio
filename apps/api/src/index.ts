import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { handleScheduled } from "./cron.js";
import { githubRoutes } from "./routes/github.js";
import type { Bindings } from "./types/bindings.js";

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use("*", logger());
app.use(
	"*",
	cors({
		origin: (origin, c) => {
			const patterns = (c.env.ALLOWED_ORIGIN ?? "")
				.split(",")
				.map((o: string) => o.trim())
				.filter(Boolean);

			const isAllowed = patterns.some((pattern: string) => {
				if (pattern.startsWith("*.")) {
					return origin.endsWith(pattern.slice(1));
				}
				return origin === pattern;
			});

			return isAllowed ? origin : null;
		},
		allowMethods: ["GET"],
	})
);

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/github", githubRoutes);

app.onError((err, c) => {
	console.error("[API Error]", err);
	return c.json({ error: err.message }, 500);
});

export default {
	fetch: app.fetch,
	scheduled: handleScheduled,
};
