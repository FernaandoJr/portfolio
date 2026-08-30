import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog | Fernando Jr",
	description:
		"Architecture decisions, expensive mistakes and what I would do differently. Written while building.",
	alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return children;
}
