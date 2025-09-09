import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Projetos Pessoais - Fernando Jr | Portfolio de Desenvolvedor",
	description:
		"Explore os projetos pessoais de Fernando Jr, desenvolvedor full stack. Projetos em React, Next.js, TypeScript, Node.js e outras tecnologias modernas. Código aberto disponível no GitHub.",
	keywords: [
		"projetos pessoais",
		"projetos React",
		"projetos Next.js",
		"projetos TypeScript",
		"projetos JavaScript",
		"projetos Node.js",
		"projetos web",
		"projetos full stack",
		"código aberto",
		"open source",
		"GitHub",
		"portfolio projetos",
		"desenvolvimento web",
		"aplicações web",
		"Fernando Jr",
		"desenvolvedor",
		"programador",
		"astrovista",
		"qrafthive",
		"noxium",
		"nexcpu",
		"flit",
	],
	authors: [{ name: "Fernando Jr" }],
	creator: "Fernando Jr",
	publisher: "Fernando Jr",
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		title: "Projetos Pessoais - Fernando Jr | Portfolio",
		description:
			"Explore os projetos pessoais de Fernando Jr, desenvolvedor full stack. Projetos em React, Next.js, TypeScript, Node.js e outras tecnologias modernas.",
		url: "https://fernaandojr.dev/projects",
		siteName: "Fernando Jr - Portfolio",
		type: "website",
		locale: "pt_BR",
		images: [
			{
				url: "https://fernaandojr.dev/og_image.png",
				width: 1200,
				height: 630,
				alt: "Fernando Jr - Desenvolvedor Full Stack",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Projetos Pessoais - Fernando Jr | Portfolio",
		description:
			"Explore os projetos pessoais de Fernando Jr, desenvolvedor full stack. Projetos em React, Next.js, TypeScript e outras tecnologias modernas.",
		images: ["https://fernaandojr.dev/og_image.png"],
		creator: "@fernaandojr",
	},
	alternates: {
		canonical: "https://fernaandojr.dev/projects",
	},
	other: {
		"article:author": "Fernando Jr",
		"article:section": "Projetos",
		"article:tag":
			"projetos, React, Next.js, TypeScript, JavaScript, Node.js, desenvolvimento web, código aberto",
	},
}

export default function ProjectsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
