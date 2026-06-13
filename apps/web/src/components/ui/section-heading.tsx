"use client";

import { Link } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
	id: string;
	children: React.ReactNode;
	className?: string;
};

export function SectionHeading({ id, children, className }: SectionHeadingProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const url = `${window.location.origin}${window.location.pathname}#${id}`;
		navigator.clipboard.writeText(url);
		window.history.pushState(null, "", `#${id}`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={cn("group flex items-center gap-2", className)}>
			<h2 id={id} className="text-3xl font-bold scroll-mt-36">
				{children}
			</h2>
			<button
				onClick={handleCopy}
				aria-label="Copy link to section"
				className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground/50 hover:text-muted-foreground cursor-pointer select-none"
			>
				<Link className={cn("size-4 transition-transform", copied && "text-green-500")} />
			</button>
		</div>
	);
}
