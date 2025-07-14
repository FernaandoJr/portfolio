"use client"
import { useScroll } from "framer-motion"
import { Coffee, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./dark-mode"
import { usePathname } from "next/navigation"

export const Header = () => {
	const [menuState, setMenuState] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const { scrollYProgress } = useScroll()
	const pathName = usePathname()

	const menuItems = [
		{ name: "/projects", href: "/projects" },
		{ name: "/articles", href: "/articles" },
		{ name: "/about", href: "/about" },
	]

	useEffect(() => {
		const unsubscribe = scrollYProgress.on("change", (latest) => {
			setScrolled(latest > 0.05)
		})
		return () => unsubscribe()
	}, [scrollYProgress])

	return (
		<header className="select-none">
			<nav
				data-state={menuState && "active"}
				className={cn(
					"group fixed z-20 w-full border-b transition-colors duration-150",
					scrolled && "bg-background/50 backdrop-blur-3xl"
				)}>
				<div className="mx-auto max-w-5xl px-6 transition-all duration-300">
					<div className="relative flex flex-wrap items-center justify-between gap-6 py-3 md:gap-0 md:py-4">
						<div className="flex w-full items-center justify-between gap-12 md:w-auto">
							<Link
								href="/"
								aria-label="home"
								className="flex items-center space-x-2 gap-2">
								<Coffee className="h-6 text-primary" />
								FernaandoJr
							</Link>

							<button
								onClick={() => setMenuState(!menuState)}
								aria-label={
									menuState ? "Close Menu" : "Open Menu"
								}
								className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 md:hidden">
								<Menu className="m-auto size-6 duration-200 group-data-[state=active]:scale-0 group-data-[state=active]:rotate-180 group-data-[state=active]:opacity-0" />
								<X className="absolute inset-0 m-auto size-6 scale-0 -rotate-180 opacity-0 duration-200 group-data-[state=active]:scale-100 group-data-[state=active]:rotate-0 group-data-[state=active]:opacity-100" />
							</button>

							<div className="hidden md:block">
								<ul className="flex gap-8 text-sm">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Button
												variant={"link"}
												className={cn(
													"text-muted-foreground hover:text-accent-foreground",
													pathName === item.href &&
														"text-primary font-medium"
												)}>
												<Link
													href={item.href}
													className={cn(
														"text-foreground hover:text-accent-foreground block duration-150",
														pathName ===
															item.href &&
															"text-primary hover:text-primary font-medium"
													)}>
													<span>{item.name}</span>
												</Link>
											</Button>
										</li>
									))}
								</ul>
							</div>
						</div>

						<div className="bg-background mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 group-data-[state=active]:block md:m-0 md:flex md:w-fit md:flex-nowrap md:gap-6 md:space-y-0 md:border-transparent md:bg-transparent md:p-0 md:shadow-none md:group-data-[state=active]:flex dark:shadow-none dark:md:bg-transparent">
							<div className="md:hidden">
								<ul className="space-y-6 text-base">
									{menuItems.map((item, index) => (
										<li key={index}>
											<Link
												href={item.href}
												className="text-muted-foreground hover:text-accent-foreground block duration-150">
												<span>{item.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="flex w-full items-center flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
								<ModeToggle />
							</div>
						</div>
					</div>
				</div>
			</nav>
		</header>
	)
}
