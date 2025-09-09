// Exemplo de como implementar detecção de idioma baseada no header Accept-Language
// Este arquivo é apenas para referência - não é usado no código atual

import {
	generateMetadata as generateMetadataUtil,
	getLocaleFromHeaders,
} from "@/lib/metadata"
import { headers } from "next/headers"

// Exemplo de como usar em um layout com detecção de idioma
export async function generateMetadataWithLocale(
	page: "home" | "about" | "projects" | "articles"
) {
	const headersList = await headers()
	const locale = getLocaleFromHeaders(headersList)

	return generateMetadataUtil({ page, locale })
}

// Exemplo de uso em um layout:
/*
export async function generateMetadata(): Promise<Metadata> {
	return generateMetadataWithLocale("home")
}
*/
