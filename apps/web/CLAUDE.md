# apps/web — Next.js App Context

> Read root `CLAUDE.md` first. This file adds web-specific context.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4 + shadcn/ui + tw-animate-css
- **Animations:** Framer Motion
- **Icons:** Lucide React + Iconify
- **Fonts:** Geist (sans), Merriweather (serif), JetBrains Mono (mono)
- **Theme:** next-themes — supports light/dark/system. Both themes have equal visual weight; always verify changes look good in both.
- **Data fetching:** TanStack Query v5
- **i18n:** `@repo/i18n` (i18next + react-i18next)

## App Structure

```
src/
├── app/
│   ├── layout.tsx        ← Root layout: providers, fonts, Header, Footer, BGPattern
│   ├── page.tsx          ← Single-page app: all sections in order
│   └── globals.css       ← Tailwind imports + CSS variables (oklch)
├── components/
│   ├── ui/               ← shadcn/ui primitives (check here before creating anything new)
│   ├── header/           ← Site header + mobile menu
│   ├── footer/           ← Site footer
│   ├── infoSection/      ← Hero: avatar, name, subtitle, location, email, heatmap, skills
│   ├── aboutSection/     ← About paragraphs
│   ├── skillsSection/    ← Tech stack icon grid
│   ├── projectsSection/  ← Project cards
│   ├── experienceSection/← Timeline with expandable entries
│   ├── quoteSection/     ← Martin Fowler quote
│   ├── darkMode/         ← Theme toggle
│   ├── language-switcher/← PT-BR / EN-US switcher
│   └── providers/        ← i18n-provider, query-provider
├── constants/            ← All static data (never put data elsewhere)
└── lib/                  ← Utility functions (translateDate, cn, etc.)
```

## Page Layout

The page (`src/app/page.tsx`) is a single-page layout with sections in this order:

1. `#hero` → `InfoSection`
2. `#about` → `AboutSection`
3. `#projects` → `ProjectsSection`
4. `#experience` → `ExperienceSection`
5. `#contact` → placeholder (coming soon)
6. `QuoteSection` (no anchor, decorative)

Max content width: `max-w-3xl mx-auto`. Padding: `px-6 lg:px-0`.

## Color System

All colors come from CSS variables in `globals.css`. Use only Tailwind semantic classes:

```
bg-background       text-foreground
bg-card             text-card-foreground
bg-muted            text-muted-foreground
bg-primary          text-primary-foreground
bg-secondary        text-secondary-foreground
bg-accent           text-accent-foreground
border-border       ring-ring
```

Never use raw oklch values, hex, or rgb in component code.

## Typography

```
font-sans   → Geist (body, UI)
font-serif  → Merriweather (decorative, dates)
font-mono   → JetBrains Mono (code)
```

## Component Patterns

**Client components** always start with `"use client"`. Server components have no directive.

```tsx
// Client component
"use client";
import { useTranslation } from "@repo/i18n";

export default function MySection() {
	const { t } = useTranslation();
	return <p>{t("myKey")}</p>;
}
```

**Feature components** live in `components/[featureName]/index.tsx`. Sub-components of the same feature live in the same folder (e.g. `infoSection/github-heatmap.tsx`).

**UI primitives** live in `components/ui/`. Never duplicate something that already exists there.

## Adding a New Project

1. Add entry to `src/constants/projects.ts` (type `Project`)
2. Add description key to both locales in `@repo/i18n`
3. Add image to `public/projects/` (use `.webp` format)

## Adding a New Experience Entry

1. Add entry to `src/constants/experience.ts` (type `Experience`)
2. Add all i18n keys (`descKey`, `bulletKeys`, `companyInfo.descKey`) to both locales
3. Add company logo to `public/icons/companies/` if applicable

## Adding a New Skill

1. Add entry to `src/constants/skills.ts` (type `Skill`)
2. Add SVG icon to `public/icons/skills/`
3. Set `darkInvert: true` if the icon is dark and needs to be inverted in dark mode

## GitHub Heatmap

The heatmap fetches from `@repo/api-client` → `apps/api`. In development, the API must be running (`wrangler dev`) for contributions to load. The component gracefully handles loading and error states.

## No Tests

There is no test suite in this app. Type-checking (`pnpm check-types`) is the primary correctness mechanism.
