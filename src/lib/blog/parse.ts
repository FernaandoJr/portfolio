import { makeParser } from "@/lib/content/parse";

import { frontmatterSchema } from "./types";

export const parseVariant = makeParser(frontmatterSchema, "blog");
