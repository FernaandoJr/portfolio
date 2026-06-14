import type { Activity } from "./types";

export async function fetchGithubContributions(baseUrl: string): Promise<Activity[]> {
	const res = await fetch(`${baseUrl}/api/github/contributions`);
	if (!res.ok) {
		const body = (await res.json().catch(() => null)) as { error?: string } | null;
		throw new Error(body?.error ?? `HTTP ${res.status}`);
	}
	return res.json() as Promise<Activity[]>;
}
