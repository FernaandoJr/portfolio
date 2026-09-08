import * as React from "react";

import { cn } from "@/utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
	interactive?: boolean;
};

function Card({ className, interactive, children, ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			className={cn(
				"relative flex h-full flex-col overflow-hidden rounded-[18px] border border-stroke-soft-200 bg-bg-soft-50 dark:border-stroke-soft-100/40 dark:bg-white/[0.03]",
				interactive && "transition duration-200 ease-out hover:border-stroke-sub-300",
				className
			)}
			{...props}
		>
			<div
				data-slot="card-inner"
				className="m-0.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 dark:border-stroke-soft-100/40 dark:bg-[#0c0c0c]"
			>
				{children}
			</div>
		</div>
	);
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="card-header"
			className={cn("flex flex-col gap-1.5 px-5 pt-4", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			data-slot="card-title"
			className={cn("text-label-md text-text-strong-950", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			data-slot="card-description"
			className={cn("text-paragraph-sm text-text-sub-600", className)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="card-content"
			className={cn("flex flex-1 flex-col px-5 pb-4", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-5 pb-4", className)}
			{...props}
		/>
	);
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
