"use client";

import Image from "next/image";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { skills } from "@/constants/skills";

export function ProjectStack({ stack }: { stack: string[] }) {
	if (stack.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-2.5 select-none">
			{stack.map((tag) => {
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
						<TooltipContent className="font-sans text-xs select-none">{skill.label}</TooltipContent>
					</Tooltip>
				);
			})}
		</div>
	);
}
