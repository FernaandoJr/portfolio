"use client";

import { RiLink } from "@remixicon/react";

import { useTranslation } from "@/lib/i18n";

type PostHeadingProps = {
	as: "h2" | "h3" | "h4";
	id?: string;
	children: React.ReactNode;
};

export function PostHeading({ as: Tag, id, children }: PostHeadingProps) {
	const { t } = useTranslation();

	if (!id) return <Tag>{children}</Tag>;

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const url = `${window.location.origin}${window.location.pathname}#${id}`;
		navigator.clipboard.writeText(url);
		window.history.pushState(null, "", `#${id}`);
	};

	return (
		<Tag id={id}>
			<a
				href={`#${id}`}
				onClick={handleClick}
				aria-label={t("blogCopyLink")}
				className="group inline-flex items-center gap-2 text-inherit no-underline"
			>
				{children}
				<RiLink className="size-4 shrink-0 text-text-sub-600/50 opacity-0 transition-opacity group-hover:opacity-100" />
			</a>
		</Tag>
	);
}
