import type { ContributionEntry } from "@/lib/github";
import { fetchFromGitHub } from "@/lib/github";
import { Contribution } from "@/lib/db/models/contribution";
import { SyncLog } from "@/lib/db/models/sync-log";
import { connectDB } from "@/lib/db/mongoose";

export async function syncContributions(): Promise<ContributionEntry[]> {
	await connectDB();
	const data = await fetchFromGitHub(process.env.GITHUB_TOKEN!);

	await Promise.all(
		data.map((d) => Contribution.updateOne({ date: d.date }, { $set: d }, { upsert: true }))
	);

	await SyncLog.updateOne(
		{ _id: "singleton" },
		{ $set: { synced_at: new Date().toISOString() } },
		{ upsert: true }
	);

	return data;
}
