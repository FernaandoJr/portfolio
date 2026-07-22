import process from "node:process";

import { parseArgs, planJobs } from "./content-io";

async function run() {
	const { collection, only } = parseArgs(process.argv.slice(2));
	const jobs = await planJobs(collection, { only });

	if (jobs.length === 0) {
		process.stdout.write(`✓ every ${collection} entry is translated and up to date\n`);
		return;
	}

	process.stdout.write(`${jobs.length} file(s) need translation:\n`);
	for (const job of jobs) {
		process.stdout.write(`  - ${job.slug} → ${job.target} (${job.reason})\n`);
	}
	process.stdout.write(`\nrun: pnpm content:translate ${collection}\n`);
	process.exitCode = 1;
}

run().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
	process.exitCode = 1;
});
