# Portfolio — Claude Context

## About the Owner

**Fernando Junior** (`FernaandoJr`) — Fullstack Developer based in São Paulo, Brazil.

- **Experience:** 2+ years, currently working full-time at Dolphin Sistemas (since May 2025) building AgroCRM — a production monorepo with MVVM architecture, React, Expo (offline-first mobile), and strong DX practices.
- **Stack fluency:** TypeScript, React, Next.js, Expo, Tailwind CSS, shadcn/ui, Hono, Node.js, Bun.
- **Work style:** Detail-obsessed. Prioritizes visual quality and polish over delivery speed, especially in this portfolio project.
- **This project's purpose:** Personal showcase and learning lab — not production-critical. Decisions favor craft and exploration over pragmatism.
- **Notable personal project:** [AstroVista](https://astrovista.fernaandojr.dev) — open source app archiving NASA's APOD images (Next.js + Hono + MongoDB).
- **AI tools used:** Claude Code (primary) + Cursor.

## Response Style

Mix direct and explanatory depending on context:

- Day-to-day changes: direct, minimal prose, go straight to code.
- New concepts or architectural decisions: explain the _why_, not just the _what_.
- Never explain basic TypeScript, React, or Tailwind concepts — assume full fluency.

## Repository Structure

```
portfolio/                     ← Single Next.js app (pnpm)
├── src/
│   ├── app/                   ← Next.js App Router (pages + API routes)
│   │   └── api/
│   │       └── github/
│   │           ├── contributions/route.ts   ← Reads from MongoDB
│   │           └── sync/route.ts            ← Cron-only writer (GET, auth required)
│   ├── components/
│   │   ├── ui/                ← shadcn/ui primitives + custom components
│   │   ├── header/
│   │   ├── infoSection/       ← GitHub heatmap section
│   │   ├── projectsSection/
│   │   ├── experienceSection/
│   │   ├── skillsSection/
│   │   ├── quoteSection/
│   │   ├── aboutSection/
│   │   └── footer/
│   ├── constants/             ← All static content data (no CMS)
│   ├── hooks/
│   └── lib/
│       ├── db/                ← Mongoose models + sync logic
│       ├── i18n/              ← i18next instance + locale files
│       ├── contribution-calendar.ts  ← Pure date helpers for the heatmap
│       ├── github.ts          ← GitHub GraphQL fetch
│       └── utils.ts
├── public/
├── vercel.json                ← Cron: GET /api/github/sync daily at 03:00 UTC
├── next.config.ts
└── vitest.config.ts
```

### Path alias

- `@/` → `./src/`

## Dev Commands

```bash
pnpm dev          # next dev → localhost:3000
pnpm build        # next build
pnpm lint         # ESLint (max 0 warnings)
pnpm check-types  # next typegen && tsc --noEmit
pnpm test         # vitest run
```

## Deploy

**Web:** Manual deploy to Vercel. Set env vars: `MONGODB_URI`, `GITHUB_TOKEN`, `CRON_SECRET`.  
No CI/CD pipeline. No wrangler, no Cloudflare, no Turborepo.

## Environment variables

All accessed via `process.env` in server-side code (API routes, `lib/db`, `lib/github`):

| Variable | Where used |
| --- | --- |
| `MONGODB_URI` | `src/lib/db/mongoose.ts` |
| `GITHUB_TOKEN` | `src/lib/github.ts` |
| `CRON_SECRET` | `src/app/api/github/sync/route.ts` |

## Git Conventions

**Conventional Commits** — always:

```
feat: add new section to homepage
fix: correct heatmap alignment on mobile
refactor: extract ExperienceCard to its own file
chore: update dependencies
```

Create commits only when explicitly asked. Never commit without a clear request.

## Global Rules — Never Do

1. **Never hardcode strings** visible in the UI. Every user-facing string must use `t("key")` from `react-i18next`. Always add the key to **both** locale files simultaneously: `src/lib/i18n/locales/ptBR/common.json` and `src/lib/i18n/locales/enUS/common.json`.

2. **Never create new UI components** without first checking `src/components/ui/` — shadcn/ui already covers most primitives (accordion, dialog, tooltip, timeline, hover-card, etc.).

3. **Never change the folder structure** (`components/`, `constants/`, `lib/`, etc.) without being explicitly asked.

4. **Never add code comments.** The code is self-documenting. Only add a comment when the _why_ is a non-obvious constraint or workaround.

5. **Never refactor code outside the scope of what was asked.** A bug fix is a bug fix. A typo change is a typo change.

6. **Never create `.md` documentation files** unless explicitly requested.

7. **Never hardcode colors.** The design system uses `oklch` CSS variables (`--background`, `--foreground`, `--muted`, `--border`, etc.). Use Tailwind semantic classes (`bg-background`, `text-muted-foreground`, `border-border`).

## Data Management

All content data lives in TypeScript constants — no CMS, no external JSON:

| What         | File                            |
| ------------ | ------------------------------- |
| Projects     | `src/constants/projects.ts`     |
| Skills       | `src/constants/skills.ts`       |
| Experience   | `src/constants/experience.ts`   |
| Social links | `src/constants/socials.ts`      |
| Profile info | `src/constants/profile.ts`      |

When adding entries, edit the constant file + add i18n keys for any translatable text. Never propose migrating to a CMS or external data source.

## i18n Rules

- Primary locale: `ptBR` (default and fallback)
- Secondary locale: `enUS`
- Locale files: `src/lib/i18n/locales/ptBR/common.json` and `src/lib/i18n/locales/enUS/common.json`
- Locale is stored in a cookie (`NEXT_LOCALE`) and read server-side in `layout.tsx`
- **Always add keys to both locales at the same time.** Never leave one locale missing a key.
- Use `useTranslation()` hook in client components.

## GitHub Heatmap Architecture

- **DB is the single source of truth.** The contributions endpoint only reads from MongoDB — never calls the GitHub API directly.
- **Cron is the only writer.** `GET /api/github/sync` (protected by `Authorization: Bearer CRON_SECRET`) is fired daily by Vercel Cron at 03:00 UTC. It fetches from GitHub and upserts into MongoDB.
- **Date handling:** dates are calendar strings (YYYY-MM-DD) with no timezone conversion. Use `toLocalDate` / `toDateStr` from `src/lib/contribution-calendar.ts` for all date arithmetic — never `parseISO` (date-fns v4 treats date-only strings as UTC, causing off-by-one in UTC-3).

## Performance

Mention performance impact only when it's significant (e.g., adding a heavy library, large images without `next/image`). Don't optimize prematurely — this is a portfolio site with Next.js, Framer Motion, and shadcn already in the bundle.
