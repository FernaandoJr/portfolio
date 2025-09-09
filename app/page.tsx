"use client"

import Hero from "@/components/ui/hero"
import Socials from "@/components/ui/socials"
import { useMetadata } from "@/hooks/use-metadata"

export default function Home() {
	useMetadata()

	return (
		<div className="">
			<Hero />
			<Socials />
		</div>
	)
}
