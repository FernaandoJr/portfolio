import { useQuery } from "@tanstack/react-query";

export type Activity = { date: string; count: number; level: number };

export const GITHUB_CONTRIBUTIONS_ENDPOINT = "/api/github/contributions";

export class GithubContributionsError extends Error {
	readonly status: number | null;

	constructor(message: string, status: number | null = null) {
		super(message);
		this.name = "GithubContributionsError";
		this.status = status;
	}
}

export function useGithubContributions() {
	return useQuery({
		queryKey: ["github-contributions"],
		queryFn: async () => {
			const res = await fetch(GITHUB_CONTRIBUTIONS_ENDPOINT);
			if (!res.ok) {
				const body = (await res.json().catch(() => null)) as { error?: string } | null;
				throw new GithubContributionsError(body?.error ?? `HTTP ${res.status}`, res.status);
			}
			return res.json() as Promise<Activity[]>;
		},
	});
}
