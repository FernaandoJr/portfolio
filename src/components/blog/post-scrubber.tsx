"use client";

import * as React from "react";

import { ChapterScrubber, type Chapter } from "@/components/ui/chapter-scrubber";
import type { TocEntry } from "@/lib/blog/toc";
import { useTranslation } from "@/lib/i18n";

type PostScrubberProps = {
	toc: TocEntry[];
};

// Matches the fixed header offset used by scroll-margin-top on prose headings.
const HEADING_OFFSET = 160;

export function PostScrubber({ toc }: PostScrubberProps) {
	const { t } = useTranslation();
	const [currentIndex, setCurrentIndex] = React.useState(0);

	React.useEffect(() => {
		if (toc.length === 0) return;

		function onScroll() {
			const scrolledToEnd =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

			if (scrolledToEnd) {
				setCurrentIndex(toc.length - 1);
				return;
			}

			let next = 0;
			toc.forEach((entry, index) => {
				const el = document.getElementById(entry.id);
				if (el && el.getBoundingClientRect().top - HEADING_OFFSET <= 0) next = index;
			});
			setCurrentIndex(next);
		}

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [toc]);

	const chapters = React.useMemo<Chapter[]>(
		() =>
			toc.map((entry, index) => ({
				id: entry.id,
				title: entry.text,
				meta: String(index + 1).padStart(2, "0"),
			})),
		[toc]
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
