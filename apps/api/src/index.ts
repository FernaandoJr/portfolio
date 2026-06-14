import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { env } from "./lib/env.js";
import { githubRoutes } from "./routes/github.js";

const app = new Hono();

app.use("*", logger());
app.use(
	"*",
	cors({
		origin: (origin) => {
			const patterns = env.ALLOWED_ORIGIN.split(",")
				.map((o) => o.trim())
				.filter(Boolean);

			const isAllowed = patterns.some((pattern) =>
				pattern.startsWith("*.") ? origin.endsWith(pattern.slice(1)) : origin === pattern
			);

			return isAllowed ? origin : null;
		},
		allowMethods: ["GET"],
	})
);

app.get("/", (c) => c.json({ status: "ok" }));
app.get("/api/health", (c) => c.json({ status: "ok" }));

app.route("/api/github", githubRoutes);

app.onError((err, c) => {
	console.error("[API Error]", err);
	return c.json({ error: err.message }, 500);
});

export default app;
