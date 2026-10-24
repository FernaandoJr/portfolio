/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	serverExternalPackages: ["mongoose"],
	redirects: async () => [
		// Projeto removido (commit 960c670) -> manda pra /projects
		{
			source: "/projects/orbit-dashboard",
			destination: "/projects",
			permanent: true,
		},
	],
};

export default nextConfig;
