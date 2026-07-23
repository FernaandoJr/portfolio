"use client";

import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { ProjectCard, type ProjectCardData } from "@/components/projects/project-card";
import { useTranslation } from "@/lib/i18n";
import { DEFAULT_LOCALE, toSegment, type Locale } from "@/lib/i18n/routing";
import { useCurrentLanguage } from "@/lib/i18n/use-current-language";

export function FeaturedProjects({ byLocale }: { byLocale: Record<Locale, ProjectCardData[]> }) {
	const { t } = useTranslation();
	const locale = useCurrentLanguage();
	const projects = byLocale[locale] ?? byLocale[DEFAULT_LOCALE];

	return (
		<div className="mt-8 flex flex-col gap-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{projects.map((project) => (
					<ProjectCard key={project.slug} project={project} />
				))}
			</div>

			<Link
				href={`/${toSegment(locale)}/projects`}
				className="inline-flex w-fit items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
			>
				{t("projectsViewAll")}
				<ArrowRightIcon className="size-3.5" />
			</Link>
		</div>
	);
}
