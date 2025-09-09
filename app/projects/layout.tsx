import { generateMetadata as generateMetadataUtil } from "@/lib/metadata"
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
	// Por padrão, retorna metadados em inglês
	return generateMetadataUtil({ page: "projects", locale: "en" })
}

export default function ProjectsLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
