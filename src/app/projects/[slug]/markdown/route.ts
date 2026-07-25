import { toMarkdown } from "@/lib/content/to-markdown";
import { DEFAULT_LOCALE } from "@/lib/i18n/routing";
import { getAllProjects, getProject, variantFor } from "@/lib/projects/source";

export async function generateStaticParams() {
	const projects = await getAllProjects();

	return projects.map((project) => ({ slug: project.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;

	const project = await getProject(slug);
	if (!project) return new Response("Not found", { status: 404 });

	const variant = variantFor(project, DEFAULT_LOCALE);

	return new Response(toMarkdown(variant, `/projects/${slug}`), {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
