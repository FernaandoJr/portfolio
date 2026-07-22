"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslation } from "@/lib/i18n";

export function BlogIntro() {
	const { t } = useTranslation();

	return <SectionHeading id="blog">{t("blogTitle")}</SectionHeading>;
}

export function BlogEmptyState() {
	const { t } = useTranslation();

	return <p className="text-muted-foreground text-sm">{t("blogEmpty")}</p>;
}
