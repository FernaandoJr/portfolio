import { cn } from "@/lib/utils";
import * as React from "react";

const Timeline = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
	({ className, ...props }, ref) => (
		<ol ref={ref} className={cn("flex flex-col", className)} {...props} />
	)
);
Timeline.displayName = "Timeline";

const TimelineItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
	({ className, ...props }, ref) => (
		<li
			ref={ref}
			className={cn(
				"grid grid-cols-[20px_1fr] gap-x-4 pb-10 last:pb-0",
				"[&:last-child_[data-slot='timeline-connector']]:hidden",
				className
			)}
			{...props}
		/>
	)
);
TimelineItem.displayName = "TimelineItem";

const TimelineSide = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col items-center", className)} {...props} />
	)
);
TimelineSide.displayName = "TimelineSide";

interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
	current?: boolean;
}

const TimelineIndicator = React.forwardRef<HTMLDivElement, TimelineIndicatorProps>(
	({ className, current, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"relative mt-[6px] size-3 shrink-0 flex items-center justify-center",
				className
			)}
			data-slot="timeline-indicator"
			{...props}
		>
			<div className={cn("size-2.5 rounded-full", current ? "bg-green-500" : "bg-border")} />
			{current && <span className="absolute inset-0 rounded-full bg-green-400/70 animate-ping" />}
		</div>
	)
);
TimelineIndicator.displayName = "TimelineIndicator";

const TimelineConnector = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("mt-1.5 w-px flex-1 bg-border/50", className)}
			data-slot="timeline-connector"
			{...props}
		/>
	)
);
TimelineConnector.displayName = "TimelineConnector";

const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("min-w-0", className)} {...props} />
	)
);
TimelineContent.displayName = "TimelineContent";

export {
	Timeline,
	TimelineConnector,
	TimelineContent,
	TimelineIndicator,
	TimelineItem,
	TimelineSide,
};
