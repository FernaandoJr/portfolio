import { ImageResponse } from "next/og";

import { Blog } from "@/components/og/blog";
import { getAllPosts, getPost, variantFor } from "@/lib/blog/source";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";
import { monthByNumber } from "@/lib/months";

export const alt = "Fernando Jr — blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return posts.map((post) => ({ slug: post.slug }));
}

function formatDate(date: string): string {
	const [year, month, day] = date.split("-");
	const entry = monthByNumber(Number(month));
	return entry && year && day ? `${day} ${entry.abbreviation} ${year}` : date;
}

function Fallback() {
	return (
		<div
			style={{
				alignItems: "center",
				backgroundColor: "#141414",
				color: "#e6e2dc",
				display: "flex",
				fontSize: 64,
				height: "100%",
				justifyContent: "center",
				width: "100%",
			}}
		>
			fernaandojr.dev
		</div>
	);
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const post = await getPost(slug);
	if (!post) return new ImageResponse(<Fallback />, size);

	const variant = variantFor(post, DEFAULT_LOCALE);
	const { title, description, date } = variant.frontmatter;

	return new ImageResponse(
		<Blog
			title={title}
			excerpt={description}
			author="Fernando Junior"
			meta={`${formatDate(date)} · ${variant.readingMinutes} min read`}
		/>,
		size
	);
}
