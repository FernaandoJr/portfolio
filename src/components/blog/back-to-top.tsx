"use client";

import { useReducedMotion } from "framer-motion";
import { MoveUpIcon } from "lucide-react";

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
				variant="ghost"
				size="icon-lg"
				onClick={scrollToTop}
				aria-label={t("blogBackToTop")}
				title={t("blogBackToTop")}
				className="cursor-pointer text-muted-foreground"
			>
				<MoveUpIcon className="size-4" />
			</Button>
		</div>
	);
}
