import { getServers, setServers } from "node:dns";

function isLoopback(server: string): boolean {
	const host = server.startsWith("[")
		? server.slice(1, server.indexOf("]"))
		: server.replace(/:\d+$/, "");
	return host === "127.0.0.1" || host === "::1";
}

export function preferPublicDnsIfLoopback() {
	const servers = getServers();
	const loopback = servers.length === 0 || servers.every(isLoopback);
	if (process.env.NODE_ENV === "production" && !loopback) return;
	setServers(["1.1.1.1", "8.8.8.8"]);
}
