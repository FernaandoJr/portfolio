"use client";

import Image from "next/image";
import Link from "next/link";

import { ProjectStatusBadge } from "@/components/projects/project-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/new-card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { skills } from "@/constants/skills";
import type { ProjectStatus } from "@/lib/projects/types";

export type ProjectCardData = {
	slug: string;
	href: string;
	title: string;
	description: string;
	cover?: string | undefined;
	stack: string[];
	status: ProjectStatus;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
	return (
		<Card interactive className="gap-0 py-0">
			{project.cover && (
				<div className="relative aspect-video w-full overflow-hidden rounded-t-[inherit] select-none">
					<Link href={project.href} className="absolute inset-0" tabIndex={-1} aria-hidden>
						<Image
							src={project.cover}
							alt={project.title}
							fill
							className="object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
							sizes="(max-width: 640px) 100vw, 50vw"
							draggable={false}
						/>
					</Link>
					{project.status !== "completed" && (
						<div className="absolute top-3 left-4">
							<ProjectStatusBadge status={project.status} overlay />
						</div>
					)}
				</div>
			)}

			<CardHeader className="pt-4 pb-0">
				<CardTitle className="text-base">
					<Link href={project.href} className="transition-colors hover:text-muted-foreground">
						{project.title}
					</Link>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col pt-2 pb-4">
				<p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
					{project.description}
				</p>
				<div className="mt-auto flex flex-wrap items-center gap-2.5 pt-3 select-none">
					{project.stack.map((tag) => {
						const skill = skills.find((s) => s.label === tag);
						if (!skill) return null;

						return (
							<Tooltip key={tag}>
								<TooltipTrigger>
									<Image
										src={skill.icon}
										alt={skill.label}
										width={22}
										height={22}
										draggable={false}
										className={"size-[22px] " + (skill.darkInvert ? "dark:invert" : "")}
									/>
								</TooltipTrigger>
								<TooltipContent className="font-sans text-xs select-none">
									{skill.label}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
