import { toMarkdown } from "@/lib/content/to-markdown";
import { isLocaleSegment, LOCALE_SEGMENTS, toLocale } from "@/lib/i18n/routing";
import { getAllProjects, getProject, variantFor } from "@/lib/projects/source";

export async function generateStaticParams() {
	const projects = await getAllProjects();

	return LOCALE_SEGMENTS.flatMap((locale) =>
		projects.map((project) => ({ locale, slug: project.slug }))
	);
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ locale: string; slug: string }> }
) {
	const { locale: segment, slug } = await params;
	if (!isLocaleSegment(segment)) return new Response("Not found", { status: 404 });

	const project = await getProject(slug);
	if (!project) return new Response("Not found", { status: 404 });

	const variant = variantFor(project, toLocale(segment));

	return new Response(toMarkdown(variant, `/${segment}/projects/${slug}`), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
