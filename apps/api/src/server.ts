import { serve } from "@hono/node-server";

import app from "./index.js";

serve({ fetch: app.fetch, port: 8787 }, (info) => {
	console.log(`[API] Running on http://localhost:${info.port}`);
});
