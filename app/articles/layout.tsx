import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Artigos - Fernando Jr | Blog de Desenvolvimento Web",
	description:
		"Leia artigos sobre desenvolvimento web, React, Next.js, TypeScript, JavaScript e outras tecnologias modernas. Dicas, tutoriais e insights de Fernando Jr, desenvolvedor full stack.",
	keywords: [
		"artigos desenvolvimento web",
		"blog programação",
		"tutoriais React",
		"tutoriais Next.js",
		"tutoriais TypeScript",
		"tutoriais JavaScript",
		"dicas programação",
		"desenvolvimento web",
		"programação",
		"tecnologia",
		"frontend",
		"backend",
		"full stack",
		"Fernando Jr",
		"desenvolvedor",
		"programador",
		"insights",
		"tutoriais",
		"dicas",
		"web development",
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
		title: "Artigos - Fernando Jr | Blog de Desenvolvimento",
		description:
			"Leia artigos sobre desenvolvimento web, React, Next.js, TypeScript, JavaScript e outras tecnologias modernas. Dicas e tutoriais de Fernando Jr.",
		url: "https://fernaandojr.dev/articles",
		siteName: "Fernando Jr - Portfolio",
		type: "website",
		locale: "pt_BR",
		images: [
			{
				url: "https://fernaandojr.dev/og_image.jpg",
				width: 1200,
				height: 630,
				alt: "Fernando Jr - Desenvolvedor Full Stack",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Artigos - Fernando Jr | Blog de Desenvolvimento",
		description:
			"Leia artigos sobre desenvolvimento web, React, Next.js, TypeScript, JavaScript e outras tecnologias modernas.",
		images: ["https://fernaandojr.dev/og_image.jpg"],
		creator: "@fernaandojr",
	},
	alternates: {
		canonical: "https://fernaandojr.dev/articles",
	},
	other: {
		"article:author": "Fernando Jr",
		"article:section": "Artigos",
		"article:tag":
			"artigos, blog, desenvolvimento web, React, Next.js, TypeScript, JavaScript, programação, tutoriais",
	},
}

export default function ArticlesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
