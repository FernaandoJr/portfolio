import { ImageResponse } from "next/og";

import { Blog } from "@/components/og/blog";
import { getAllPosts, getPost } from "@/lib/blog/source";

export const alt = "Post do blog de Fernando Jr";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

const MONTHS = [
	"jan",
	"fev",
	"mar",
	"abr",
	"mai",
	"jun",
	"jul",
	"ago",
	"set",
	"out",
	"nov",
	"dez",
];

function formatDate(date: string): string {
	const [year, month, day] = date.split("-");
	const label = MONTHS[Number(month) - 1];
	return label && year && day ? `${day} ${label} ${year}` : date;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getPost(slug);
	const variant = post?.variants[post.sourceLocale];

	if (!variant) {
		return new ImageResponse(
			(
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
			),
			size
		);
	}

	const { title, description, tags, date } = variant.frontmatter;

	return new ImageResponse(
		(
			<Blog
				category={tags[0] ?? "Blog"}
				title={title}
				excerpt={description}
				author="Fernando Junior"
				meta={`${formatDate(date)} · ${variant.readingMinutes} min`}
			/>
		),
		size
	);
}
