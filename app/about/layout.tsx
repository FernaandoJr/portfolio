import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "Sobre Fernando Jr - Desenvolvedor Full Stack | Portfolio",
	description:
		"Conheça a história de Fernando Jr, desenvolvedor full stack apaixonado por tecnologia. Formado em Análise e Desenvolvimento de Sistemas, com experiência em React, Next.js, TypeScript e desenvolvimento backend.",
	keywords: [
		"Fernando Jr",
		"desenvolvedor full stack",
		"desenvolvedor React",
		"desenvolvedor Next.js",
		"desenvolvedor TypeScript",
		"desenvolvedor JavaScript",
		"desenvolvedor web",
		"desenvolvedor backend",
		"programador",
		"desenvolvimento de software",
		"análise e desenvolvimento de sistemas",
		"Fatec",
		"AgroCRM",
		"GeneXus",
		"portfolio",
		"sobre mim",
		"carreira",
		"experiência profissional",
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
		title: "Sobre Fernando Jr - Desenvolvedor Full Stack",
		description:
			"Conheça a história de Fernando Jr, desenvolvedor full stack apaixonado por tecnologia. Formado em Análise e Desenvolvimento de Sistemas, com experiência em React, Next.js, TypeScript e desenvolvimento backend.",
		url: "https://fernaandojr.dev/about",
		siteName: "Fernando Jr - Portfolio",
		type: "profile",
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
		title: "Sobre Fernando Jr - Desenvolvedor Full Stack",
		description:
			"Conheça a história de Fernando Jr, desenvolvedor full stack apaixonado por tecnologia. Formado em Análise e Desenvolvimento de Sistemas.",
		images: ["https://fernaandojr.dev/og_image.png"],
		creator: "@fernaandojr",
	},
	alternates: {
		canonical: "https://fernaandojr.dev/about",
	},
	other: {
		"article:author": "Fernando Jr",
		"article:section": "Sobre",
		"article:tag":
			"desenvolvedor, programador, full stack, React, Next.js, TypeScript",
	},
}

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
