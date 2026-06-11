import { Hono } from "hono"

import { fetchFromGitHub } from "../lib/github.js"
import type { Bindings } from "../types/bindings.js"
import type { ContributionEntry } from "../types/github.js"

export const githubRoutes = new Hono<{ Bindings: Bindings }>()

githubRoutes.get("/contributions", async (c) => {
  const db = c.env.portfolio_cache

  const rows = await db
    .prepare("SELECT date, count, level FROM contributions ORDER BY date ASC")
    .all<ContributionEntry>()

  if (rows.results.length > 0) {
    return c.json(rows.results)
  }

  const data = await fetchFromGitHub(c.env.GITHUB_TOKEN)
  if (!data) {
    return c.json({ error: "Failed to reach GitHub API" }, 502)
  }

  const stmt = db.prepare(
    "INSERT OR REPLACE INTO contributions (date, count, level) VALUES (?, ?, ?)"
  )
  await db.batch(data.map((d) => stmt.bind(d.date, d.count, d.level)))

  await db
    .prepare("INSERT OR REPLACE INTO sync_log (id, synced_at) VALUES (1, ?)")
    .bind(new Date().toISOString())
    .run()

  return c.json(data)
})
