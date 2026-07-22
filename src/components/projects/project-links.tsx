"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProjectLinks({ repo, live }: { repo?: string | undefined; live?: string | undefined }) {
	const { t } = useTranslation();

	if (!repo && !live) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			{repo && (
				<Link
					href={repo}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
				>
					<Icon icon="mdi:github" className="size-4" />
					{t("viewOnGitHub")}
				</Link>
			)}
			{live && (
				<Link
					href={live}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1.5")}
				>
					<Icon icon="lucide:external-link" className="size-4" />
					{t("viewSite")}
				</Link>
			)}
		</div>
	);
}
