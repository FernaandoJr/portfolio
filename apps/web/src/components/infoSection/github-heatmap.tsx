"use client";

import { useTranslation } from "@repo/i18n";
import { format } from "date-fns";

import {
	ContributionGraph,
	ContributionGraphBlock,
	ContributionGraphCalendar,
	ContributionGraphFooter,
	ContributionGraphLegend,
	ContributionGraphTotalCount,
	type Activity,
} from "@/components/ui/contribution-graph";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useGithubContributions } from "@/hooks/use-github-contributions";

function generateEmptyYear(): Activity[] {
	const end = new Date();
	const start = new Date(end);
	start.setFullYear(end.getFullYear() - 1);
	const days: Activity[] = [];
	const current = new Date(start);
	while (current <= end) {
		days.push({ date: current.toISOString().slice(0, 10), count: 0, level: 0 });
		current.setDate(current.getDate() + 1);
	}
	return days;
}

export function GithubHeatmap() {
	const { t } = useTranslation();
	const { data, isLoading } = useGithubContributions();

	if (isLoading) {
		return (
			<div className="mx-auto gap-4 py-4 w-max max-w-full flex flex-col">
				<div className="no-scrollbar px-2 max-w-full overflow-x-auto overflow-y-hidden">
					<div className="flex gap-0.75">
						{Array.from({ length: 53 }).map((_, w) => (
							<div key={w} className="flex flex-col gap-0.75">
								{Array.from({ length: 7 }).map((_, d) => (
									<div
										key={d}
										className="bg-muted animate-pulse"
										style={{ width: 11, height: 11 }}
									/>
								))}
							</div>
						))}
					</div>
				</div>
				<div className="px-2 flex flex-wrap gap-1 whitespace-nowrap sm:gap-x-4">
					<div className="h-3 w-48 rounded bg-muted animate-pulse" />
					<div className="ml-auto flex items-center gap-1">
						{Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="bg-muted animate-pulse" style={{ width: 11, height: 11 }} />
						))}
					</div>
				</div>
			</div>
		);
	}

	const displayData = data ?? generateEmptyYear();

	return (
		<ContributionGraph
			className="mx-auto gap-4 py-4"
			data={displayData}
			blockSize={11}
			blockMargin={3}
			blockRadius={0}
			labels={{ legend: { less: t("less"), more: t("more") } }}
			aria-label="GitHub Contributions Graph"
		>
			<ContributionGraphCalendar
				className="no-scrollbar px-2"
				title="GitHub Contributions"
				aria-hidden
			>
				{({ activity, dayIndex, weekIndex }) => (
					<Tooltip>
						<TooltipTrigger
							render={
								<g>
									<ContributionGraphBlock
										activity={activity}
										dayIndex={dayIndex}
										weekIndex={weekIndex}
									/>
								</g>
							}
						/>
						<TooltipContent className="font-sans select-none">
							<p>
								{t(
									activity.count === 1
										? "githubContributionTooltip"
										: "githubContributionTooltip_plural",
									{
										count: activity.count,
										date: format(new Date(activity.date), "dd.MM.yyyy"),
									}
								)}
							</p>
						</TooltipContent>
					</Tooltip>
				)}
			</ContributionGraphCalendar>

			<ContributionGraphFooter className="px-2">
				<ContributionGraphTotalCount>
					{({ totalCount, year }) => (
						<div className="text-muted-foreground text-xs select-none">
							{t("githubContributions", {
								count: totalCount.toLocaleString("en"),
								year,
							})}{" "}
							<a
								className="text-foreground underline underline-offset-2 hover:text-muted-foreground transition-colors"
								href="https://github.com/FernaandoJr"
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
							.
						</div>
					)}
				</ContributionGraphTotalCount>

				<ContributionGraphLegend aria-hidden />
			</ContributionGraphFooter>
		</ContributionGraph>
	);
}
