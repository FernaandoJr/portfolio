import { makeParser } from "@/lib/content/parse";

import { projectFrontmatterSchema } from "./types";

export const parseVariant = makeParser(projectFrontmatterSchema, "projects");
