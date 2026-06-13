import { fetchFromGitHub } from "./lib/github.js";
import type { Bindings } from "./types/bindings.js";

export async function handleScheduled(
	_event: ScheduledEvent,
	env: Bindings,
	_ctx: ExecutionContext
): Promise<void> {
	console.log("[Cron] Syncing GitHub contributions");

	const data = await fetchFromGitHub(env.GITHUB_TOKEN);
	if (!data) {
		console.error("[Cron] Failed to fetch GitHub contributions");
		return;
	}

	const stmt = env.portfolio_cache.prepare(
		"INSERT OR REPLACE INTO contributions (date, count, level) VALUES (?, ?, ?)"
	);
	await env.portfolio_cache.batch(data.map((d) => stmt.bind(d.date, d.count, d.level)));

	await env.portfolio_cache
		.prepare("INSERT OR REPLACE INTO sync_log (id, synced_at) VALUES (1, ?)")
		.bind(new Date().toISOString())
		.run();

	console.log(`[Cron] Synced ${data.length} contribution entries`);
}
