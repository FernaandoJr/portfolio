"use client";

import type { ProjectStatus } from "@/lib/projects/types";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LABEL_KEY: Record<ProjectStatus, string> = {
	completed: "projectStatusCompleted",
	wip: "projectStatusWip",
	archived: "projectStatusArchived",
};

const DOT: Record<ProjectStatus, string> = {
	completed: "bg-emerald-400",
	wip: "bg-amber-400 animate-pulse",
	archived: "bg-text-sub-600",
};

export function ProjectStatusBadge({
	status,
	overlay = false,
	className,
}: {
	status: ProjectStatus;
	overlay?: boolean;
	className?: string;
}) {
	const { t } = useTranslation();

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium select-none",
				overlay
					? "bg-black/30 text-white/90 backdrop-blur-sm"
					: "border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600",
				className
			)}
		>
			<span className={cn("size-1.5 rounded-full", DOT[status])} />
			{t(LABEL_KEY[status])}
		</span>
	);
}
