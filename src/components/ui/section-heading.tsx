"use client";

import { Link } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
	id: string;
	children: React.ReactNode;
	className?: string;
};

export function SectionHeading({ id, children, className }: SectionHeadingProps) {
	const { t } = useTranslation();

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const url = `${window.location.origin}${window.location.pathname}#${id}`;
		navigator.clipboard.writeText(url);
		window.history.pushState(null, "", `#${id}`);
	};

	return (
		<h2 id={id} className={cn("scroll-mt-36 font-bold text-3xl", className)}>
			<a
				href={`#${id}`}
				onClick={handleClick}
				aria-label={t("blogCopyLink")}
				className="group inline-flex items-center gap-2 text-inherit no-underline"
			>
				{children}
				<Link className="size-4 shrink-0 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100" />
			</a>
		</h2>
	);
}
