import { fetchGithubContributions } from "@repo/api-client"
import { useQuery } from "@tanstack/react-query"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

export function useGithubContributions() {
  return useQuery({
    queryKey: ["github-contributions"],
    queryFn: () => fetchGithubContributions(API_URL),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  })
}
