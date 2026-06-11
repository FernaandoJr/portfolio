import type { Activity } from "./types"

export async function fetchGithubContributions(baseUrl: string): Promise<Activity[]> {
  const res = await fetch(`${baseUrl}/api/github/contributions`)
  if (!res.ok) throw new Error("Failed to fetch GitHub contributions")
  return res.json() as Promise<Activity[]>
}
