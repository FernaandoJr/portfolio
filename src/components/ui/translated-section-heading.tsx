"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { useTranslation } from "@/lib/i18n";

/** Lets a Server Component render a section heading without pulling in i18n. */
export function TranslatedSectionHeading({
	id,
	tKey,
	className,
}: {
	id: string;
	tKey: string;
	className?: string;
}) {
	const { t } = useTranslation();

	return (
		<SectionHeading id={id} className={className}>
			{t(tKey)}
		</SectionHeading>
	);
}
