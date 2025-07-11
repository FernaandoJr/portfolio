import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const socials = [
	{
		iconUrl: "./linkedin.svg",
		name: "LinkedIn",
		href: "https://linkedin.com",
		message: "follow my carrer",
	},
	{
		iconUrl: "./github.svg",
		name: "GitHub",
		href: "https://github.com",
		message: "steal my code",
	},
	{
		iconUrl: "./bluesky.svg",
		name: "Bluesky",
		href: "https://bluesky.com",
		message: "read my mind",
	},
]

export default function Socials() {
	return (
		<div className="container mx-auto py-10 flex flex-col items-center justify-center">
			<h1 className="text-3xl font-bold">Socials</h1>
			<p>
				{"let's connect!"}
			</p>
			<div className="flex flex-col justify-between mt-6 bg-card border-border border rounded-lg overflow-hidden min-w-[40rem] max-w-[60rem]  select-none">
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
								{social.message}
							</p>
							</div>
							<div className="">
								<ExternalLink className="w-4 h-4" />
							</div>
					</Link>
				))}
			</div>
			<p className="text-muted-foreground">fernaando.divino@gmail.com</p>
		</div>
	)
}
