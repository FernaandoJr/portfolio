type ContributionDay = { date: string; contributionCount: number };
type ContributionWeek = { contributionDays: ContributionDay[] };
type GitHubResponse = {
	data?: {
		user?: {
			contributionsCollection?: {
				contributionCalendar?: { weeks: ContributionWeek[] };
			};
		};
	};
	errors?: { message: string }[];
};

export type ContributionEntry = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

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

export async function fetchFromGitHub(token: string): Promise<ContributionEntry[]> {
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
	} catch (err) {
		throw new Error(`GitHub API unreachable: ${err instanceof Error ? err.message : String(err)}`);
	}

	if (!res.ok) {
		throw new Error(`GitHub API returned ${res.status} ${res.statusText}`);
	}

	const json = (await res.json()) as GitHubResponse;

	if (json.errors?.length) {
		throw new Error(`GitHub GraphQL error: ${json.errors[0]?.message ?? "unknown"}`);
	}
	if (!json.data?.user) {
		throw new Error("GitHub user not found — check GITHUB_TOKEN and username");
	}

	const weeks = json.data.user.contributionsCollection?.contributionCalendar?.weeks ?? [];

	return weeks.flatMap((week) =>
		week.contributionDays.map((day) => {
			const count = day.contributionCount;
			const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;
			return { date: day.date, count, level } as ContributionEntry;
		})
	);
}
