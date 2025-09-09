import Footer from "@/components/ui/footer"
import { Header } from "@/components/ui/header"
import { I18nProvider } from "@/components/ui/i18n-provider"
import { generateMetadata as generateMetadataUtil } from "@/lib/metadata"
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

export async function generateMetadata(): Promise<Metadata> {
	// Por padrão, retorna metadados em inglês
	// Em produção, você pode detectar o idioma baseado no header Accept-Language
	return generateMetadataUtil({ page: "home", locale: "en" })
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
