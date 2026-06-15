import { useQuery } from "@tanstack/react-query";

export type Activity = { date: string; count: number; level: number };

export function useGithubContributions() {
	return useQuery({
		queryKey: ["github-contributions"],
		queryFn: async () => {
			const res = await fetch("/api/github/contributions");
			if (!res.ok) {
				const body = (await res.json().catch(() => null)) as { error?: string } | null;
				throw new Error(body?.error ?? `HTTP ${res.status}`);
			}
			return res.json() as Promise<Activity[]>;
		},
	});
}
