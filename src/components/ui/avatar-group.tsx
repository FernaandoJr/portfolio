"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

import { cn } from "@/lib/utils";

const TRANSITION_DURATION = 0.3;
const EASE_OUT_CUBIC = [0.215, 0.61, 0.355, 1] as const;
const STAGGER_DELAY = 0.05;

export type AvatarGroupItem = {
	id: string;
	node: React.ReactNode;
	label: string;
	href?: string | undefined;
};

export interface AvatarGroupProps {
	items: AvatarGroupItem[];
	maxVisible?: number;
	size?: number;
	overlap?: number;
	ring?: number;
	className?: string;
	avatarClassName?: string;
}

export function AvatarGroup({
	items,
	maxVisible = 5,
	size = 40,
	overlap = 8,
	ring = 2,
	className,
	avatarClassName,
}: AvatarGroupProps) {
	const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
	const shouldReduceMotion = useReducedMotion();

	const visible = items.slice(0, maxVisible);
	const extraCount = items.length - visible.length;

	if (items.length === 0) return null;

	return (
		<div className={cn("relative flex items-center", className)}>
			{visible.map((item, index) => (
				<motion.a
					key={item.id}
					href={item.href}
					{...(item.href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
					aria-label={item.label}
					className={cn(
						"relative block overflow-hidden rounded-full bg-background",
						item.href && "cursor-pointer",
						avatarClassName
					)}
					style={{
						width: size + ring * 2,
						height: size + ring * 2,
						borderWidth: ring,
						borderStyle: "solid",
						borderColor: "var(--background)",
						marginLeft: index === 0 ? 0 : -overlap,
						zIndex: hoveredIdx === index ? 20 : visible.length - index,
					}}
					initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, x: -20 }}
					animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
					transition={
						shouldReduceMotion
							? { duration: 0 }
							: {
									duration: TRANSITION_DURATION,
									delay: index * STAGGER_DELAY,
									ease: EASE_OUT_CUBIC,
								}
					}
					whileHover={shouldReduceMotion ? {} : { scale: 1.12 }}
					onMouseEnter={() => setHoveredIdx(index)}
					onMouseLeave={() => setHoveredIdx(null)}
					onFocus={() => setHoveredIdx(index)}
					onBlur={() => setHoveredIdx(null)}
				>
					{item.node}
				</motion.a>
			))}

			{extraCount > 0 && (
				<div
					className="flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground"
					style={{
						width: size + ring * 2,
						height: size + ring * 2,
						borderWidth: ring,
						borderStyle: "solid",
						borderColor: "var(--background)",
						marginLeft: -overlap,
						fontSize: size * 0.32,
						zIndex: 0,
					}}
				>
					+{extraCount}
				</div>
			)}

			<AnimatePresence>
				{hoveredIdx !== null && visible[hoveredIdx] && (
					<motion.span
						key="tooltip"
						initial={{ y: 6, opacity: 0, scale: 0.9 }}
						animate={{ y: 0, opacity: 1, scale: 1 }}
						exit={{ y: 6, opacity: 0, scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 24 }}
						className="pointer-events-none absolute z-30 -translate-x-1/2 rounded-md bg-primary px-2 py-1 font-medium text-primary-foreground text-xs whitespace-nowrap shadow-lg"
						style={{
							bottom: size + ring * 2 + 6,
							left: hoveredIdx * (size + ring * 2 - overlap) + (size + ring * 2) / 2,
						}}
					>
						{visible[hoveredIdx].label}
					</motion.span>
				)}
			</AnimatePresence>
		</div>
	);
}
