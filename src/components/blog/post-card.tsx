"use client";

import Image from "next/image";
import Link from "next/link";

import { PostMeta } from "@/components/blog/post-meta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/new-card";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/blog/types";
import { useTranslation } from "@/lib/i18n";

export type PostCardVariant = {
	title: string;
	description: string;
	date: string;
	tags: string[];
	cover?: string | undefined;
	readingMinutes: number;
};

type PostCardProps = {
	slug: string;
	sourceLocale: Locale;
	variants: Partial<Record<Locale, PostCardVariant>>;
};

export function PostCard({ slug, sourceLocale, variants }: PostCardProps) {
	const { i18n } = useTranslation();

	const active = isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
	const variant = variants[active] ?? variants[sourceLocale];
	if (!variant) return null;

	return (
		<Card interactive className="gap-0 py-0">
			{variant.cover && (
				<div className="relative aspect-video w-full overflow-hidden rounded-t-[inherit] select-none">
					<Link href={`/blog/${slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden>
						<Image
							src={variant.cover}
							alt={variant.title}
							fill
							className="object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
							sizes="(max-width: 640px) 100vw, 50vw"
							draggable={false}
						/>
					</Link>
				</div>
			)}

			<CardHeader className="pt-4 pb-0">
				<CardTitle className="text-base">
					<Link href={`/blog/${slug}`} className="hover:text-muted-foreground transition-colors">
						{variant.title}
					</Link>
				</CardTitle>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col pt-2 pb-4">
				<p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
					{variant.description}
				</p>
				<div className="mt-auto pt-3">
					<PostMeta date={variant.date} readingMinutes={variant.readingMinutes} />
				</div>
			</CardContent>
		</Card>
	);
}
