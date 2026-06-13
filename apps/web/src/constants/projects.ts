export type Project = {
	id: string;
	title: string;
	descKey: string;
	image: string;
	tags: string[];
	github?: string;
	demo?: string;
	year: number;
	status: "completed" | "wip";
};

export const projects: Project[] = [
	{
		id: "astrovista",
		title: "AstroVista",
		descKey: "projectAstroVistaDesc",
		image: "/projects/astrovista.webp",
		tags: ["Next.js", "Hono", "MongoDB"],
		github: "https://github.com/FernaandoJr/AstroVista",
		demo: "https://astrovista.fernaandojr.dev",
		year: 2024,
		status: "completed",
	},
	{
		id: "orbit-dashboard",
		title: "Orbit Dashboard",
		descKey: "projectOrbitDashboardDesc",
		image: "https://picsum.photos/seed/orbit-dashboard/640/360",
		tags: ["Next.js", "TypeScript", "TanStack"],
		github: "https://github.com",
		demo: "https://example.com",
		year: 2024,
		status: "completed",
	},
	{
		id: "forge-api",
		title: "Forge API",
		descKey: "projectForgeApiDesc",
		image: "https://picsum.photos/seed/forge-api/640/360",
		tags: ["Hono", "Bun", "TypeScript"],
		github: "https://github.com",
		year: 2024,
		status: "wip",
	},
	{
		id: "pixel-canvas",
		title: "Pixel Canvas",
		descKey: "projectPixelCanvasDesc",
		image: "https://picsum.photos/seed/pixel-canvas/640/360",
		tags: ["React", "TypeScript", "Vite"],
		github: "https://github.com",
		demo: "https://example.com",
		year: 2023,
		status: "completed",
	},
	{
		id: "stellar-notes",
		title: "Stellar Notes",
		descKey: "projectStellarNotesDesc",
		image: "https://picsum.photos/seed/stellar-notes/640/360",
		tags: ["Next.js", "TypeScript", "PostgreSQL"],
		github: "https://github.com",
		demo: "https://example.com",
		year: 2023,
		status: "completed",
	},
	{
		id: "void-cli",
		title: "Void CLI",
		descKey: "projectVoidCliDesc",
		image: "https://picsum.photos/seed/void-cli/640/360",
		tags: ["Node.js", "TypeScript", "Git"],
		github: "https://github.com",
		year: 2023,
		status: "wip",
	},
];
