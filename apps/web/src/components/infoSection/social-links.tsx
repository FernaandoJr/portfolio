"use client"

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import Image from "next/image"
import Link from "next/link"

const socials = [
	{
		label: "GitHub",
		href: "https://github.com/fernaandojr",
		icon: "/icons/github.svg",
	},
	{
		label: "LinkedIn",
		href: "https://linkedin.com/in/fernaandojr",
		icon: "/icons/linkedin.svg",
	},
	{ label: "X", href: "https://x.com/FernaandoJrDev", icon: "/icons/x.svg" },
	{
		label: "Discord",
		href: "https://discord.com/channels/@me/352762446290747392",
		icon: "/icons/discord.svg",
	},
	{
		label: "YouTube",
		href: "https://youtube.com/@fernaandojr",
		icon: "/icons/youtube.svg",
	},
]

export function SocialLinks() {
	return (
		<div className="flex items-center gap-2 my-4">
			{socials.map((social) => (
				<Tooltip key={social.label}>
					<TooltipTrigger className="inline-flex items-center justify-center rounded-md p-2 opacity-50 hover:opacity-100 hover:bg-accent transition-all">
						<Link
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}>
							<Image
								src={social.icon}
								alt={social.label}
								width={16}
								height={16}
								className="dark:invert"
							/>
						</Link>
					</TooltipTrigger>
					<TooltipContent>{social.label}</TooltipContent>
				</Tooltip>
			))}
		</div>
	)
}
