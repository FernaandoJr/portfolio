import { NextResponse } from "next/server";

import { Contribution } from "@/lib/db/models/contribution";
import { connectDB } from "@/lib/db/mongoose";
import { toDateStr } from "@/lib/contribution-calendar";
import type { ContributionEntry } from "@/lib/github";

export async function GET() {
	try {
		await connectDB();
		const cutoff = new Date();
		cutoff.setDate(cutoff.getDate() - 365);

		const docs = await Contribution.find(
			{ date: { $gte: toDateStr(cutoff) } },
			{ _id: 0, date: 1, count: 1, level: 1 }
		)
			.sort({ date: 1 })
			.lean<ContributionEntry[]>();

		return NextResponse.json(docs);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Unknown error";
		console.error("[GitHub] Contributions failed:", message);
		return NextResponse.json({ error: message }, { status: 502 });
	}
}
