"use client"

import { MotionConfig, motion, useReducedMotion } from "framer-motion"
import * as React from "react"
import { createContext, useContext } from "react"

import { registryTheme } from "@/lib/registry-theme"
import { cn } from "@/lib/utils"

interface ReducedMotionProp {
	reducedMotion?: boolean
}

const ReducedMotionOverrideContext = createContext(false)

function useResolvedReducedMotion(reducedMotion?: boolean) {
	const reducedMotionOverride = useContext(ReducedMotionOverrideContext)
	const prefersReducedMotion = useReducedMotion() ?? false

	return Boolean(reducedMotion || reducedMotionOverride || prefersReducedMotion)
}

function ReducedMotionConfig({
	children,
	reducedMotion,
}: ReducedMotionProp & { children: React.ReactNode }) {
	const resolvedReducedMotion = useResolvedReducedMotion(reducedMotion)

	return (
		<MotionConfig reducedMotion={resolvedReducedMotion ? "always" : "user"}>
			{children}
		</MotionConfig>
	)
}

const MotionDiv = motion.div

const cardLayoutTransition = {
	type: "spring" as const,
	stiffness: 220,
	damping: 30,
	mass: 0.85,
}

type MotionSafeDivProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	| "onAnimationEnd"
	| "onAnimationIteration"
	| "onAnimationStart"
	| "onDrag"
	| "onDragEnd"
	| "onDragEnter"
	| "onDragExit"
	| "onDragLeave"
	| "onDragOver"
	| "onDragStart"
	| "onDrop"
>

type CardProps = MotionSafeDivProps &
	ReducedMotionProp & {
		interactive?: boolean
	}

type CardSectionProps = MotionSafeDivProps

const cardSectionMotionProps = {
	layout: "position" as const,
	transition: cardLayoutTransition,
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
	if (typeof ref === "function") {
		ref(value)
		return
	}

	if (ref) {
		ref.current = value
	}
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
	(
		{ children, className, interactive = false, reducedMotion, ...props },
		ref
	) => {
		return (
			<ReducedMotionConfig reducedMotion={reducedMotion}>
				<MotionDiv
					{...props}
					className={cn(
						registryTheme,
						"relative flex transform-gpu flex-col gap-4 overflow-hidden rounded-lg border border-border/70 bg-card py-4 text-card-foreground text-sm",
						"before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-px before:bg-linear-to-r before:from-transparent before:via-foreground/12 before:to-transparent before:opacity-60",
						"has-[>img:first-child]:pt-0 has-data-[slot=card-footer]:pb-0",
						"[&>img:first-child]:rounded-t-[inherit] [&>img:last-child]:rounded-b-[inherit]",
						interactive && [
							"transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
							"before:transition-opacity before:duration-300 hover:border-foreground/11 hover:bg-card hover:before:opacity-100",
							"focus-within:border-foreground/11 focus-within:bg-card focus-within:before:opacity-100",
						],
						!interactive && [
							"transition-[border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
						],
						className
					)}
					data-interactive={interactive ? "true" : undefined}
					data-slot="card"
					initial={false}
					layout
					ref={(node) => assignRef(ref, node)}
					transition={cardLayoutTransition}
				>
					{children}
				</MotionDiv>
			</ReducedMotionConfig>
		)
	}
)

Card.displayName = "Card"

function CardHeader({ className, ...props }: CardSectionProps) {
	return (
		<MotionDiv
			className={cn(
				"group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
				className
			)}
			data-slot="card-header"
			{...cardSectionMotionProps}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: CardSectionProps) {
	return (
		<MotionDiv
			className={cn(
				"font-heading font-medium text-base leading-snug tracking-[-0.01em]",
				className
			)}
			data-slot="card-title"
			{...cardSectionMotionProps}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: CardSectionProps) {
	return (
		<MotionDiv
			className={cn("text-muted-foreground text-sm leading-6", className)}
			data-slot="card-description"
			{...cardSectionMotionProps}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: CardSectionProps) {
	return (
		<MotionDiv
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className
			)}
			data-slot="card-action"
			{...cardSectionMotionProps}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: CardSectionProps) {
	return (
		<MotionDiv
			className={cn("px-4", className)}
			data-slot="card-content"
			{...cardSectionMotionProps}
			{...props}
		/>
	)
}

function CardFooter({ className, ...props }: CardSectionProps) {
	return (
		<MotionDiv
			className={cn(
				"flex items-center rounded-b-[inherit] border-border/60 border-t p-4 text-muted-foreground transition-colors duration-300",
				className
			)}
			data-slot="card-footer"
			{...cardSectionMotionProps}
			{...props}
		/>
	)
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
}
