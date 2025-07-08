"use client"

import ProjectCard from "@/components/ui/project-card";
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

useEffect(() => {
	const fetchRepositories = async () => {
		try {
			const username = 'FernaandoJr';
			const repoNames = ['astrovista', 'qrafthive',"nexcpu", 'noxium', 'flit', 'reactjs-portfolio'];
			
			const repoPromises = repoNames.map(repoName =>
				axios.get(`https://api.github.com/repos/${username}/${repoName}`)
			);
			
			const responses = await Promise.all(repoPromises);
			const repos = responses.map(response => response.data);
			setRepositories(repos);
		} catch (error) {
			console.error('Error fetching repositories:', error);
		}
	};

	fetchRepositories();
}, []);
	return (
		<div className="container mx-auto py-18 sx:px-3 sx:px-3 sm:px-6 lg:px-8">

			<div className="flex flex-wrap justify-center gap-x-3 gap-y-3">

			{repositories.map(repo => (
				<ProjectCard key={repo.id} title={repo.name} description={repo.description} html_url={repo.html_url} stars={repo.stargazers_count} forks={repo.forks_count} homepage={repo.homepage} topics={repo.topics} watchers={repo.watchers_count} language={repo.language} />
			))}
		</div>
			</div>
	)
}