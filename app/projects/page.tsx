"use client"

import ProjectCard from "@/components/ui/project-card";
import { Spinner } from "@/components/ui/spinner";
import axios from 'axios';
import { useEffect, useState } from 'react';
interface Repository {
	id: number;
	name: string;
	description: string;
	html_url: string;
	stargazers_count: number;
	watchers_count: number;
	forks_count: number;
	language: string;
	homepage?: string; // Optional field for homepage URL
	topics?: string[]; // Optional field for topics
}

export default function Home(){
const [repositories, setRepositories] = useState<Repository[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
	const fetchRepositories = async () => {
		const CACHE_KEY = 'github_repositories';
		const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

		try {
			// Check if we have cached data
			const cachedData = localStorage.getItem(CACHE_KEY);
			const cacheTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);
			
			if (cachedData && cacheTimestamp) {
				const now = Date.now();
				const cacheAge = now - parseInt(cacheTimestamp);
				
				// If cache is still valid (less than 6 hours old)
				if (cacheAge < CACHE_DURATION) {
					const parsedData = JSON.parse(cachedData);
					setRepositories(parsedData);
					setLoading(false);
					console.log('Using cached repository data');
					return;
				}
			}
			
			// If no valid cache, fetch from API
			const username = 'FernaandoJr';
			const repoNames = ['astrovista', 'qrafthive',"nexcpu", 'noxium', 'flit', 'reactjs-portfolio'];
			
			const repoPromises = repoNames.map(repoName =>
				axios.get(`https://api.github.com/repos/${username}/${repoName}`, {
					headers: {
						'Authorization': `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`, // Use your GitHub token here
						'Accept': 'application/vnd.github.v3+json'
					}
				})
				.then(response => {
					// Log rate limit info for debugging
					console.log('Rate Limit Info:', {
						limit: response.headers['x-ratelimit-limit'],
						remaining: response.headers['x-ratelimit-remaining'],
						reset: new Date(response.headers['x-ratelimit-reset'] * 1000)
					});
					return response;
				})
			);
			
			const responses = await Promise.all(repoPromises);
			const repos = responses.map(response => response.data);
			
			// Cache the data
			localStorage.setItem(CACHE_KEY, JSON.stringify(repos));
			localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());
			
			setRepositories(repos);
		} catch (error) {
			console.error('Error fetching repositories:', error);
			
			// If API fails, try to use cached data even if expired
			const cachedData = localStorage.getItem(CACHE_KEY);
			if (cachedData) {
				console.log('API failed, using expired cached data');
				setRepositories(JSON.parse(cachedData));
			}
		} finally {
			setLoading(false);
		}
	};

	fetchRepositories();
}, []);
	return (
		<div className="container mx-auto py-18 sx:px-3 sx:px-3 sm:px-6 lg:px-8">
			{loading ? (
				<div className="flex justify-center flex-col gap-2 items-center h-screen">
					<Spinner />
					<div className="text-lg">Loading projects...</div>
				</div>
			) : (
				<div className="flex flex-wrap justify-center gap-x-3 gap-y-3">
					{repositories.map(repo => (
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
			)}
		</div>
	)
}