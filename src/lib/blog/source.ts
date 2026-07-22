import "server-only";

import { defineCollection } from "@/lib/content/collection";

import { frontmatterSchema, type Post, type Frontmatter } from "./types";

const posts = defineCollection<Frontmatter>({ name: "blog", schema: frontmatterSchema });

export const CONTENT_DIR = posts.dir;
export const getAllPosts = posts.getAll;
export const getPost = posts.get;
export const getAllSlugs = posts.getAllSlugs;
export const variantFor = posts.variantFor;

export type { Post };
