/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: true,
	},
	transpilePackages: ["@repo/i18n", "@repo/api-client"],
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "picsum.photos" },
			{ protocol: "https", hostname: "fastly.picsum.photos" },
		],
	},
};

export default nextConfig;
