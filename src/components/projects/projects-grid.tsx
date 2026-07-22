"use client";

import * as React from "react";

import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProjectsGrid({ projects }: { projects: ProjectCardData[] }) {
	const { t } = useTranslation();
	const [filter, setFilter] = React.useState<string | null>(null);

	const tags = [...new Set(projects.flatMap((project) => project.stack))].sort();
	const visible = filter ? projects.filter((project) => project.stack.includes(filter)) : projects;

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap gap-2 select-none">
				<FilterChip active={filter === null} onClick={() => setFilter(null)}>
					{t("projectFilterAll")}
				</FilterChip>

				{tags.map((tag) => (
					<FilterChip
						key={tag}
						active={filter === tag}
						onClick={() => setFilter(filter === tag ? null : tag)}
					>
						{tag}
					</FilterChip>
				))}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{visible.map((project) => (
					<ProjectCard key={project.slug} project={project} />
				))}
			</div>
		</div>
	);
}

function FilterChip({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={cn(
				"cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors",
				active
					? "border-foreground/20 bg-foreground/10 text-foreground"
					: "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
			)}
		>
			{children}
		</button>
	);
}
