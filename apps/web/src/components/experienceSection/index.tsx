"use client"

import { useTranslation } from "@repo/i18n"
import Image from "next/image"

import {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineIndicator,
	TimelineItem,
	TimelineSide,
} from "@/components/ui/timeline"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { type Experience, experiences } from "@/constants/experience"
import { skills } from "@/constants/skills"

const modalityKey: Record<Experience["modality"], string> = {
	"remote": "remote",
	"hybrid": "hybrid",
	"on-site": "onSite",
}

const typeKey: Record<Experience["type"], string> = {
	"full-time": "fullTime",
	"part-time": "partTime",
	"freelance": "freelance",
	"internship": "internship",
}

function ExperienceCard({ exp }: { exp: Experience }) {
	const { t } = useTranslation()

	const dateRange = exp.endDate
		? `${exp.startDate} — ${exp.endDate}`
		: `${exp.startDate} — ∞`

	return (
		<TimelineItem>
			<TimelineSide>
				<TimelineIndicator current={exp.current} />
				<TimelineConnector />
			</TimelineSide>

			<TimelineContent>
				<div className="flex items-start justify-between gap-x-3 flex-wrap gap-y-0.5">
					<span className="font-medium text-foreground leading-snug">
						{exp.role}
					</span>
					<span className="text-muted-foreground/70 text-xs font-mono shrink-0 mt-[3px]">
						{dateRange}
					</span>
				</div>

				<p className="mt-0.5 text-sm text-muted-foreground">
					{exp.company}
					<span className="mx-1.5 opacity-40">·</span>
					{t(modalityKey[exp.modality])}
					<span className="mx-1.5 opacity-40">·</span>
					{t(typeKey[exp.type])}
				</p>

				<p className="mt-3 text-sm text-muted-foreground leading-relaxed">
					{t(exp.descKey)}
				</p>

				<div className="mt-3 flex flex-wrap items-center gap-2.5 select-none">
					{exp.stack.map((tag) => {
						const skill = skills.find((s) => s.label === tag)
						if (!skill) return null
						return (
							<Tooltip key={tag}>
								<TooltipTrigger>
									<Image
										src={skill.icon}
										alt={skill.label}
										width={18}
										height={18}
										draggable={false}
										className={skill.darkInvert ? "dark:invert" : ""}
									/>
								</TooltipTrigger>
								<TooltipContent className="font-sans text-xs select-none">
									{skill.label}
								</TooltipContent>
							</Tooltip>
						)
					})}
				</div>
			</TimelineContent>
		</TimelineItem>
	)
}

export default function ExperienceSection() {
	return (
		<Timeline className="mt-6">
			{experiences.map((exp) => (
				<ExperienceCard key={exp.id} exp={exp} />
			))}
		</Timeline>
	)
}
