"use client";

import { Icon } from "@iconify/react";
import * as React from "react";

import { TocRail, type TocRailItem } from "@/components/ui/toc-rail";
import type { TocEntry } from "@/lib/blog/toc";
import { useTranslation } from "@/lib/i18n";

type PostScrubberProps = {
	toc: TocEntry[];
};

const BAND_TOP = 100;

export function PostScrubber({ toc }: PostScrubberProps) {
	const { t } = useTranslation();
	const [activeIds, setActiveIds] = React.useState<string[]>([]);

	React.useEffect(() => {
		if (toc.length === 0) return;

		function onScroll() {
			const tops = toc.map(
				(entry) => document.getElementById(entry.id)?.getBoundingClientRect().top ?? Infinity
			);
			const bandBottom = window.innerHeight;

			const visible = toc.filter((_, index) => {
				const start = tops[index] ?? Infinity;
				const end = tops[index + 1] ?? Infinity;

				return start < bandBottom && end > BAND_TOP;
			});

			if (visible.length > 0) {
				setActiveIds(visible.map((entry) => entry.id));
				return;
			}

			let fallback = toc[0];
			toc.forEach((entry, index) => {
				if ((tops[index] ?? Infinity) <= BAND_TOP) fallback = entry;
			});
			setActiveIds(fallback ? [fallback.id] : []);
		}

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [toc]);

	const items = React.useMemo<TocRailItem[]>(
		() => toc.map((entry) => ({ id: entry.id, text: entry.text, depth: entry.depth })),
		[toc]
	);

	const handleSelect = React.useCallback((id: string) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.scrollIntoView({ behavior: "smooth", block: "start" });
		window.history.pushState(null, "", `#${id}`);
	}, []);

	if (items.length < 2) return null;

	return (
		<div className="fixed top-24 right-10 z-30 hidden w-56 select-none min-[1500px]:block">
			<h3 className="mb-3 inline-flex items-center gap-1.5 text-muted-foreground text-sm">
				<Icon icon="lucide:align-left" className="size-4" />
				{t("blogTocLabel")}
			</h3>

			<TocRail
				items={items}
				activeIds={activeIds}
				onSelect={handleSelect}
				className="max-h-[60vh] overflow-y-auto [scrollbar-width:none]"
			/>
		</div>
	);
}
