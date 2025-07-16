import { Separator } from "@/components/ui/separator"
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card"
import { ExternalLink, Eye, GitFork, Github, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "./badge"
import languageColors from "@/utils/colors.json"

interface ProjectCardProps {
	readonly name: string
	readonly description: string
	readonly html_url: string
	readonly stars: number
	readonly forks: number
	readonly homepage?: string
	readonly topics?: string[]
	readonly watchers?: number
	readonly language?: string
}

export default function ProjectCard({
	name,
	description,
	html_url,
	stars,
	forks,
	homepage,
	topics,
	watchers,
	language,
}: ProjectCardProps) {
	const getLanguageColor = (lang: string | undefined): string => {
		if (!lang) return "#64748b" // Default gray color

		const colors = languageColors as Record<
			string,
			{ color: string | null; url: string }
		>
		const languageData = colors[lang]

		return languageData?.color || "#64748b" // Default gray if language not found or color is null
	}
	return (
		<Card className="flex w-full min-w-[15rem] max-w-[25rem] flex-col overflow-hidden ">
			<CardHeader>
				<CardTitle className="text-primary text-lg">{name}</CardTitle>
				<CardDescription>{description}</CardDescription>
				<CardAction>
					<Link
						href={html_url}
						target="_blank"
						className="flex items-center gap-2 hover:text-secondary  transition-colors"
						rel="noopener noreferrer">
						<Github />
					</Link>
				</CardAction>
			</CardHeader>
			<CardContent>
				{topics && topics.length > 0 && (
					<div className="mb-4 flex flex-wrap items-center gap-2 select-none">
						{topics.map((topic) => (
							<Badge
								key={topic}
								variant={"outline"}
								className="text-xs text-secondary dark:text-accent-foreground">
								{topic}
							</Badge>
						))}
					</div>
				)}
				<Separator />
			</CardContent>
			<CardFooter className="flex flex-row items-start justify-between">
				<div className="flex flex-wrap justify-between gap-2 select-none h-auto">
					<div className="flex items-center gap-1 text-xs">
						<div
							className="rounded-full h-3 aspect-square"
							style={{
								backgroundColor: getLanguageColor(language),
							}}></div>
						<span>{language}</span>
					</div>

					<div className="">
						<Separator orientation="vertical" className="h-6" />
					</div>

					<div className="flex items-center gap-1 hover:text-primary transition-colors">
						<GitFork className="h-4" />
						<span className="text-sm">{forks}</span>
					</div>
					<div className="flex items-center gap-1 hover:text-primary transition-colors">
						<Star className="h-4" />
						<span className="text-sm">{stars}</span>
					</div>
					<div className="flex items-center gap-1 hover:text-primary transition-colors">
						<Eye className="h-4" />
						<span className="text-sm">{watchers}</span>
					</div>
				</div>
				{homepage && (
					<div className="">
						<Link
							href={homepage}
							target="_blank"
							className="flex items-center gap-2 hover:text-secondary transition-colors"
							rel="noopener noreferrer">
							<ExternalLink />
						</Link>
					</div>
				)}
			</CardFooter>
		</Card>
	)
}
