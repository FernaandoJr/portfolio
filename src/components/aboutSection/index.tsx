"use client";

import { useTranslation } from "@/lib/i18n";
import { RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";

export default function AboutSection() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col gap-6">
			<ul className="flex flex-col gap-3 text-text-sub-600 text-sm leading-relaxed list-disc list-outside ml-4 marker:text-text-sub-600/40">
				<li>{t("aboutP1")}</li>
				<li>{t("aboutP2")}</li>
				<li>{t("aboutP3")}</li>
			</ul>

			<Link
				href="/about"
				className="inline-flex items-center gap-1.5 text-sm text-text-sub-600 hover:text-text-strong-950 transition-colors w-fit group"
			>
				{t("readMyStory")}
				<RiArrowRightLine className="size-3.5 transition-transform group-hover:translate-x-0.5" />
			</Link>
		</div>
	);
}
