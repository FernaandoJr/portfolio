import Footer from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { I18nProvider } from "@/components/ui/i18n-provider"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Merriweather, Outfit } from "next/font/google"
import "./globals.css"

const outfitSans = Outfit({
	variable: "--font-outfit-sans",
	subsets: ["latin"],
})

const merriweather = Merriweather({
	variable: "--font-merriweather",
	subsets: ["latin"],
	weight: ["400"],
})

export const metadata: Metadata = {
	title: "Fernando Jr - Desenvolvedor Full Stack | Portfolio",
	description:
		"Desenvolvedor Full Stack apaixonado por tecnologia. Especialista em React, Next.js, TypeScript e Node.js. Explore meus projetos pessoais, artigos sobre desenvolvimento web e conheça minha trajetória profissional.",
	keywords: [
		"Fernando Jr",
		"desenvolvedor full stack",
		"desenvolvedor React",
		"desenvolvedor Next.js",
		"desenvolvedor TypeScript",
		"desenvolvedor JavaScript",
		"desenvolvedor Node.js",
		"desenvolvedor web",
		"programador",
		"desenvolvimento de software",
		"portfolio",
		"projetos pessoais",
		"artigos programação",
		"blog desenvolvimento",
		"código aberto",
		"open source",
		"GitHub",
		"tecnologia",
		"programação",
		"frontend",
		"backend",
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
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
	openGraph: {
		title: "Fernando Jr - Desenvolvedor Full Stack | Portfolio",
		description:
			"Desenvolvedor Full Stack apaixonado por tecnologia. Especialista em React, Next.js, TypeScript e Node.js. Explore meus projetos pessoais e artigos sobre desenvolvimento web.",
		url: "https://fernaandojr.dev",
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
		title: "Fernando Jr - Desenvolvedor Full Stack | Portfolio",
		description:
			"Desenvolvedor Full Stack apaixonado por tecnologia. Especialista em React, Next.js, TypeScript e Node.js.",
		images: ["https://fernaandojr.dev/og_image.jpg"],
		creator: "@fernaandojr",
	},
	alternates: {
		canonical: "https://fernaandojr.dev",
	},
	other: {
		"article:author": "Fernando Jr",
		"article:section": "Portfolio",
		"article:tag":
			"desenvolvedor, programador, full stack, React, Next.js, TypeScript, JavaScript, Node.js, portfolio, projetos",
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body
				className={`${outfitSans.variable} ${merriweather.variable} antialiased`}>
				<I18nProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange>
						<Header />
						{children}
						<Footer />
					</ThemeProvider>
				</I18nProvider>
			</body>
		</html>
	)
}
