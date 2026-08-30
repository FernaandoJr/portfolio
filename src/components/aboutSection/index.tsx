"use client";

import { useTranslation } from "@/lib/i18n";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-6">
			<ul className="flex flex-col gap-3 text-muted-foreground text-sm leading-relaxed list-disc list-outside ml-4 marker:text-muted-foreground/40">
				<li>{t("aboutP1")}</li>
				<li>{t("aboutP2")}</li>
				<li>{t("aboutP3")}</li>
			</ul>

			<Link
				href="/about"
				className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit group"
			>
				{t("readMyStory")}
				<ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
			</Link>
		</div>
	);
}
