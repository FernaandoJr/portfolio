"use client"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const socials = [
	{
		iconUrl: "./linkedin.svg",
		name: "LinkedIn",
		href: "https://linkedin.com/in/fernaandojr/",
		message: "linkedinMessage",
	},
	{
		iconUrl: "./github.svg",
		name: "GitHub",
		href: "https://github.com/fernaandojr",
		message: "githubMessage",
	},
	{
		iconUrl: "./x.svg",
		name: "X/Twitter",
		href: "https://twitter.com/FernaandoJrDev",
		message: "xMessage",
	},
]

export default function Socials() {
	const { t } = useTranslation()

	return (
		<div className="container mx-auto py-10 flex flex-col items-center justify-center px-4">
			<h1 className="text-4xl my-2 font-bold">{t("socials.title")}</h1>
			<p>{t("socials.let's connect!")}</p>
			<div className="flex flex-col justify-between mt-6 bg-card border-border border rounded-lg overflow-hidden md:min-w-[40rem] w-full max-w-[40rem] select-none">
				{socials.map((social, index) => (
					<Link
						key={index}
						href={social.href}
						target="_blank"
						className="flex flex-row items-center p-4 justify-between hover:bg-muted transition-colors group">
						<div className="flex items-center gap-2 text-muted-foreground">
							<Image
								src={social.iconUrl}
								alt={social.name}
								width={24}
								height={24}
								className="w-6 h-6 dark:brightness-0 dark:invert"
							/>
							<p className="text-foreground">{social.name}</p>

							<p className="-translate-x-4 text-sm opacity-0 transition-all max-sm:hidden sm:group-hover:translate-x-0 sm:group-hover:opacity-100 dark:text-muted-foreground">
								{t(`socials.${social.message}`)}
							</p>
						</div>
						<div className="flex items-center gap-2 hover:text-accent-foreground transition-colors">
							<ExternalLink className="w-5 h-5" />
						</div>
					</Link>
				))}
			</div>
			<Link href="mailto:fernaando.divino@gmail.com">
				<p className="text-muted-foreground hover:text-primary transition-colors mt-2">
					fernaando.divino@gmail.com
				</p>
			</Link>
		</div>
	)
}
