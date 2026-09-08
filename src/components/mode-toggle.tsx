"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import * as React from "react";

export function ModeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button
				variant="neutral"
				mode="ghost"
				size="xsmall"
				className={cn("size-9 cursor-pointer p-0", className)}
			>
				<RiMoonLine className="size-[1.2rem]" />
				<span className="sr-only">Toggle theme</span>
			</Button>
		);
	}

	return (
		<Button
			variant="neutral"
			mode="ghost"
			size="xsmall"
			className={cn("size-9 cursor-pointer p-0", className)}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			<motion.div
				className="flex items-center justify-center"
				initial={false}
				animate={{ rotate: theme === "dark" ? 0 : 180 }}
				transition={{
					duration: 0.5,
					ease: "easeOut",
					type: "spring",
					bounce: 0.1,
				}}
			>
				<RiSunLine className="size-[1.2rem] dark:hidden" />
				<RiMoonLine className="hidden size-[1.2rem] dark:block" />
			</motion.div>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
