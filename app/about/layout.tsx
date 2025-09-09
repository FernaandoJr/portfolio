import { generateMetadata as generateMetadataUtil } from "@/lib/metadata"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
	// Por padrão, retorna metadados em inglês
	return generateMetadataUtil({ page: "about", locale: "en" })
}

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
