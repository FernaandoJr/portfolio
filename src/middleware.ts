import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_SEGMENT } from "@/lib/i18n/routing";

export function middleware(req: NextRequest) {
	const url = req.nextUrl.clone();
	const base = url.pathname.replace(/\/$/, "");
	url.pathname = `/${DEFAULT_SEGMENT}${base}`;

	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/", "/about", "/blog", "/projects"],
};
