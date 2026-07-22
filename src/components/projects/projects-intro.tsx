"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslation } from "@/lib/i18n";

export function ProjectsIntro() {
	const { t } = useTranslation();

	return <SectionHeading id="projects">{t("projectsAllTitle")}</SectionHeading>;
}

export function ProjectsEmptyState() {
	const { t } = useTranslation();

	return <p className="text-muted-foreground text-sm">{t("projectsEmpty")}</p>;
}
