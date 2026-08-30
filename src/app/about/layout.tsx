import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Full Stack Developer passionate about building modern, functional interfaces with an eye for the details that make a real difference in the user experience.",
	alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return children;
}
