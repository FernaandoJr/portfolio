import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_SEGMENT, isLocaleSegment, toSegment, type LocaleSegment } from "@/lib/i18n/routing";

const COOKIE = "NEXT_LOCALE";

/** Picks the best segment from Accept-Language, e.g. "en-US,en;q=0.9" -> "en". */
function fromAcceptLanguage(header: string | null): LocaleSegment | null {
	if (!header) return null;

	const ranked = header
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().split(";");
			const q = params.find((p) => p.trim().startsWith("q="));
			return { tag: (tag ?? "").trim().toLowerCase(), q: q ? Number(q.split("=")[1]) : 1 };
		})
		.filter((entry) => entry.tag.length > 0)
		.sort((a, b) => b.q - a.q);

	for (const { tag } of ranked) {
		const base = tag.split("-")[0];
		if (base && isLocaleSegment(base)) return base;
	}

	return null;
}

function preferredSegment(req: NextRequest): LocaleSegment {
	const cookie = req.cookies.get(COOKIE)?.value;

	if (cookie) {
		if (isLocaleSegment(cookie)) return cookie;
		if (cookie === "ptBR" || cookie === "enUS") return toSegment(cookie);
	}

	return fromAcceptLanguage(req.headers.get("accept-language")) ?? DEFAULT_SEGMENT;
}

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const base = url.pathname.replace(/\/$/, "");
	url.pathname = `${base}/${preferredSegment(req)}`;

	return NextResponse.redirect(url);
}

// Only the bare entry points need resolving; every other URL under them already
// carries its locale, and the rest of the site stays cookie-driven.
export const config = {
	matcher: ["/blog", "/projects"],
};
