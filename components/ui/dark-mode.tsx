"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	React.useEffect(() => {
		const userTheme = localStorage.getItem("theme") || "system"
		setTheme(userTheme)
	}, [setTheme])

	// Prevent hydration mismatch by not rendering until mounted
	if (!mounted) {
		return (
			<Button 
				variant="outline" 
				size="icon" 
				className="cursor-pointer"
			>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		)
	}

	return (
		<Button 
			variant="outline" 
			size="icon" 
			className="cursor-pointer" 
			onClick={() => {
				setTheme(theme === "dark" ? "light" : "dark")
			}}
		>
			<motion.div
				initial={false}
				animate={{ rotate: theme === "dark" ? 360 : 0 }}
				transition={{ duration: 0.5, ease: "easeOut", type: "spring", bounce: 0.1 }}
			>
				<Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
				<Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100 top-0 left-0 rotate-0" />
			</motion.div>
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
