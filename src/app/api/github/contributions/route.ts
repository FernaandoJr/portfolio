import { NextResponse } from "next/server";

import { Contribution } from "@/lib/db/models/contribution";
import { connectDB } from "@/lib/db/mongoose";
import { syncContributions } from "@/lib/db/sync";
import type { ContributionEntry } from "@/lib/github";

export async function GET() {
	try {
		await connectDB();
		const docs = await Contribution.find({}, { _id: 0, date: 1, count: 1, level: 1 })
			.sort({ date: 1 })
			.lean<ContributionEntry[]>();

		if (docs.length > 0) return NextResponse.json(docs);

		const data = await syncContributions();
		return NextResponse.json(data);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("[GitHub] Contributions failed:", message);
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
