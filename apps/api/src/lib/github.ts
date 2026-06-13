import type { ContributionEntry, GitHubResponse } from "../types/github.js";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export const PORTFOLIO_USERNAME = "FernaandoJr";

export async function fetchFromGitHub(token: string): Promise<ContributionEntry[] | null> {
	let res: Response;
	try {
		res = await fetch(GITHUB_GRAPHQL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				query: CONTRIBUTIONS_QUERY,
				variables: { login: PORTFOLIO_USERNAME },
			}),
			signal: AbortSignal.timeout(30000),
		});
	} catch {
		return null;
	}

	if (!res.ok) return null;

	const json = (await res.json()) as GitHubResponse;
	if (json.errors || !json.data?.user) return null;

	const weeks = json.data.user.contributionsCollection?.contributionCalendar?.weeks ?? [];

	return weeks.flatMap((week) =>
		week.contributionDays.map((day) => {
			const count = day.contributionCount;
			const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;
			return { date: day.date, count, level } as ContributionEntry;
		})
	);
}
