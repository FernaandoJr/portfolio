import { fetchFromGitHub } from "./github.js";
import type { Bindings } from "../types/bindings.js";
import type { ContributionEntry } from "../types/github.js";

export async function syncContributions(env: Bindings): Promise<ContributionEntry[]> {
	const data = await fetchFromGitHub(env.GITHUB_TOKEN);

	const stmt = env.portfolio_cache.prepare(
		"INSERT OR REPLACE INTO contributions (date, count, level) VALUES (?, ?, ?)"
	);
	await env.portfolio_cache.batch(data.map((d) => stmt.bind(d.date, d.count, d.level)));

	await env.portfolio_cache
		.prepare("INSERT OR REPLACE INTO sync_log (id, synced_at) VALUES (1, ?)")
		.bind(new Date().toISOString())
		.run();

	return data;
}
