import { SITE_URL } from "@/constants/profile";

export function absoluteUrl(path: string): string {
	return path.startsWith("http://") || path.startsWith("https://") ? path : `${SITE_URL}${path}`;
}
