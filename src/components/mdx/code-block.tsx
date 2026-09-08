"use client";

import { RiCheckLine } from "@remixicon/react";
import * as React from "react";

import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGUAGE_LABEL: Record<string, string> = {
	bash: "Bash",
	css: "CSS",
	diff: "Diff",
	go: "Go",
	graphql: "GraphQL",
	html: "HTML",
	java: "Java",
	js: "JS",
	json: "JSON",
	jsx: "JSX",
	md: "MD",
	mdx: "MDX",
	plaintext: "TXT",
	prisma: "Prisma",
	py: "Python",
	python: "Python",
	rust: "Rust",
	sh: "Shell",
	shell: "Shell",
	sql: "SQL",
	svelte: "Svelte",
	ts: "TS",
	tsx: "TSX",
	vue: "Vue",
	yaml: "YAML",
	yml: "YAML",
};

function labelFor(language: string): string {
	return LANGUAGE_LABEL[language.toLowerCase()] ?? language.toUpperCase();
}

function CopyIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 20 20"
			className={className}
			aria-hidden
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.25"
				d="M7.892 7.892V4.81a.81.81 0 0 1 .81-.81h6.487a.81.81 0 0 1 .811.81v6.487a.81.81 0 0 1-.81.811h-3.082m-.81-4.216H4.81a.81.81 0 0 0-.811.81v6.487a.81.81 0 0 0 .81.811h6.487a.81.81 0 0 0 .811-.81V8.702a.81.81 0 0 0-.81-.811Z"
			/>
		</svg>
	);
}

type CodeCardProps = {
	language?: string;
	title?: string;
	children: React.ReactNode;
	className?: string;
};

export function CodeCard({ language, title, children, className }: CodeCardProps) {
	const { t } = useTranslation();
	const ref = React.useRef<HTMLDivElement>(null);
	const [copied, setCopied] = React.useState(false);

	React.useEffect(() => {
		if (!copied) return;
		const timeout = setTimeout(() => setCopied(false), 2000);
		return () => clearTimeout(timeout);
	}, [copied]);

	function copy() {
		const code = ref.current?.querySelector("code");
		navigator.clipboard.writeText(code?.textContent ?? "");
		setCopied(true);
	}

	const label = title ?? (language ? labelFor(language) : undefined);

	return (
		<div
			ref={ref}
			className={cn(
				"component-source not-prose my-4 flex flex-col gap-2 rounded-20 bg-bg-weak-50 p-2 md:my-6 md:gap-3 md:p-3",
				className
			)}
		>
			<div className="flex w-full items-center justify-between gap-3 px-2">
				{label ? (
					<span className="truncate font-mono text-paragraph-xs font-medium tracking-normal text-text-sub-600 md:text-paragraph-sm">
						{label}
					</span>
				) : (
					<span />
				)}
				<button
					type="button"
					onClick={copy}
					aria-label={t("blogCopyCode")}
					className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center text-text-sub-600 transition-colors hover:text-text-strong-950"
				>
					<span className="t-icon-swap size-6" data-state={copied ? "b" : "a"} aria-hidden>
						<span className="t-icon" data-icon="a">
							<CopyIcon className="size-6" />
						</span>
						<span className="t-icon" data-icon="b">
							<RiCheckLine className="size-6 text-green-500" />
						</span>
					</span>
				</button>
			</div>

			<div className="relative max-h-[600px] overflow-auto rounded-[11px] bg-bg-white-0 text-paragraph-xs font-medium leading-5 tracking-normal shadow-regular-xs md:text-paragraph-sm md:leading-[22px] [&_code]:py-4 [&_code]:pr-4">
				{children}
			</div>
		</div>
	);
}
