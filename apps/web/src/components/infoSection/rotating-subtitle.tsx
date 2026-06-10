"use client"

import { useTranslation } from "@repo/i18n"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

const subtitleKeys = [
	"technologyEnthusiast",
	"passionateAboutProgramming",
	"designEngineer",
	"softwareBuilder",
	"detailObsessed",
] as const

const duration = 0.7

const charVariants = {
	initial: { filter: "blur(6px)", opacity: 0 },
	animate: { filter: "blur(0px)", opacity: 1 },
	exit: { filter: "blur(6px)", opacity: 0 },
}

export function RotatingSubtitle() {
	const { t } = useTranslation()
	const [index, setIndex] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % subtitleKeys.length)
		}, 3000)
		return () => clearInterval(interval)
	}, [])

	const phrases = subtitleKeys.map((key) => t(key))
	const current = phrases[index]!

	return (
		<div className="inline-grid font-base align-baseline text-base text-muted-foreground">
			{phrases.map((phrase, i) => (
				<span
					key={i}
					className="invisible col-start-1 row-start-1 block whitespace-nowrap"
					aria-hidden="true">
					{phrase.split("").map((char: string, j: number) => (
						<span key={j} className="inline-block whitespace-pre">
							{char}
						</span>
					))}
				</span>
			))}

			<AnimatePresence mode="sync">
				<motion.span
					key={index}
					className="col-start-1 row-start-1 block whitespace-nowrap"
					initial="initial"
					animate="animate"
					exit="exit">
					{current.split("").map((char, i) => (
						<motion.span
							key={i}
							variants={charVariants}
							transition={{
								duration,
								delay: (i * duration) / current.length,
							}}
							className="inline-block whitespace-pre">
							{char}
						</motion.span>
					))}
				</motion.span>
			</AnimatePresence>
		</div>
	)
}
