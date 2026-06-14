import { Contribution } from "../models/contribution.js";
import { SyncLog } from "../models/sync-log.js";
import type { ContributionEntry } from "../types/github.js";
import { env } from "./env.js";
import { fetchFromGitHub } from "./github.js";
import { connectDB } from "./mongoose.js";

export async function syncContributions(): Promise<ContributionEntry[]> {
	await connectDB();
	const data = await fetchFromGitHub(env.GITHUB_TOKEN);

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
