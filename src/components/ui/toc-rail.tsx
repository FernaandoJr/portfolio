"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TocRailItem = {
	id: string;
	text: string;
	depth: number;
};

const CURVE_HEIGHT = 6;
const CURVE_LENGTH = 14;
const REVEAL_TRANSITION = "stroke-dasharray 300ms cubic-bezier(0.4, 0, 0.2, 1)";

function itemOffset(depth: number): number {
	return depth <= 2 ? 20 : 32;
}

function lineOffset(depth: number): number {
	return depth <= 2 ? 8 : 16;
}

type Geometry = {
	path: string;
	width: number;
	height: number;
	starts: number[];
	ends: number[];
	total: number;
};

function measure(items: TocRailItem[], nodes: Array<HTMLAnchorElement | null>): Geometry {
	const path: string[] = [];
	const starts: number[] = [];
	const ends: number[] = [];

	let width = 0;
	let height = 0;
	let length = 0;

	for (let index = 0; index < items.length; index++) {
		const node = nodes[index];
		const item = items[index];
		if (!node || !item) continue;

		const offset = lineOffset(item.depth);
		const previous = items[index - 1];
		const next = items[index + 1];
		const breaksAbove = previous !== undefined && lineOffset(previous.depth) !== offset;
		const breaksBelow = next !== undefined && lineOffset(next.depth) !== offset;

		const top = node.offsetTop;
		const bottom = top + node.clientHeight;
		const from = breaksAbove ? top + CURVE_HEIGHT : top;
		const to = breaksBelow ? bottom - CURVE_HEIGHT : bottom;

		if (index === 0) {
			path.push(`M ${offset} ${from}`);
		} else if (breaksAbove) {
			const previousOffset = lineOffset(previous.depth);
			path.push(`C ${previousOffset} ${top + 2} ${offset} ${top - 2} ${offset} ${from}`);
			length += CURVE_LENGTH;
		}

		starts.push(length);
		path.push(`L ${offset} ${to}`);
		length += to - from;
		ends.push(length);

		width = Math.max(width, offset);
		height = Math.max(height, bottom);
	}

	return { path: path.join(" "), width: width + 1, height, starts, ends, total: length };
}

export function TocRail({
	items,
	activeIds,
	onSelect,
	className,
}: {
	items: TocRailItem[];
	activeIds: string[];
	onSelect?: (id: string) => void;
	className?: string;
}) {
	const navRef = React.useRef<HTMLDivElement>(null);
	const nodesRef = React.useRef<Array<HTMLAnchorElement | null>>([]);
	const [geometry, setGeometry] = React.useState<Geometry | null>(null);

	React.useLayoutEffect(() => {
		const nav = navRef.current;
		if (!nav) return;

		const update = () => setGeometry(measure(items, nodesRef.current));

		update();

		const observer = new ResizeObserver(update);
		observer.observe(nav);
		return () => observer.disconnect();
	}, [items]);

	const active = React.useMemo(() => {
		const indexes = items
			.map((item, index) => (activeIds.includes(item.id) ? index : -1))
			.filter((index) => index >= 0);

		if (indexes.length === 0 || !geometry) return null;

		const first = indexes[0]!;
		const last = indexes[indexes.length - 1]!;
		const start = geometry.starts[first];
		const end = geometry.ends[last];
		if (start === undefined || end === undefined) return null;

		return { start, length: Math.max(end - start, 1) };
	}, [items, activeIds, geometry]);

	if (items.length === 0) return null;

	return (
		<div ref={navRef} className={cn("relative isolate flex flex-col", className)}>
			{geometry && (
				<svg
					aria-hidden="true"
					className="pointer-events-none absolute top-0 left-0 text-primary"
					style={{ width: geometry.width, height: geometry.height }}
				>
					<path
						d={geometry.path}
						fill="none"
						stroke="currentColor"
						strokeWidth={1}
						strokeLinecap="round"
						style={{
							strokeDasharray: active
								? `0 ${active.start} ${active.length} ${geometry.total}`
								: `0 0 0 ${geometry.total}`,
							transition: REVEAL_TRANSITION,
						}}
					/>
				</svg>
			)}

			{items.map((item, index) => {
				const offset = lineOffset(item.depth);
				const previous = items[index - 1];
				const next = items[index + 1];
				const breaksAbove = previous !== undefined && lineOffset(previous.depth) !== offset;
				const breaksBelow = next !== undefined && lineOffset(next.depth) !== offset;
				const previousOffset = previous ? lineOffset(previous.depth) : offset;

				return (
					<a
						key={item.id}
						ref={(node) => {
							nodesRef.current[index] = node;
						}}
						href={`#${item.id}`}
						data-active={activeIds.includes(item.id)}
						onClick={(event) => {
							if (!onSelect) return;
							event.preventDefault();
							onSelect(item.id);
						}}
						className="relative py-1.5 text-muted-foreground text-sm transition-colors first:pt-0 last:pb-0 hover:text-foreground data-[active=true]:text-primary"
						style={{ paddingInlineStart: itemOffset(item.depth) }}
					>
						{breaksAbove && (
							<svg
								aria-hidden="true"
								viewBox="8 0 8 12"
								className="-top-1.5 absolute -z-10"
								style={{
									width: 9,
									height: 12,
									insetInlineStart: Math.min(offset, previousOffset),
								}}
							>
								<path
									d={
										offset > previousOffset
											? "M 8 0 C 8 8 16 4 16 12"
											: "M 16 0 C 16 8 8 4 8 12"
									}
									fill="none"
									stroke="currentColor"
									strokeWidth={1}
									className="text-foreground/10"
								/>
							</svg>
						)}

						<div
							aria-hidden="true"
							className={cn(
								"absolute inset-y-0 -z-10 w-px bg-foreground/10",
								breaksAbove && "top-1.5",
								breaksBelow && "bottom-1.5"
							)}
							style={{ insetInlineStart: offset }}
						/>

						{item.text}
					</a>
				);
			})}
		</div>
	);
}
