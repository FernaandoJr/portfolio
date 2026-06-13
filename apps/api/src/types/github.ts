export type ContributionDay = {
	date: string;
	contributionCount: number;
};

export type ContributionWeek = {
	contributionDays: ContributionDay[];
};

export type ContributionCalendar = {
	weeks: ContributionWeek[];
};

export type GitHubResponse = {
	data?: {
		user?: {
			contributionsCollection?: {
				contributionCalendar?: ContributionCalendar;
			};
		};
	};
	errors?: { message: string }[];
};

export type ContributionEntry = {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
};
