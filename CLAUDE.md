# Portfolio Monorepo — Claude Context

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
portfolio/                     ← Turborepo monorepo (pnpm)
├── apps/
│   ├── web/                   ← Next.js 16 + React 19 (main site)
│   └── api/                   ← Cloudflare Worker (Hono + D1)
└── packages/
    ├── i18n/                  ← i18next config + locales (ptBR / enUS)
    ├── api-client/            ← Typed HTTP client for the API
    ├── eslint-config/         ← Shared ESLint configs
    └── typescript-config/     ← Shared tsconfigs
```

### Path aliases

- `@/` → `apps/web/src/`
- `@repo/i18n` → `packages/i18n`
- `@repo/api-client` → `packages/api-client`

## Dev Commands

```bash
pnpm dev          # Run all apps via Turborepo
pnpm build        # Build all
pnpm lint         # Lint all
pnpm check-types  # Type-check all
```

Run individual apps:

```bash
cd apps/web && pnpm dev    # next dev → localhost:3000
cd apps/api && pnpm dev    # wrangler dev → localhost:8787
```

## Deploy

- **Web:** Manual deploy to Vercel.
- **API:** `cd apps/api && pnpm deploy` (runs `wrangler deploy`).
- No CI/CD pipeline currently.

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

1. **Never hardcode strings** visible in the UI. Every user-facing string must use `t("key")` from `@repo/i18n`. Always add the key to **both** locale files simultaneously: `packages/i18n/locales/ptBR/common.json` and `packages/i18n/locales/enUS/common.json`.

2. **Never create new UI components** without first checking `apps/web/src/components/ui/` — shadcn/ui already covers most primitives (accordion, dialog, tooltip, timeline, hover-card, etc.).

3. **Never change the folder structure** (`components/`, `constants/`, `lib/`, etc.) without being explicitly asked.

4. **Never add code comments.** The code is self-documenting. Only add a comment when the _why_ is a non-obvious constraint or workaround.

5. **Never refactor code outside the scope of what was asked.** A bug fix is a bug fix. A typo change is a typo change.

6. **Never create `.md` documentation files** unless explicitly requested.

7. **Never use `process.env`** inside `apps/api` — this runs on Cloudflare Workers. Environment variables and bindings are accessed via `c.env` (Hono context).

8. **Never hardcode colors.** The design system uses `oklch` CSS variables (`--background`, `--foreground`, `--muted`, `--border`, etc.). Use Tailwind semantic classes (`bg-background`, `text-muted-foreground`, `border-border`).

## Data Management

All content data lives in TypeScript constants — no CMS, no external JSON:

| What         | File                                   |
| ------------ | -------------------------------------- |
| Projects     | `apps/web/src/constants/projects.ts`   |
| Skills       | `apps/web/src/constants/skills.ts`     |
| Experience   | `apps/web/src/constants/experience.ts` |
| Social links | `apps/web/src/constants/socials.ts`    |
| Profile info | `apps/web/src/constants/profile.ts`    |

When adding entries, edit the constant file + add i18n keys for any translatable text. Never propose migrating to a CMS or external data source.

## i18n Rules

- Primary locale: `ptBR` (default and fallback)
- Secondary locale: `enUS`
- Locale is stored in a cookie (`NEXT_LOCALE`) and read server-side in `layout.tsx`
- **Always add keys to both locales at the same time.** Never leave one locale missing a key.
- Use `useTranslation()` hook in client components, `t` from `@repo/i18n` in non-React contexts.

## Performance

Mention performance impact only when it's significant (e.g., adding a heavy library, large images without `next/image`). Don't optimize prematurely — this is a portfolio site with Next.js, Framer Motion, and shadcn already in the bundle.
