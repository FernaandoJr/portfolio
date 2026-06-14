import { fetchGithubContributions } from "@repo/api-client";
import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export function useGithubContributions() {
	return useQuery({
		queryKey: ["github-contributions"],
		queryFn: () => fetchGithubContributions(API_URL),
	});
}
