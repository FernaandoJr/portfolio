# apps/api — Cloudflare Worker Context

> Read root `CLAUDE.md` first. This file adds API-specific context.

## Stack

- **Runtime:** Cloudflare Workers (not Node.js)
- **Framework:** Hono v4
- **Database:** Cloudflare D1 (SQLite) — binding name: `portfolio_cache`
- **TypeScript:** strict, ESM (`"type": "module"`)

## Critical: Environment Variables

**Never use `process.env`** — this is a Cloudflare Worker. All env vars and bindings are on the Hono context:

```ts
// ✅ Correct
app.get("/route", (c) => {
  const token = c.env.GITHUB_TOKEN
  const db = c.env.portfolio_cache
})

// ❌ Wrong — will throw at runtime
const token = process.env.GITHUB_TOKEN
```

### Secrets (set in Cloudflare Dashboard only — never committed)

| Secret | Purpose |
|--------|---------|
| `GITHUB_TOKEN` | GitHub GraphQL API authentication |
| `ALLOWED_ORIGIN` | CORS allowed origin (set in `wrangler.toml` for non-secret envs) |

### Bindings (in `wrangler.toml`)

| Binding | Type | Purpose |
|---------|------|---------|
| `portfolio_cache` | D1 Database | Cache for GitHub contributions |

## API Routes

Base path: `/api`

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/github/contributions` | Returns contribution activity array |

### Contributions Route Logic

1. Query D1 for cached rows → return if found
2. If empty, fetch from GitHub GraphQL API
3. Insert fetched data into D1 (batch)
4. Update `sync_log` table
5. Return data

## Database Schema

See `migrations/0001_initial.sql`. Two tables:
- `contributions (date TEXT, count INTEGER, level INTEGER)` — daily contribution data
- `sync_log (id INTEGER, synced_at TEXT)` — tracks last sync timestamp

## Cron Job

Runs daily at **03:00 UTC** via Cloudflare Cron Triggers. Defined in `wrangler.toml`:
```toml
[triggers]
crons = ["0 3 * * *"]
```

The handler is in `src/cron.ts` → imported as `scheduled` export in `src/index.ts`.

## Dev Commands

```bash
pnpm dev      # wrangler dev → localhost:8787
pnpm deploy   # wrangler deploy (manual deploy to Cloudflare)
pnpm build    # tsc --noEmit (type-check only, no emit)
```

For local D1, wrangler creates a local SQLite file automatically on first `pnpm dev`.

## Hono Patterns

```ts
import { Hono } from "hono"
import type { Bindings } from "./types/bindings.js"

const app = new Hono<{ Bindings: Bindings }>()

app.get("/route", async (c) => {
  const db = c.env.portfolio_cache
  // ...
  return c.json(data)
})
```

Always use `.js` extensions in imports (ESM + Cloudflare Workers requirement).
