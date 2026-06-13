"use client";

import { useTranslation } from "@repo/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, MailIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import SkillsSection from "@/components/skillsSection";
import { EMAIL, LOCATION, NAME } from "@/constants/profile";
import { GithubHeatmap } from "./github-heatmap";
import { LocalTime } from "./local-time";
import { RotatingSubtitle } from "./rotating-subtitle";
import { SocialLinks } from "./social-links";

export default function InfoSection() {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);

	function copyEmail() {
		navigator.clipboard.writeText(EMAIL);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<>
			<div className="flex flex-row items-center gap-4">
				<div className="border w-fit border-border rounded-md overflow-hidden">
					<Image src="/pt-br.svg" alt="Fernando Jr" width={80} height={80} className="size-20" />
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="text-3xl font-bold">{NAME}</p>
					<RotatingSubtitle />
				</div>
			</div>

			<div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-6 sm:gap-x-12 justify-start my-12">
				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground uppercase font-bold text-sm">{t("location")}</p>
					<div className="flex items-center gap-2">
						<MapPinIcon className="size-4 text-foreground" />
						<p className="text-foreground uppercase font-normal text-sm">{LOCATION}</p>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<p className="text-muted-foreground uppercase font-bold text-sm">{t("email")}</p>
					<button onClick={copyEmail} className="flex items-center gap-2 cursor-pointer group">
						<div className="relative size-4">
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={copied ? "check" : "mail"}
									initial={{ opacity: 0, y: -4 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 4 }}
									transition={{ duration: 0.1 }}
									className="absolute inset-0 flex"
								>
									{copied ? (
										<CheckIcon className="size-4 text-foreground" />
									) : (
										<MailIcon className="size-4 text-foreground" />
									)}
								</motion.span>
							</AnimatePresence>
						</div>
						<p className="text-foreground uppercase font-normal text-sm group-hover:underline underline-offset-2">
							{EMAIL}
						</p>
					</button>
				</div>

				<LocalTime />
			</div>

			<SocialLinks />
			<GithubHeatmap />
			<SkillsSection />
		</>
	);
}
