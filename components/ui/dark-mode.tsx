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
			className="flex items-center justify-center"
				initial={false}
				animate={{ rotate: theme === "dark" ? 0 : 180 }}
				transition={{ duration: 0.5, ease: "easeOut", type: "spring", bounce: 0.1 }}
			>
				<Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
				<Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block" />
			</motion.div>
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
