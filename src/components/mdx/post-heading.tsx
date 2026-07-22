"use client";

import { Link } from "lucide-react";
import { useState } from "react";

import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type PostHeadingProps = {
	as: "h2" | "h3" | "h4";
	id?: string;
	children: React.ReactNode;
};

export function PostHeading({ as: Tag, id, children }: PostHeadingProps) {
	const { t } = useTranslation();
	const [copied, setCopied] = useState(false);

	if (!id) return <Tag>{children}</Tag>;

	const handleCopy = () => {
		const url = `${window.location.origin}${window.location.pathname}#${id}`;
		navigator.clipboard.writeText(url);
		window.history.pushState(null, "", `#${id}`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Tag id={id} className="group flex items-center gap-2">
			{children}
			<button
				onClick={handleCopy}
				aria-label={t("blogCopyLink")}
				className="cursor-pointer text-muted-foreground/50 opacity-0 transition-opacity select-none hover:text-muted-foreground focus-visible:opacity-100 group-hover:opacity-100"
			>
				<Link className={cn("size-4 transition-transform", copied && "text-green-500")} />
			</button>
		</Tag>
	);
}
