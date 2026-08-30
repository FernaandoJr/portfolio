import { getServers, setServers } from "node:dns";

function dnsHost(server: string): string {
	if (server.startsWith("[")) {
		return server.slice(1, server.indexOf("]"));
	}
	return server.replace(/:\d+$/, "");
}

export function usePublicDnsIfLoopback() {
	const servers = getServers();
	if (servers.length === 0) return;
	if (
		!servers.every((server) => {
			const host = dnsHost(server);
			return host === "127.0.0.1" || host === "::1";
		})
	) {
		return;
	}
	setServers(["1.1.1.1", "8.8.8.8"]);
}
