"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import Image from "next/image";
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

const LANGUAGE_ICON: Record<string, string> = {
	bash: "shell",
	css: "brackets-purple",
	docker: "docker",
	dockerfile: "docker",
	go: "go",
	graphql: "graphql",
	html: "code-orange",
	java: "java",
	js: "js",
	json: "brackets-yellow",
	jsx: "react",
	markdown: "markdown",
	md: "markdown",
	mdx: "mdx",
	prisma: "prisma",
	py: "python",
	python: "python",
	rs: "rust",
	rust: "rust",
	sh: "shell",
	shell: "shell",
	sql: "database",
	svelte: "svelte",
	toml: "gear",
	ts: "ts",
	tsx: "react-ts",
	txt: "text",
	plaintext: "text",
	vue: "vue",
	xml: "xml",
	yaml: "yaml",
	yml: "yaml",
};

function labelFor(language: string): string {
	return LANGUAGE_LABEL[language.toLowerCase()] ?? language.toUpperCase();
}

function iconFor(language: string): string | null {
	const icon = LANGUAGE_ICON[language.toLowerCase()];
	return icon ? `/icons/lang/${icon}.svg` : null;
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

	const showHeader = Boolean(language ?? title);
	const icon = language ? iconFor(language) : null;

	const copyButton = (
		<button
			type="button"
			onClick={copy}
			aria-label={t("blogCopyCode")}
			className={cn(
				"inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-[color,opacity] hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100",
				!showHeader && "absolute top-2.5 right-2.5"
			)}
		>
			<span className="t-icon-swap" data-state={copied ? "b" : "a"} aria-hidden>
				<span className="t-icon" data-icon="a">
					<CopyIcon className="size-3.5" />
				</span>
				<span className="t-icon" data-icon="b">
					<CheckIcon className="size-3.5 text-green-500" />
				</span>
			</span>
		</button>
	);

	return (
		<div
			ref={ref}
			data-rehype-pretty-code-figure=""
			className={cn(
				"not-prose group relative my-6 overflow-hidden rounded-lg border border-border bg-card",
				className
			)}
		>
			{showHeader ? (
				<div className="flex items-center gap-2.5 border-border border-b py-1.5 pr-1.5 pl-3 select-none">
					{language &&
						(icon ? (
							<Image
								src={icon}
								alt={labelFor(language)}
								width={16}
								height={16}
								className="size-4 shrink-0"
							/>
						) : (
							<span className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase leading-none tracking-wide">
								{labelFor(language)}
							</span>
						))}
					{title && (
						<span className="truncate font-mono text-muted-foreground text-xs">{title}</span>
					)}
					<span className="ml-auto flex items-center">{copyButton}</span>
				</div>
			) : (
				copyButton
			)}

			{children}
		</div>
	);
}
