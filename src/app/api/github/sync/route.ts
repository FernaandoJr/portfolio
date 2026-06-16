import { type NextRequest, NextResponse } from "next/server";

import { syncContributions } from "@/lib/db/sync";

export async function GET(req: NextRequest) {
	const auth = req.headers.get("authorization");
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const data = await syncContributions();
		return NextResponse.json({ synced: data.length });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("[GitHub] Sync failed:", message);
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
