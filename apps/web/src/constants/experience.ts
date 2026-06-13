export type Modality = "remote" | "hybrid" | "on-site"
export type JobType = "full-time" | "part-time" | "freelance" | "internship"

export type CompanyInfo = {
	name: string
	descKey: string
	url: string
	logo?: string
}

export type Experience = {
	id: string
	role: string
	roleKey: string
	company: string
	companyInfo?: CompanyInfo
	modality: Modality
	type: JobType
	startDate: string
	endDate: string | null
	current: boolean
	descKey: string
	bulletKeys: string[]
	stack: string[]
}

export const experiences: Experience[] = [
	{
		id: "dolphin-frontend",
		role: "Frontend Developer",
		roleKey: "roleFrontendDeveloper",
		company: "Dolphin Sistemas",
		companyInfo: {
			name: "Dolphin Sistemas",
			descKey: "companyDolphinDesc",
			url: "https://agrocrm.com.br",
			logo: "/icons/companies/dolphin-brand.png",
		},
		modality: "remote",
		type: "full-time",
		startDate: "May 2025",
		endDate: null,
		current: true,
		descKey: "expDolphinFrontDesc",
		bulletKeys: ["expDolphinFrontBullet1", "expDolphinFrontBullet2"],
		stack: ["TypeScript", "Node.js", "Bun", "React", "Expo", "Next.js", "Vite", "Vitest", "Tailwind", "shadcn/ui", "MUI", "Cursor", "Codex"],
	},
	{
		id: "dolphin-backend",
		role: "Backend Developer",
		roleKey: "roleBackendDeveloper",
		company: "Dolphin Sistemas",
		companyInfo: {
			name: "Dolphin Sistemas",
			descKey: "companyDolphinDesc",
			url: "https://agrocrm.com.br",
			logo: "/icons/companies/dolphin-brand.png",
		},
		modality: "hybrid",
		type: "full-time",
		startDate: "Sep 2024",
		endDate: "May 2025",
		current: false,
		descKey: "expDolphinBackDesc",
		bulletKeys: ["expDolphinBackBullet1", "expDolphinBackBullet2"],
		stack: ["GeneXus", "MySQL", "Postman"],
	},
]
