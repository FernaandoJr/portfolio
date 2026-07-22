import process from "node:process";

import { planJobs } from "./posts-io";

async function run() {
	const jobs = await planJobs();

	if (jobs.length === 0) {
		process.stdout.write("✓ every post is translated and up to date\n");
		return;
	}

	process.stdout.write(`${jobs.length} file(s) need translation:\n`);
	for (const job of jobs) {
		process.stdout.write(`  - ${job.slug} → ${job.target} (${job.reason})\n`);
	}
	process.stdout.write("\nrun: pnpm blog:translate\n");
	process.exitCode = 1;
}

run().catch((error: unknown) => {
	process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
	process.exitCode = 1;
});
