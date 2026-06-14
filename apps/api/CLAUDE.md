# apps/api — Hono + MongoDB Context

> Read root `CLAUDE.md` first. This file adds API-specific context.

## Stack

- **Runtime:** Node.js (Vercel Serverless)
- **Framework:** Hono v4
- **Database:** MongoDB Atlas via Mongoose — singleton connection in `src/lib/mongoose.ts`
- **TypeScript:** strict, ESM (`"type": "module"`)

## Critical: Environment Variables

All env vars come from `process.env`, centralised in `src/lib/env.ts`:

```ts
import { env } from "./lib/env.js";
const token = env.GITHUB_TOKEN;
```

Never access `process.env` directly outside of `src/lib/env.ts`.

### Variables

| Variable         | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `MONGODB_URI`    | MongoDB Atlas connection string                                 |
| `GITHUB_TOKEN`   | GitHub GraphQL API authentication                               |
| `ALLOWED_ORIGIN` | CORS allowed origins (comma-separated, supports `*.domain.com`) |
| `CRON_SECRET`    | Bearer token for POST `/api/github/sync`                        |

For local dev, copy `.env` and fill in values.

## API Routes

Base path: `/api`

| Method | Route                       | Description                                  |
| ------ | --------------------------- | -------------------------------------------- |
| GET    | `/api/health`               | Health check                                 |
| GET    | `/api/github/contributions` | Returns contribution activity array          |
| POST   | `/api/github/sync`          | Triggers GitHub sync (requires Bearer token) |

### Contributions Route Logic

1. Connect to MongoDB (`connectDB()` is idempotent — safe to call multiple times)
2. Query `Contribution` collection → return if records exist
3. If empty, call `syncContributions()` which fetches from GitHub GraphQL + upserts into MongoDB

## Database Schema (Mongoose)

- `Contribution` (`date: String` unique, `count: Number`, `level: Number 0-4`)
- `SyncLog` (`_id: "singleton"`, `synced_at: String ISO 8601`)

## Cron Job

Runs daily at **03:00 UTC** via Vercel Cron (defined in `vercel.json`). Calls `POST /api/github/sync` with the `CRON_SECRET` bearer token.

## Deployment

- Entry point for Vercel: `api/index.ts` (uses `hono/vercel` handle with Node.js runtime)
- `vercel.json` configures route rewrites and cron schedule
- Deploy: push to main branch → Vercel deploys automatically

## Dev Commands

```bash
pnpm dev   # tsx --env-file=.env watch src/server.ts → localhost:8787
pnpm build # tsc --noEmit (type-check only)
```

## Hono Patterns

```ts
import { Hono } from "hono";

const app = new Hono();

app.get("/route", async (c) => {
	return c.json(data);
});
```

Always use `.js` extensions in imports (ESM requirement).
