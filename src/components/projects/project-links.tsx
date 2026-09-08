"use client";

import { RiExternalLinkLine, RiGithubLine } from "@remixicon/react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function ProjectLinks({
	repo,
	live,
}: {
	repo?: string | undefined;
	live?: string | undefined;
}) {
	const { t } = useTranslation();

	if (!repo && !live) return null;

	return (
		<div className="flex flex-wrap items-center justify-end gap-2">
			{repo && (
				<Link
					href={repo}
					target="_blank"
					rel="noopener noreferrer"
					className={buttonVariants({
						variant: "neutral",
						mode: "stroke",
						size: "small",
					}).root({ class: "gap-1.5" })}
				>
					<RiGithubLine className="size-4" />
					{t("viewOnGitHub")}
				</Link>
			)}
			{live && (
				<Link
					href={live}
					target="_blank"
					rel="noopener noreferrer"
					className={buttonVariants({
						variant: "primary",
						mode: "filled",
						size: "small",
					}).root({ class: "gap-1.5" })}
				>
					<RiExternalLinkLine className="size-4" />
					{t("viewSite")}
				</Link>
			)}
		</div>
	);
}
