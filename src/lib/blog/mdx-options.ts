import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { createCssVariablesTheme } from "shiki";

import type { MDXRemoteOptions } from "next-mdx-remote-client/rsc";

import { rehypeCodeMeta } from "./rehype-code-meta";

const cssVariablesTheme = createCssVariablesTheme({
	name: "css-variables",
	variablePrefix: "--shiki-",
	variableDefaults: {
		foreground: "#3d3d3d",
	},
});

export const mdxOptions: MDXRemoteOptions = {
	mdxOptions: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [
			rehypeSlug,
			[
				rehypePrettyCode,
				{
					theme: cssVariablesTheme,
					keepBackground: false,
					bypassInlineCode: true,
					defaultLang: "plaintext",
				},
			],
			rehypeCodeMeta,
		],
	},
};
