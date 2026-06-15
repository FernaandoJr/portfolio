"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: Infinity,
						gcTime: 1000 * 60 * 60 * 24,
						refetchOnWindowFocus: false,
						refetchOnReconnect: false,
						retry: false,
					},
				},
			})
	);
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
