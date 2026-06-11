"use client"

import { Icon } from "@iconify/react"
import { useTranslation } from "@repo/i18n"
import Image from "next/image"
import Link from "next/link"

import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/new-card"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Project } from "@/constants/projects"
import { projects } from "@/constants/projects"
import { skills } from "@/constants/skills"

function ProjectCard({ project }: { project: Project }) {
	const { t } = useTranslation()

	return (
		<Card interactive className="gap-0 py-0">
			{/* Cover */}
			<div className="relative w-full aspect-video overflow-hidden rounded-t-[inherit] select-none">
				{project.demo ? (
					<Link
						href={project.demo}
						target="_blank"
						rel="noopener noreferrer"
						className="absolute inset-0"
						aria-label={project.title}
						tabIndex={-1}>
						<Image
							data-sensitive
							src={project.image}
							alt={project.title}
							fill
							className="object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
							sizes="(max-width: 640px) 100vw, 50vw"
							draggable={false}
						/>
					</Link>
				) : (
					<Image
						src={project.image}
						alt={project.title}
						fill
						className="object-cover object-top"
						sizes="(max-width: 640px) 100vw, 50vw"
						draggable={false}
					/>
				)}
				{project.status === "wip" && (
					<div className="absolute top-3 left-4">
						<span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
							<span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
							{t("wip")}
						</span>
					</div>
				)}
			</div>

			<CardHeader className="pt-4 pb-0">
				<CardTitle className="text-base">{project.title}</CardTitle>
				<CardAction className="flex items-center gap-0.5">
					{project.github && (
						<Tooltip>
							<TooltipTrigger
								render={
									<Link
										href={project.github}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground opacity-60 transition-all hover:opacity-100 hover:bg-accent hover:text-accent-foreground"
										aria-label={`${t("viewOnGitHub")} — ${project.title}`}
									/>
								}>
								<Icon icon="mdi:github" className="size-5" />
							</TooltipTrigger>
							<TooltipContent className="font-sans text-xs select-none">
								{t("viewOnGitHub")}
							</TooltipContent>
						</Tooltip>
					)}
					{project.demo && (
						<Tooltip>
							<TooltipTrigger
								render={
									<Link
										href={project.demo}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground opacity-60 transition-all hover:opacity-100 hover:bg-accent hover:text-accent-foreground"
										aria-label={`${t("viewSite")} — ${project.title}`}
									/>
								}>
								<Icon
									icon="lucide:external-link"
									className="size-5"
								/>
							</TooltipTrigger>
							<TooltipContent className="font-sans text-xs select-none">
								{t("viewSite")}
							</TooltipContent>
						</Tooltip>
					)}
				</CardAction>
			</CardHeader>

			<CardContent className="pt-2 pb-4 flex flex-col flex-1">
				<p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
					{t(project.descKey)}
				</p>
				<div className="mt-auto pt-3 flex flex-wrap items-center gap-2.5 select-none">
					{project.tags.map((tag) => {
						const skill = skills.find((s) => s.label === tag)
						if (!skill) return null
						return (
							<Tooltip key={tag}>
								<TooltipTrigger>
									<Image
										src={skill.icon}
										alt={skill.label}
										width={22}
										height={22}
										draggable={false}
										className={
											skill.darkInvert
												? "dark:invert"
												: ""
										}
									/>
								</TooltipTrigger>
								<TooltipContent className="font-sans text-xs select-none">
									{skill.label}
								</TooltipContent>
							</Tooltip>
						)
					})}
				</div>
			</CardContent>
		</Card>
	)
}

export default function ProjectsSection() {
	return (
		<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
			{projects.map((project) => (
				<ProjectCard key={project.id} project={project} />
			))}
		</div>
	)
}
