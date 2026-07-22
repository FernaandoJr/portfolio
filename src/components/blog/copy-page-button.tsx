"use client";

import { Icon } from "@iconify/react";
import { CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SITE_URL } from "@/constants/profile";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/blog/types";
import { useTranslation } from "@/lib/i18n";

type CopyPageButtonProps = {
	slug: string;
	markdown: Partial<Record<Locale, string>>;
	sourceLocale: Locale;
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

export function CopyPageButton({ slug, markdown, sourceLocale }: CopyPageButtonProps) {
	const { t, i18n } = useTranslation();
	const [copied, setCopied] = React.useState(false);

	React.useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timeout);
	}, [copied]);

	const active = isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
	const locale = markdown[active] ? active : sourceLocale;
	const content = markdown[locale];

	if (!content) return null;

	const markdownPath = `/blog/${slug}/markdown?lang=${locale}`;
	const prompt = encodeURIComponent(t("blogAiPrompt", { url: `${SITE_URL}${markdownPath}` }));

	function copy() {
		navigator.clipboard.writeText(content as string);
		setCopied(true);
	}

	return (
		<div className="inline-flex items-center rounded-md border border-border bg-card">
			<button
				type="button"
				onClick={copy}
				className="inline-flex cursor-pointer items-center gap-1.5 rounded-l-md py-1.5 pr-2.5 pl-2.5 text-muted-foreground text-sm transition-colors select-none hover:text-foreground"
			>
				<span className="t-icon-swap" data-state={copied ? "b" : "a"} aria-hidden>
					<span className="t-icon" data-icon="a">
						<CopyIcon className="size-3.5" />
					</span>
					<span className="t-icon" data-icon="b">
						<CheckIcon className="size-3.5 text-green-500" />
					</span>
				</span>
				{copied ? t("blogCopiedPage") : t("blogCopyPage")}
			</button>

			<DropdownMenu>
				<DropdownMenuTrigger
					aria-label={t("blogPageActions")}
					className="inline-flex cursor-pointer items-center justify-center rounded-r-md border-border border-l px-1.5 py-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
				>
					<ChevronDownIcon className="size-3.5" />
				</DropdownMenuTrigger>

				<DropdownMenuContent align="end" className="min-w-48">
					<DropdownMenuItem
						render={<a href={markdownPath} target="_blank" rel="noopener noreferrer" />}
					>
						<Icon icon="simple-icons:markdown" className="size-4" />
						{t("blogViewMarkdown")}
					</DropdownMenuItem>

					<DropdownMenuSeparator />

					{AI_TARGETS.map((target) => (
						<DropdownMenuItem
							key={target.id}
							render={
								<a href={target.url(prompt)} target="_blank" rel="noopener noreferrer" />
							}
						>
							<Icon icon={target.icon} className="size-4" />
							{t("blogOpenIn", { app: target.label })}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
