"use client";

import { useReducedMotion } from "framer-motion";
import { RiArrowUpLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";

export function BackToTop() {
	const { t } = useTranslation();
	const prefersReducedMotion = useReducedMotion();

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
	}

	return (
		<div className="flex justify-end">
			<Button
				variant="neutral"
				mode="ghost"
				size="xsmall"
				onClick={scrollToTop}
				aria-label={t("blogBackToTop")}
				title={t("blogBackToTop")}
				className="size-9 cursor-pointer p-0 text-text-sub-600"
			>
				<RiArrowUpLine className="size-4" />
			</Button>
		</div>
	);
}
