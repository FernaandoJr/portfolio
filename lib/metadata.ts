import enMetadata from "@/public/locales/en/metadata.json"
import ptBRMetadata from "@/public/locales/pt-BR/metadata.json"
import type { Metadata } from "next"

type PageType = "home" | "about" | "projects" | "articles"

interface MetadataConfig {
	page: PageType
	locale?: string
}

export function generateMetadata({
	page,
	locale = "en",
}: MetadataConfig): Metadata {
	const metadata = locale === "pt" ? ptBRMetadata : enMetadata
	const pageData = metadata[page]
	const localeCode = locale === "pt" ? "pt_BR" : "en_US"

	return {
		title: pageData.title,
		description: pageData.description,
		keywords: pageData.keywords,
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
			title: pageData.title,
			description: pageData.description,
			url: `https://fernaandojr.dev${page === "home" ? "" : `/${page}`}`,
			siteName: "Fernando Jr - Portfolio",
			type: page === "about" ? "profile" : "website",
			locale: localeCode,
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
			title: pageData.title,
			description: pageData.description,
			images: ["https://fernaandojr.dev/og_image.png"],
			creator: "@fernaandojr",
		},
		alternates: {
			canonical: `https://fernaandojr.dev${
				page === "home" ? "" : `/${page}`
			}`,
		},
		other: {
			"article:author": "Fernando Jr",
			"article:section":
				page === "home"
					? "Portfolio"
					: page.charAt(0).toUpperCase() + page.slice(1),
			"article:tag": pageData.keywords.join(", "),
		},
	}
}

// Função para detectar idioma baseado no header Accept-Language
export function getLocaleFromHeaders(headers: Headers): string {
	const acceptLanguage = headers.get("accept-language") || ""

	// Verifica se o português está presente e tem prioridade
	if (acceptLanguage.includes("pt") && !acceptLanguage.includes("en")) {
		return "pt"
	}

	// Verifica se o inglês está presente
	if (acceptLanguage.includes("en")) {
		return "en"
	}

	// Padrão é inglês
	return "en"
}
