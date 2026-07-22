import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import type { MDXRemoteOptions } from "next-mdx-remote-client/rsc";

import { rehypeCodeMeta } from "./rehype-code-meta";

export const mdxOptions: MDXRemoteOptions = {
	mdxOptions: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: { light: "github-light-high-contrast", dark: "github-dark-dimmed" },
					keepBackground: false,
					bypassInlineCode: true,
					defaultLang: "plaintext",
				},
			],
			rehypeCodeMeta,
		],
	},
};
