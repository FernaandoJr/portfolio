"use client";

import { Icon } from "@iconify/react";
import { RiArrowDownSLine, RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { SITE_URL } from "@/constants/profile";
import { useTranslation } from "@/lib/i18n";

type CopyPageButtonProps = {
	markdownPath: string;
	markdown: string;
};

type AiTarget = {
	id: string;
	label: string;
	icon: string;
	url: (prompt: string) => string;
};

const AI_TARGETS: AiTarget[] = [
	{
		id: "chatgpt",
		label: "ChatGPT",
		icon: "simple-icons:openai",
		url: (p) => `https://chatgpt.com/?hints=search&q=${p}`,
	},
	{
		id: "claude",
		label: "Claude",
		icon: "simple-icons:claude",
		url: (p) => `https://claude.ai/new?q=${p}`,
	},
];

export function CopyPageButton({ markdownPath, markdown }: CopyPageButtonProps) {
	const { t } = useTranslation();
	const [copied, setCopied] = React.useState(false);

	React.useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timeout);
	}, [copied]);

	const prompt = encodeURIComponent(t("blogAiPrompt", { url: `${SITE_URL}${markdownPath}` }));

	function copy() {
		navigator.clipboard.writeText(markdown);
		setCopied(true);
	}

	return (
		<div className="inline-flex items-center rounded-md border border-stroke-soft-200 bg-bg-white-0">
			<button
				type="button"
				onClick={copy}
				className="inline-flex cursor-pointer items-center gap-1.5 rounded-l-md px-2.5 py-1.5 text-paragraph-sm text-text-sub-600 transition-colors select-none hover:text-text-strong-950"
			>
				<span className="t-icon-swap" data-state={copied ? "b" : "a"} aria-hidden>
					<span className="t-icon" data-icon="a">
						<RiFileCopyLine className="size-3.5" />
					</span>
					<span className="t-icon" data-icon="b">
						<RiCheckLine className="size-3.5 text-green-500" />
					</span>
				</span>
				{copied ? t("blogCopiedPage") : t("blogCopyPage")}
			</button>

			<DropdownMenu>
				<DropdownMenuTrigger
					aria-label={t("blogPageActions")}
					className="inline-flex cursor-pointer items-center justify-center rounded-r-md border-l border-stroke-soft-200 px-1.5 py-2 text-text-sub-600 transition-colors hover:text-text-strong-950 focus-visible:outline-none"
				>
					<RiArrowDownSLine className="size-3.5" />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="min-w-48">
					<DropdownMenuItem asChild>
						<a href={markdownPath} target="_blank" rel="noopener noreferrer">
							<Icon icon="simple-icons:markdown" className="size-4" />
							{t("blogViewMarkdown")}
						</a>
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{AI_TARGETS.map((target) => (
						<DropdownMenuItem key={target.id} asChild>
							<a href={target.url(prompt)} target="_blank" rel="noopener noreferrer">
								<Icon icon={target.icon} className="size-4" />
								{t("blogOpenIn", { app: target.label })}
							</a>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
