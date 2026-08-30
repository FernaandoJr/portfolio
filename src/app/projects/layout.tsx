import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Projects",
	description: "Everything I have built, with the context behind each decision.",
	alternates: { canonical: "/projects" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
	return children;
}
