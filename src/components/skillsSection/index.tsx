"use client";

import { useTranslation } from "@/lib/i18n";
import { motion } from "framer-motion";
import Image from "next/image";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { skills } from "@/constants/skills";

export default function SkillsSection() {
	const { t } = useTranslation();
	return (
		<div className="flex flex-col gap-4">
			<p className="text-muted-foreground uppercase font-bold text-sm">{t("techStack")}</p>
			<div className="flex flex-wrap gap-x-4 gap-y-4 select-none">
				{skills.map((skill) => (
					<Tooltip key={skill.id}>
						<TooltipTrigger
							render={
								<motion.a
									href={skill.href}
									target="_blank"
									rel="noopener noreferrer"
									className="size-8 flex items-center justify-center"
									whileHover={{ scale: 1.15, y: -2 }}
									whileTap={{ scale: 0.92 }}
									transition={{
										type: "spring",
										stiffness: 400,
										damping: 17,
									}}
								/>
							}
						>
							<Image
								src={skill.icon}
								alt={skill.label}
								width={32}
								height={32}
								draggable={false}
								className={
									"size-8 " +
									(skill.alwaysInvert ? "invert" : skill.darkInvert ? "dark:invert" : "")
								}
							/>
						</TooltipTrigger>
						<TooltipContent className={"select-none"}>
							<p>{skill.label}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</div>
		</div>
	);
}
