"use client"

import { Download } from "lucide-react"
import { Button } from "./button"
import { Typewriter } from "./typewriter"

export default function Hero() {
	return (
		<div className="py-40 container mx-auto">
			<div className=" ">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
						Hi, I&apos;m{" "}
						<span className="text-primary">Fernando</span>
					</h1>
					<h2 className="text-lg text-muted-foreground sm:text-xl md:text-2xl">
						<span>{"Passionate about "}</span>
						<Typewriter
							text={[
								"Technology",
								"Programming",
								"Web Development",
								"Open Source Projects",
								"Games",
								"AI",
							]}
							speed={75}
							className="text-secondary dark:text-accent-foreground"
							waitTime={1500}
							deleteSpeed={50}
							cursorChar={"▏"}
						/>
					</h2>
						<div className="w-lg text-center">
							<p>
								Software Developer with a passion for creating beautiful and functional web applications. I love working with React, Next.js, and TypeScript. Always eager to learn and explore new technologies.
							</p>
						</div>
					<div className="flex flex-row gap-4">

						<Button variant={"secondary"} className="cursor-pointer">
							<Download className="text-secondary-foreground"/>
							Download CV
							</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
