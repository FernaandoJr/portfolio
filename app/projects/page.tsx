"use client"

import { Button } from "@/components/ui/button"
import ProjectCard from "@/components/ui/project-card"
import { Spinner } from "@/components/ui/spinner"
import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
interface Repository {
	id: number
	name: string
	description: string
	html_url: string
	stargazers_count: number
	watchers_count: number
	forks_count: number
	language: string
	homepage?: string // Optional field for homepage URL
	topics?: string[] // Optional field for topics
}

export default function Home() {
	const [repositories, setRepositories] = useState<Repository[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const { t } = useTranslation()

	useEffect(() => {
		const fetchRepositories = async () => {
			const CACHE_KEY = "github_repositories"
			const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

			try {
				// Check if we have cached data
				const cachedData = localStorage.getItem(CACHE_KEY)
				const cacheTimestamp = localStorage.getItem(
					`${CACHE_KEY}_timestamp`
				)

				if (cachedData && cacheTimestamp) {
					const now = Date.now()
					const cacheAge = now - parseInt(cacheTimestamp)

					// If cache is still valid (less than 6 hours old)
					if (cacheAge < CACHE_DURATION) {
						const parsedData = JSON.parse(cachedData)
						setRepositories(parsedData)
						setLoading(false)
						console.log("Using cached repository data")
						return
					}
				}

				// If no valid cache, fetch from API
				const username = "FernaandoJr"
				const repoNames = [
					"astrovista",
					"qrafthive",
					"noxium",
					"nexcpu",
					"flit",
					"reactjs-portfolio",
					"synthwave-remix-min-darker",
				]

				const repoPromises = repoNames.map((repoName) =>
					axios.get(
						`https://api.github.com/repos/${username}/${repoName}`,
						{
							headers: {
								Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`, // Use your GitHub token here
								Accept: "application/vnd.github.v3+json",
							},
						}
					)
				)

				const responses = await Promise.all(repoPromises)
				const repos = responses.map((response) => response.data)

				// Cache the data
				localStorage.setItem(CACHE_KEY, JSON.stringify(repos))
				localStorage.setItem(
					`${CACHE_KEY}_timestamp`,
					Date.now().toString()
				)

				setRepositories(repos)
			} catch (error) {
				console.error("Error fetching repositories:", error)

				// If API fails, try to use cached data even if expired
				const cachedData = localStorage.getItem(CACHE_KEY)
				if (cachedData) {
					console.log("API failed, using expired cached data")
					setRepositories(JSON.parse(cachedData))
					setError(null) // Clear any previous errors
					return
				}

				setError(t("projectsError"))
			} finally {
				setLoading(false)
			}
		}

		fetchRepositories()
	}, [t])

	if (error) {
		return (
			<div className="flex justify-center flex-col gap-2 items-center h-screen">
				<div className="text-lg text-red-500">{error}</div>
			</div>
		)
	}
	return (
		<div className="container mx-auto py-26 px-4 sm:px-6 lg:px-8">
			{loading ? (
				<div className="flex justify-center flex-col gap-2 items-center h-screen">
					<Spinner />
					<div className="text-lg">{t("loadingProjects")}</div>
				</div>
			) : (
				<>
					<div className="text-4xl font-bold text-center my-8 select-none">
						{t("personalProjects")}
					</div>
					<div className="flex flex-wrap justify-center gap-x-3 gap-y-3">
						{repositories.map((repo) => (
							<ProjectCard
								key={repo.id}
								name={repo.name}
								description={repo.description}
								html_url={repo.html_url}
								stars={repo.stargazers_count}
								forks={repo.forks_count}
								homepage={repo.homepage}
								topics={repo.topics}
								watchers={repo.watchers_count}
								language={repo.language}
							/>
						))}
					</div>
					<div className="select-none">
						<Link
							href="https://github.com/FernaandoJr?tab=repositories"
							className="flex justify-center mt-6">
							<Button className="cursor-pointer">
								{t("viewMoreProjects")}
							</Button>
						</Link>
					</div>
				</>
			)}
		</div>
	)
}
