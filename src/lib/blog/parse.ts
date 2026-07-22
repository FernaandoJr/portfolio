import { makeParser } from "@/lib/content/parse";

import { frontmatterSchema } from "./types";

export { FILE_PATTERN, fileNameFor, serializeVariant } from "@/lib/content/parse";

export const parseVariant = makeParser(frontmatterSchema, "blog");
