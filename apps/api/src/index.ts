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
		origin: (_, c) => c.env.ALLOWED_ORIGIN ?? "*",
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
