import type { Element, Root } from "hast";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

function isFigure(node: Element): boolean {
	return node.tagName === "figure" && "data-rehype-pretty-code-figure" in (node.properties ?? {});
}

function isTitle(node: Element): boolean {
	return "data-rehype-pretty-code-title" in (node.properties ?? {});
}

export function rehypeCodeMeta() {
	return (tree: Root) => {
		visit(tree, "element", (node: Element) => {
			if (!isFigure(node)) return;

			node.properties ??= {};

			const titleIndex = node.children.findIndex(
				(child) => child.type === "element" && isTitle(child)
			);

			if (titleIndex !== -1) {
				const title = node.children[titleIndex];
				if (title?.type === "element") {
					node.properties["data-title"] = toString(title);
					node.children.splice(titleIndex, 1);
				}
			}

			const pre = node.children.find(
				(child): child is Element => child.type === "element" && child.tagName === "pre"
			);

			const language = pre?.properties?.["data-language"];
			if (typeof language === "string") {
				node.properties["data-language"] = language;
			}
		});
	};
}
