import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { GoogleGenAI } from "@google/genai";

import { maskContent, unmaskContent } from "../src/lib/blog/mask";
import { validateTranslation } from "../src/lib/blog/validate";
import { fileNameFor, serializeVariant } from "../src/lib/content/parse";
import type { BaseFrontmatter, Locale } from "../src/lib/content/types";
import { contentDir, hashOf, parseArgs, planJobs, type Job } from "./content-io";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";

const LANGUAGE_NAME: Record<Locale, string> = {
	ptBR: "Brazilian Portuguese",
	enUS: "American English",
};

const SYSTEM_INSTRUCTION = `You are a professional technical translator for a software engineer's personal site.

Translate the given text faithfully, preserving the author's voice: direct, opinionated, conversational but precise. Do not soften strong claims, do not add hedging, do not add or remove content.

Absolute rules:
- Tokens shaped like ⟦C0⟧, ⟦C1⟧, ⟦C2⟧ are opaque placeholders for code, JSX and URLs. Reproduce every one of them EXACTLY as-is, once each, in the position that preserves meaning. Never translate, renumber, reformat or invent them.
- Preserve the markdown structure exactly: same number of headings, same heading levels, same list structure, same table shape, same emphasis markers.
- Keep well-known technical terms untranslated (e.g. commit, deploy, cache, build, merge, timeout, upsert, offline-first).
- Translate table cell contents, list items, image alt text and markdown link labels.
- Do not add a title heading if the source has none, and never wrap the output in a code fence.`;

const responseSchema = {
	type: "object",
	properties: {
		title: { type: "string" },
		description: { type: "string" },
		tags: { type: "array", items: { type: "string" } },
		body: { type: "string" },
	},
	required: ["title", "description", "tags", "body"],
} as const;

type TranslationResult = {
	title: string;
	description: string;
	tags: string[];
	body: string;
};

function log(message: string) {
	process.stdout.write(`${message}\n`);
}

async function translate(ai: GoogleGenAI, job: Job): Promise<TranslationResult> {
	const { masked, tokens } = maskContent(job.source.body);

	const prompt = [
		`Translate this text from ${LANGUAGE_NAME[job.source.locale]} to ${LANGUAGE_NAME[job.target]}.`,
		"",
		`TITLE: ${job.source.frontmatter.title}`,
		`DESCRIPTION: ${job.source.frontmatter.description}`,
		`TAGS: ${JSON.stringify(job.source.frontmatter.tags)}`,
		"",
		"BODY:",
		masked,
	].join("\n");

	const response = await ai.models.generateContent({
		model: MODEL,
		contents: prompt,
		config: {
			systemInstruction: SYSTEM_INSTRUCTION,
			responseMimeType: "application/json",
			responseSchema,
			temperature: 0.3,
		},
	});

	const text = response.text;
	if (!text) throw new Error("Gemini returned an empty response");

	const parsed = JSON.parse(text) as TranslationResult;

	const issues = validateTranslation({
		maskedSource: masked,
		tokenCount: tokens.length,
		translatedBody: parsed.body,
	});

	if (issues.length > 0) {
		throw new Error(
			`translation failed validation:\n${issues.map((i) => `    - ${i}`).join("\n")}`
		);
	}

	return { ...parsed, body: unmaskContent(parsed.body, tokens) };
}

async function listModels(ai: GoogleGenAI) {
	log("models available to this API key that support generateContent:\n");

	for await (const model of await ai.models.list()) {
		if (!model.supportedActions?.includes("generateContent")) continue;
		log(`  ${model.name?.replace(/^models\//, "")}`);
	}

	log("\nset one in .env.local as GEMINI_MODEL=<id>");
}

async function run() {
	const args = process.argv.slice(2);
	const { collection, only, force } = parseArgs(args);

	const apiKey = process.env.GEMINI_API_KEY;

	if (args.includes("--models")) {
		if (!apiKey) {
			log("✗ GEMINI_API_KEY is not set. Add it to .env.local and retry.");
			process.exitCode = 1;
			return;
		}
		await listModels(new GoogleGenAI({ apiKey }));
		return;
	}

	const jobs = await planJobs(collection, { force, only });

	if (jobs.length === 0) {
		log(`✓ every ${collection} entry is translated and up to date`);
		return;
	}

	if (!apiKey) {
		log("✗ GEMINI_API_KEY is not set. Add it to .env.local and retry.");
		process.exitCode = 1;
		return;
	}

	const ai = new GoogleGenAI({ apiKey });
	const dir = contentDir(collection);
	log(`translating ${jobs.length} ${collection} file(s) with ${MODEL}\n`);

	let failed = 0;

	for (const job of jobs) {
		const label = `${job.slug} → ${job.target} (${job.reason})`;

		try {
			const result = await translate(ai, job);

			const frontmatter: BaseFrontmatter = {
				...job.source.frontmatter,
				title: result.title,
				description: result.description,
				tags: result.tags,
				translatedFrom: job.source.locale,
				sourceHash: hashOf(job.source),
				translatedBy: MODEL,
				translatedAt: new Date().toISOString(),
			};

			const file = fileNameFor(job.slug, job.target);
			await writeFile(path.join(dir, file), serializeVariant(frontmatter, result.body), "utf8");

			log(`  ✓ ${label}\n    wrote content/${collection}/${file}`);
		} catch (error) {
			failed += 1;
			const message = error instanceof Error ? error.message : String(error);
			log(`  ✗ ${label}\n    ${message}`);

			if (/not[_ ]found|not supported|no longer available|invalid.*model/i.test(message)) {
				log(`\n    "${MODEL}" was rejected. Run: pnpm content:translate --models`);
				break;
			}
		}
	}

	if (failed > 0) {
		log(`\n${failed} file(s) failed — nothing was written for those`);
		process.exitCode = 1;
	}
}

run().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
	process.exitCode = 1;
});
