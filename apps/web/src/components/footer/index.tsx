"use client"

import { useTranslation } from "@repo/i18n"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { socials } from "@/constants/socials"

export default function Footer() {
	const { t } = useTranslation()

	const navLinks = [
		{ labelKey: "navAbout", href: "#about" },
		{ labelKey: "navProjects", href: "#projects" },
		{ labelKey: "experienceTitle", href: "#experience" },
		{ labelKey: "navContact", href: "#contact" },
	]

	return (
		<footer className="py-10 my-10 select-none">
			<div className="w-full max-w-3xl mx-auto px-6 lg:px-0 flex flex-col items-center gap-6">
				<div className="flex flex-wrap justify-center gap-5">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors">
							{t(link.labelKey)}
						</Link>
					))}
				</div>

				<div className="flex items-center gap-4">
					{socials.map((social) => (
						<Link
							key={social.label}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={social.label}
							className="text-muted-foreground hover:text-foreground transition-colors">
							<Image
								src={social.icon}
								alt={social.label}
								width={18}
								height={18}
								className="size-[18px] dark:invert opacity-50 hover:opacity-100 transition-opacity"
							/>
						</Link>
					))}
				</div>

				<div className="flex items-center justify-between w-full">
					<span className="text-xs text-muted-foreground/50 select-none flex items-center gap-1.5">
						<Link
							href="https://github.com/fernaandojr/portfolio"
							target="_blank"
							rel="noopener noreferrer"
							title={t("footerSource")}
							className="inline-flex items-center hover:opacity-100 opacity-50 transition-opacity">
							<Image
								src="/icons/github.svg"
								alt="GitHub"
								width={12}
								height={12}
								className="size-3 dark:invert"
							/>
						</Link>
					</span>
					<span className="text-xs text-muted-foreground/50 select-none flex items-center gap-1">
						{t("footerMadeWith")}{" "}
						<Heart className="size-3 fill-red-500 text-red-500" />
					</span>
				</div>
			</div>
		</footer>
	)
}
