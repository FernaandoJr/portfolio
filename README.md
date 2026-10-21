<div align="center">

# fernaandojr.dev

Personal portfolio and blog of **Fernando Junior** — Full Stack Developer based in São Paulo, Brazil.

[Live site](https://fernaandojr.dev) · [GitHub](https://github.com/FernaandoJr) · [LinkedIn](https://linkedin.com/in/fernaandojr)

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-15bb89.svg)](./LICENSE)

</div>

---

## Overview

This is the source of my personal site: a place to write about what I build, keep the case studies for my
projects, and show a bit of how I work. It is a fully static-first Next.js App Router app, with a small
MongoDB-backed data layer for the GitHub contributions heatmap.

The site ships in **Portuguese and English**, adapts to light and dark themes, and renders long-form content
from MDX files committed alongside the code.

## Features

- **Bilingual content** — pt-BR and en-US, switched at runtime and persisted, with a matching MDX variant
  per locale.
- **Theme aware** — dark by default, system-aware, no flash of the wrong theme.
- **MDX blog and case studies** — syntax highlighting (Shiki), a table-of-contents rail, per-post social
  images, and an RSS feed.
- **GitHub contributions heatmap** — cached server-side and resilient: when the data is unavailable, the
  calendar renders empty instead of breaking the page.
- **SEO out of the box** — metadata, Open Graph, sitemap, and robots generated from the App Router.
- **Accessible primitives** — Radix UI components, keyboard-friendly menus, and sensible focus states.
- **Typed and tested** — strict TypeScript, ESLint, Prettier, and a Vitest suite covering the content and
  data layers.

## Tech stack

| Area      | Choices                                                                   |
| --------- | ------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack, React Compiler)                        |
| UI        | React 19, Tailwind CSS 4, Radix UI, tailwind-variants, Framer Motion      |
| Language  | TypeScript 5.9                                                            |
| Content   | MDX (`next-mdx-remote-client`), Shiki, gray-matter, rehype/remark plugins |
| Data      | TanStack Query, MongoDB + Mongoose                                        |
| i18n      | i18next + react-i18next                                                   |
| Tooling   | pnpm, ESLint 9, Prettier, Husky, Vitest                                   |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 20.9 or newer
- [pnpm](https://pnpm.io) 9
- A MongoDB connection string (optional, only for the heatmap)

### Install and run

```bash
git clone https://github.com/FernaandoJr/portfolio.git
cd portfolio
pnpm install
cp .env.example .env.local
pnpm dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

### Environment variables

Everything is optional for local development — without them the site renders normally and the heatmap
falls back to an empty state.

| Variable       | Required | Purpose                                                         |
| -------------- | -------- | --------------------------------------------------------------- |
| `MONGODB_URI`  | Heatmap  | MongoDB connection string used to store the contribution cache. |
| `GITHUB_TOKEN` | Sync     | Token used by the daily job to query GitHub contributions.      |
| `CRON_SECRET`  | Sync     | Bearer token that protects `/api/github/sync`.                  |

Put secrets in `.env.local` (gitignored), never in `.env.example`.

## Scripts

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm dev`         | Start the development server (Turbopack).        |
| `pnpm build`       | Create an optimized production build.            |
| `pnpm start`       | Serve the production build.                      |
| `pnpm lint`        | Run ESLint with zero warnings allowed.           |
| `pnpm check-types` | Generate route types and type-check the project. |
| `pnpm test`        | Run the Vitest suite.                            |

## Project structure

```
.
├── content/
│   ├── blog/              # MDX posts, one file per locale
│   └── projects/          # MDX case studies, one file per locale
├── public/                # Icons, brand mark and static assets
├── scripts/               # Content validation and translation CLIs
└── src/
    ├── app/               # Routes, metadata files and API handlers
    ├── components/        # Sections, UI primitives and MDX renderers
    ├── constants/         # Profile, experience, skills and socials
    ├── hooks/             # Client hooks (contributions, media queries)
    ├── lib/               # i18n, MDX pipeline, GitHub and MongoDB layers
    └── utils/
```

## Content

Posts and case studies live in `content/` as MDX. Each entry has one file per locale:

```
content/blog/<slug>.ptBR.mdx
content/blog/<slug>.enUS.mdx
```

The same convention applies to `content/projects/`. Both files share the same slug, and the variant without
`translatedFrom` in its frontmatter is used as the source when a translation is missing.

## License

Released under the [MIT License](./LICENSE). Copy it, fork it, use it as a base for your own site — a link
back is appreciated but not required.

The posts and the brand assets (name and logo) are personal: please don't republish them as your own.
