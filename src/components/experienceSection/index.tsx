"use client";

import { useTranslation } from "@/lib/i18n";
import Image from "next/image";
import { useCallback, useState } from "react";

import { ChevronDown, ExternalLink, Infinity as InfinityIcon } from "lucide-react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/new-hover-card";
import {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineIndicator,
	TimelineItem,
	TimelineSide,
} from "@/components/ui/timeline";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type Experience, experiences } from "@/constants/experience";
import { translateDate } from "@/lib/utils";
import { skills } from "@/constants/skills";

function ExpandableText({ text }: { text: string }) {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	const [clamped, setClamped] = useState(false);

	const ref = useCallback((el: HTMLParagraphElement | null) => {
		if (el) setClamped(el.scrollHeight > el.clientHeight);
	}, []);

	return (
		<div className="mt-3">
			<p
				ref={ref}
				className={`text-sm text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
			>
				{text}
			</p>
			{(clamped || expanded) && (
				<Tooltip>
					<TooltipTrigger
						onClick={() => setExpanded((v) => !v)}
						className="mt-0.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer inline-flex items-center gap-0.5 select-none"
					>
						{expanded ? t("showLess") : t("showMore")}
						<ChevronDown
							className={`size-3 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
						/>
					</TooltipTrigger>
					<TooltipContent className="text-xs select-none">
						{expanded ? t("showLess") : t("showMore")}
					</TooltipContent>
				</Tooltip>
			)}
		</div>
	);
}

const modalityKey: Record<Experience["modality"], string> = {
	remote: "remote",
	hybrid: "hybrid",
	"on-site": "onSite",
};

const typeKey: Record<Experience["type"], string> = {
	"full-time": "fullTime",
	"part-time": "partTime",
	freelance: "freelance",
	internship: "internship",
};

function ExperienceCard({ exp }: { exp: Experience }) {
	const { t } = useTranslation();

	return (
		<TimelineItem>
			<TimelineSide>
				<TimelineIndicator current={exp.current} />
				<TimelineConnector />
			</TimelineSide>

			<TimelineContent>
				<div className="flex items-start justify-between gap-x-3 flex-wrap gap-y-0.5">
					{exp.companyInfo ? (
						<HoverCard>
							<HoverCardTrigger asChild>
								<a
									href={exp.companyInfo.url}
									target="_blank"
									rel="noopener noreferrer"
									className="font-medium text-foreground leading-snug cursor-pointer hover:text-foreground/70 transition-colors"
								>
									{t(exp.roleKey)}
								</a>
							</HoverCardTrigger>
							<HoverCardContent side="top" align="start" sideOffset={8}>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<div className="size-7 shrink-0 flex items-center justify-center rounded-md border border-[color:var(--hc-border)] p-0.5">
												{exp.companyInfo.logo ? (
													<Image
														src={exp.companyInfo.logo}
														alt={exp.companyInfo.name}
														width={28}
														height={28}
														className="size-7 object-contain"
													/>
												) : (
													<span className="text-xs font-bold text-muted-foreground">
														{exp.companyInfo.name.charAt(0)}
													</span>
												)}
											</div>
											<p className="text-sm font-semibold">{exp.companyInfo.name}</p>
										</div>
										<a
											href={exp.companyInfo.url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-[color:var(--hc-foreground)] opacity-40 hover:opacity-100 transition-opacity"
										>
											<ExternalLink className="size-3.5" />
										</a>
									</div>
									<p className="text-[13px] leading-5 opacity-60">{t(exp.companyInfo.descKey)}</p>
								</div>
							</HoverCardContent>
						</HoverCard>
					) : (
						<span className="font-medium text-foreground leading-snug">{t(exp.roleKey)}</span>
					)}
					<span className="text-muted-foreground/70 text-xs font-serif shrink-0 mt-[3px] flex items-center gap-1 select-none">
						{translateDate(exp.startDate, t)}
						{" · "}
						{exp.endDate ? translateDate(exp.endDate, t) : <InfinityIcon className="size-3.5" />}
					</span>
				</div>

				<p className="mt-0.5 text-xs text-muted-foreground/60">
					{t(modalityKey[exp.modality])}, {t(typeKey[exp.type])}
				</p>

				<ExpandableText text={t(exp.descKey)} />
				<ul className="mt-2 space-y-1">
					{exp.bulletKeys.map((key) => (
						<li
							key={key}
							className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed"
						>
							<span className="mt-[7px] size-1 shrink-0 rounded-full bg-muted-foreground/40" />
							{t(key)}
						</li>
					))}
				</ul>

				<div className="mt-3 flex flex-wrap items-center gap-2.5 select-none">
					{exp.stack.map((tag) => {
						const skill = skills.find((s) => s.label === tag);
						if (!skill) return null;
						return (
							<Tooltip key={tag}>
								<TooltipTrigger>
									<Image
										src={skill.icon}
										alt={skill.label}
										width={18}
										height={18}
										draggable={false}
										className={
											"size-[18px] cursor-pointer " + (skill.darkInvert ? "dark:invert" : "")
										}
									/>
								</TooltipTrigger>
								<TooltipContent className="font-sans text-xs select-none">
									{skill.label}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</TimelineContent>
		</TimelineItem>
	);
}

export default function ExperienceSection() {
	return (
		<Timeline className="mt-6">
			{experiences.map((exp) => (
				<ExperienceCard key={exp.id} exp={exp} />
			))}
		</Timeline>
	);
}
