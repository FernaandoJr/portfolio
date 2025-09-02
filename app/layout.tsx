import type { Metadata } from "next"
import { Outfit, Merriweather } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Header } from "@/components/ui/header"
import Footer from "@/components/ui/footer"
import { I18nProvider } from "@/components/ui/i18n-provider"

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
	title: "Fernando Jr - Portfolio",
	description:
		"Site de apresentação de portfolio onde mostro um pouco da minha história, projetos pessoais e minha carreira profissional.",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "Fernando Jr",
		description:
			"Site de apresentação de portfolio onde mostro um pouco da minha história, projetos pessoais e minha carreira profissional.",
		url: "https://fernaandojr.dev",
		siteName: "Fernando Jr",
		type: "website",
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
