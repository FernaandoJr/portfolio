"use client";

import Link from "next/link";

import { PostCover } from "@/components/blog/post-cover";
import { PostMeta } from "@/components/blog/post-meta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/new-card";

type PostCardProps = {
	href: string;
	title: string;
	description: string;
	date: string;
	readingMinutes: number;
	cover: string;
};

export function PostCard({
	href,
	title,
	description,
	date,
	readingMinutes,
	cover,
}: PostCardProps) {
	return (
		<Card interactive className="group gap-0 py-0">
			<Link href={href} aria-label={title} className="absolute inset-0 z-10 rounded-[inherit]" />

			<PostCover src={cover} alt={title} />

			<CardHeader className="pt-4 pb-0">
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col pt-2 pb-4">
				<p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{description}</p>
				<div className="mt-auto pt-3">
					<PostMeta date={date} readingMinutes={readingMinutes} />
				</div>
			</CardContent>
		</Card>
	);
}
