import { ImageResponse } from "next/og";

import { Blog } from "@/components/og/blog";
import { getAllPosts, getPost, variantFor } from "@/lib/blog/source";
import { isLocaleSegment, LOCALE_SEGMENTS, toLocale, type Locale } from "@/lib/i18n/routing";

export const alt = "Fernando Jr — blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
	const posts = await getAllPosts();

	return LOCALE_SEGMENTS.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

const MONTHS: Record<Locale, string[]> = {
	ptBR: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
	enUS: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const READ_LABEL: Record<Locale, string> = { ptBR: "min de leitura", enUS: "min read" };

function formatDate(date: string, locale: Locale): string {
	const [year, month, day] = date.split("-");
	const label = MONTHS[locale][Number(month) - 1];
	return label && year && day ? `${day} ${label} ${year}` : date;
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

export default async function Image({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) return new ImageResponse(<Fallback />, size);

	const post = await getPost(slug);
	if (!post) return new ImageResponse(<Fallback />, size);

	const locale = toLocale(segment);
	const variant = variantFor(post, locale);
	const { title, description, date } = variant.frontmatter;

	return new ImageResponse(
		(
			<Blog
				title={title}
				excerpt={description}
				author="Fernando Junior"
				meta={`${formatDate(date, locale)} · ${variant.readingMinutes} ${READ_LABEL[locale]}`}
			/>
		),
		size
	);
}
