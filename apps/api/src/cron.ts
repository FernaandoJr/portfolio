import { syncContributions } from "./lib/sync.js";
import type { Bindings } from "./types/bindings.js";

export async function handleScheduled(
	_event: ScheduledEvent,
	env: Bindings,
	_ctx: ExecutionContext
): Promise<void> {
	console.log("[Cron] Syncing GitHub contributions");

	try {
		const data = await syncContributions(env);
		console.log(`[Cron] Synced ${data.length} contribution entries`);
	} catch (err) {
		console.error("[Cron] Sync failed:", err instanceof Error ? err.message : err);
	}
}
