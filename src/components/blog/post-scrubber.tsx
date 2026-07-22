"use client";

import * as React from "react";

import { ChapterScrubber, type Chapter } from "@/components/ui/chapter-scrubber";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/blog/types";
import type { TocEntry } from "@/lib/blog/toc";
import { useTranslation } from "@/lib/i18n";

type PostScrubberProps = {
	toc: Partial<Record<Locale, TocEntry[]>>;
	sourceLocale: Locale;
};

// Matches the fixed header offset used by scroll-margin-top on prose headings.
const HEADING_OFFSET = 160;

export function PostScrubber({ toc, sourceLocale }: PostScrubberProps) {
	const { t, i18n } = useTranslation();
	const [currentIndex, setCurrentIndex] = React.useState(0);

	const active = isLocale(i18n.language) ? i18n.language : DEFAULT_LOCALE;
	const entries = React.useMemo(
		() => toc[active] ?? toc[sourceLocale] ?? [],
		[toc, active, sourceLocale]
	);

	React.useEffect(() => {
		if (entries.length === 0) return;

		function onScroll() {
			const scrolledToEnd =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

			if (scrolledToEnd) {
				setCurrentIndex(entries.length - 1);
				return;
			}

			let next = 0;
			entries.forEach((entry, index) => {
				const el = document.getElementById(entry.id);
				if (el && el.getBoundingClientRect().top - HEADING_OFFSET <= 0) next = index;
			});
			setCurrentIndex(next);
		}

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [entries]);

	const chapters = React.useMemo<Chapter[]>(
		() =>
			entries.map((entry, index) => ({
				id: entry.id,
				title: entry.text,
				meta: String(index + 1).padStart(2, "0"),
			})),
		[entries]
	);

	const handleSelect = React.useCallback((chapter: Chapter) => {
		const el = document.getElementById(chapter.id);
		if (!el) return;
		el.scrollIntoView({ behavior: "smooth", block: "start" });
		window.history.pushState(null, "", `#${chapter.id}`);
	}, []);

	if (chapters.length < 2) return null;

	return (
		<div className="pointer-events-none fixed top-40 right-14 z-30 hidden select-none min-[1500px]:block">
			<div className="pointer-events-auto">
				<ChapterScrubber
					chapters={chapters}
					side="left"
					peakLength={40}
					restLength={12}
					rowHeight={14}
					radius={3}
					currentIndex={currentIndex}
					onSelect={handleSelect}
					label={t("blogTocLabel")}
				/>
			</div>
		</div>
	);
}
