import { SITE_URL } from "@/constants/profile";

/** Content covers may already be remote (picsum, a CDN) or site-relative. */
export function absoluteUrl(path: string): string {
	return path.startsWith("http://") || path.startsWith("https://") ? path : `${SITE_URL}${path}`;
}
