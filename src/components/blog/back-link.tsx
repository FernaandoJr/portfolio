"use client";

import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";

import { useTranslation } from "@/lib/i18n";

export function BackLink({ href, labelKey }: { href: string; labelKey: string }) {
	const { t } = useTranslation();

	return (
		<Link
			href={href}
			className="inline-flex w-fit items-center gap-1.5 text-text-sub-600 text-sm transition-colors hover:text-text-strong-950"
		>
			<RiArrowLeftLine className="size-3.5" />
			{t(labelKey)}
		</Link>
	);
}
