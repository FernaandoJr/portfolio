export type Modality = "remote" | "hybrid" | "on-site"
export type JobType = "full-time" | "part-time" | "freelance" | "internship"

export type Experience = {
	id: string
	role: string
	company: string
	modality: Modality
	type: JobType
	startDate: string
	endDate: string | null
	current: boolean
	descKey: string
	stack: string[]
}

export const experiences: Experience[] = [
	{
		id: "novatech",
		role: "Frontend Developer",
		company: "NovaTech Solutions",
		modality: "remote",
		type: "full-time",
		startDate: "Mar 2024",
		endDate: null,
		current: true,
		descKey: "expNovatechDesc",
		stack: ["Next.js", "TypeScript", "Tailwind", "React", "TanStack", "shadcn/ui"],
	},
	{
		id: "pixelstudio",
		role: "Frontend Developer",
		company: "Pixel Studio",
		modality: "hybrid",
		type: "full-time",
		startDate: "Aug 2022",
		endDate: "Feb 2024",
		current: false,
		descKey: "expPixelStudioDesc",
		stack: ["React", "JavaScript", "MUI", "Vite", "Redux"],
	},
	{
		id: "devshop",
		role: "Frontend Intern",
		company: "DevShop Agency",
		modality: "on-site",
		type: "part-time",
		startDate: "Jan 2022",
		endDate: "Jul 2022",
		current: false,
		descKey: "expDevShopDesc",
		stack: ["React", "JavaScript", "Tailwind"],
	},
]
