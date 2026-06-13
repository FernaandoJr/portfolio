import Footer from "@/components/footer";
import { Header } from "@/components/header";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { BGPattern } from "@/components/ui/bg-pattern";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, JetBrains_Mono, Merriweather } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["400", "500", "600", "700"],
});
const merriweather = Merriweather({
	subsets: ["latin"],
	weight: ["300", "400", "700", "900"],
	variable: "--font-serif",
});
const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	title: "Fernando Jr — Portfolio",
	description: "Portfolio de desenvolvimento web",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const cookieStore = await cookies();
	const locale = cookieStore.get("NEXT_LOCALE")?.value ?? "ptBR";

	return (
		<html
			lang="pt-BR"
			className={`${geist.variable} ${merriweather.variable} ${jetbrainsMono.variable} antialiased`}
			suppressHydrationWarning
		>
			<body suppressHydrationWarning>
				<I18nProvider locale={locale}>
					<QueryProvider>
						<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
							<TooltipProvider>
								<BGPattern
									variant="grid"
									mask="fade-edges"
									fill="color-mix(in oklch, var(--border) 40%, transparent)"
									size={96}
									className="fixed"
								/>
								<Header />
								<div className="min-h-screen md:pt-36 pt-30 mb-0 pb-12 w-full max-w-3xl mx-auto px-6 lg:px-0">
									{children}
								</div>
								<Footer />
								<div className="pointer-events-none fixed inset-x-0 bottom-0 z-50" aria-hidden>
									<div className="h-24 bg-linear-to-b from-transparent to-background [mask-image:linear-gradient(to_top,var(--background)_25%,transparent)] backdrop-blur-[1px]" />
								</div>
							</TooltipProvider>
						</ThemeProvider>
					</QueryProvider>
				</I18nProvider>
			</body>
		</html>
	);
}
