import type { IncomingMessage, ServerResponse } from "node:http";
import { createAdaptorServer } from "@hono/node-server";

import app from "../src/index.js";

const server = createAdaptorServer({ fetch: app.fetch });

export default function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
	return new Promise((resolve) => {
		res.on("finish", resolve);
		server.emit("request", req, res);
	});
}
