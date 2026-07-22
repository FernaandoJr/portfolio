import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

import { CodeCard } from "@/components/mdx/code-block";
import { PostHeading } from "@/components/mdx/post-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/new-card";
import { cn } from "@/lib/utils";

function isExternal(href: string): boolean {
	return href.startsWith("http://") || href.startsWith("https://");
}

function PostImage({
	src,
	alt,
	width = 1600,
	height = 900,
	className,
}: {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
}) {
	return (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			sizes="(max-width: 768px) 100vw, 768px"
			className={cn("rounded-lg border border-border", className)}
			style={{ width: "100%", height: "auto" }}
		/>
	);
}

export const mdxComponents: MDXComponents = {
	a: ({ href, children, ...props }) => {
		const target = href ?? "#";

		if (isExternal(target)) {
			return (
				<a href={target} target="_blank" rel="noopener noreferrer" {...props}>
					{children}
				</a>
			);
		}

		return (
			<Link href={target} {...props}>
				{children}
			</Link>
		);
	},
	img: ({ src, alt }) => <PostImage src={String(src ?? "")} alt={alt ?? ""} />,
	h2: ({ id, children }) => (
		<PostHeading as="h2" id={id}>
			{children}
		</PostHeading>
	),
	h3: ({ id, children }) => (
		<PostHeading as="h3" id={id}>
			{children}
		</PostHeading>
	),
	h4: ({ id, children }) => (
		<PostHeading as="h4" id={id}>
			{children}
		</PostHeading>
	),
	figure: ({ children, ...props }) => {
		const attrs = props as Record<string, unknown>;

		if (!("data-rehype-pretty-code-figure" in attrs)) {
			return <figure {...props}>{children}</figure>;
		}

		const language = attrs["data-language"];
		const title = attrs["data-title"];

		return (
			<CodeCard
				language={typeof language === "string" ? language : undefined}
				title={typeof title === "string" ? title : undefined}
			>
				{children}
			</CodeCard>
		);
	},
	Image: PostImage,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
};
