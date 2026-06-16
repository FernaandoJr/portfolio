# Code Review — Portfolio (Next.js + MongoDB)

> Revisão completa do projeto: arquitetura, código, configuração, tooling, i18n, segurança e performance.
> Data: 2026-06-16 · Branch: `main`

---

## Sumário executivo

O projeto é um portfólio em **Next.js 16 + React 19** (App Router), com Tailwind v4, shadcn/ui, framer-motion, i18n (i18next) e um heatmap de contribuições do GitHub alimentado por **MongoDB** + cron diário na Vercel. O código de produto (componentes de seção, data layer, heatmap) é **limpo, tipado e bem organizado**, com i18n disciplinado (paridade 104/104 entre locales) e design system consistente em `oklch`.

O maior problema **não está no código de runtime**, e sim na **dívida de migração**: o repositório nasceu como um monorepo Turborepo (`apps/web` + `apps/api` Cloudflare Worker + `packages/*`) e foi achatado para um único app Next.js + MongoDB (commit `af4785a`). Documentação, configuração e arquivos remanescentes **nunca foram atualizados** e hoje descrevem uma realidade que não existe mais. Some-se a isso uma camada considerável de **código morto** (duplicatas e ~50 componentes shadcn não usados).

**Prioridades:**
1. 🔴 Resolver o drift de documentação/config (README, CLAUDE.md, tsconfig, eslint).
2. 🔴 Remover sobras do monorepo em disco (`apps/`, `packages/`, `.turbo/`) — incluindo `apps/api/.env` com segredos.
3. 🟡 Eliminar código morto e duplicatas (`useScroll.ts`, `darkMode/`, `registry-theme.ts`, `heatmap-calendar.tsx`).
4. 🟡 Corrigir o singleton de i18n compartilhado no SSR e o `bunx` no hook pnpm.

---

## Pontos fortes

- **i18n disciplinado:** paridade perfeita de chaves entre `ptBR` e `enUS` (104/104), uso correto de `<Trans>` para interpolação de links em `about/page.tsx`.
- **Design system coerente:** tokens `oklch` para light/dark em `globals.css`, classes semânticas (`bg-background`, `text-muted-foreground`) — sem cores hardcoded.
- **Data layer enxuto:** `mongoose.ts` com cache global de conexão (padrão correto para serverless), `sync.ts` idempotente via `upsert`, separação limpa entre `lib/github.ts` (fetch) e `lib/db/sync.ts` (persistência).
- **Heatmap robusto:** após o último ajuste, datas são tratadas como strings de calendário puras (sem timezone), com testes unitários cobrindo `fillHoles`/`groupByWeeks`.
- **Acessibilidade razoável:** `aria-label`/`aria-hidden` nos lugares certos, fallback de hidratação no `ModeToggle` e `LocalTime`.

---

## 🔴 Severidade alta

### 1. `README.md` é o boilerplate padrão do Turborepo
`README.md` ainda é o texto de `create-turbo` ("This Turborepo starter is maintained by..."). Descreve apps `docs`/`web`, `@repo/ui`, comandos `turbo build --filter` — nada disso existe. Sendo um portfólio **público**, é o primeiro arquivo que recrutadores veem no GitHub.

**Ação:** reescrever do zero — stack real, screenshot, variáveis de ambiente (`GITHUB_TOKEN`, `MONGODB_URI`, `CRON_SECRET`), comandos `pnpm dev`/`build`/`test`, e como o cron alimenta o heatmap.

### 2. `CLAUDE.md` descreve uma arquitetura que não existe mais
Vários trechos apontam para a estrutura antiga de monorepo:
- "Repository Structure" lista `apps/web`, `apps/api` (Cloudflare Worker + D1), `packages/i18n`, `packages/api-client`, etc. → hoje é um app flat com `src/` na raiz.
- Path aliases `@repo/i18n`, `@repo/api-client` → não existem; o i18n vive em `src/lib/i18n`.
- `@/` → "`apps/web/src/`" → na verdade é `./src/` (ver `tsconfig.json`).
- Regra **"Never use `process.env` inside apps/api (Cloudflare Workers)"** → **invertida**: o app agora usa `process.env` legitimamente (`mongoose.ts:12`, `github.ts:9`, `sync/route.ts`). A regra atual induz ao erro.
- Deploy: "API: `cd apps/api && pnpm deploy` (wrangler deploy)" → não há mais wrangler.
- i18n: aponta para `packages/i18n/locales/...` → real é `src/lib/i18n/locales/...`.

**Ação:** reescrever o `CLAUDE.md` para refletir o app único. Isso é importante porque essas instruções têm prioridade nas sessões de IA e hoje estão ativamente erradas.

### 3. Sobras do monorepo em disco (não rastreadas) + segredos
Existem em disco, **fora do git**, `apps/` (api + web), `packages/` (api-client, eslint-config, i18n) e `.turbo/`, cada um com seu `node_modules`. Pior: existe **`apps/api/.env`** com segredos da era Cloudflare parado na árvore de trabalho.

Problemas:
- Confusão grave (há um segundo `apps/web/src` paralelo ao `src/` real).
- Segredos antigos em texto plano no working tree.
- `eslint.config.js` **não ignora** `apps/`/`packages/` (`globalIgnores` só cobre `.next/**`, `out/**`, `build/**`, `next-env.d.ts`); como o hook roda `pnpm lint` sem path, o ESLint pode percorrer esse código morto.

**Ação:** apagar `apps/`, `packages/`, `.turbo/` do disco. Confirmar que não há nada útil exclusivo neles antes (parecem 100% legado). Rotacionar quaisquer segredos que estavam em `apps/api/.env`.

---

## 🟡 Severidade média

### 4. Código morto e duplicatas dentro de `src/`

| Arquivo | Situação | Ação |
| --- | --- | --- |
| `src/lib/useScroll.ts` | Duplicata **exata** de `use-scroll.ts` (só muda um comentário). O header importa `use-scroll`. | Apagar `useScroll.ts`. |
| `src/components/darkMode/index.tsx` | Segundo `ModeToggle`, não importado em lugar algum (header usa `mode-toggle.tsx`). Ainda **briga com o next-themes** lendo `localStorage.getItem("theme")` num effect (`darkMode/index.tsx:24-27`). | Apagar a pasta `darkMode/`. |
| `src/lib/registry-theme.ts` | `export const registryTheme = ""`. Usado só em `new-card.tsx:90` como `cn("")` — no-op. | Remover o arquivo e o uso. |
| `src/components/ui/heatmap-calendar.tsx` | ~390 linhas, **não importado** por ninguém (o heatmap usa `contribution-graph.tsx`). | Apagar. |

### 5. ~50 componentes shadcn não usados + libs pesadas órfãs
Apenas ~9 componentes UI são alcançáveis a partir do app: `bg-pattern`, `tooltip`, `section-heading`, `button`, `dropdown-menu`, `timeline`, `new-card`, `new-hover-card`, `contribution-graph`.

As dependências pesadas estão **exclusivamente** em componentes não usados:
- `recharts` (3.8) → só em `ui/chart.tsx`
- `embla-carousel-react` → só em `ui/carousel.tsx`
- `react-day-picker` → só em `ui/calendar.tsx`
- `vaul` → só em `ui/drawer.tsx`
- `cmdk` → só em `ui/command.tsx`
- `input-otp` → só em `ui/input-otp.tsx`
- `react-resizable-panels` → só em `ui/resizable.tsx`

O tree-shaking impede que isso vá pro bundle, mas infla install, lockfile e `node_modules`.

**Nuance:** o `CLAUDE.md` orienta manter a paleta shadcn ampla de propósito. Então a recomendação **não** é apagar tudo cegamente, e sim:
- **Decidir explicitamente:** ou manter a paleta (e documentar isso), ou podar o que claramente nunca será usado e **dropar as dependências pesadas** correspondentes do `package.json`.
- **Resolver a duplicação confusa:** `card.tsx` vs `new-card.tsx` e `hover-card.tsx` vs `new-hover-card.tsx`. As seções usam as variantes `new-*`; as originais shadcn parecem mortas. Escolher um nome canônico (renomear `new-card` → `card`).

### 6. i18n: singleton de módulo compartilhado no SSR
`src/lib/i18n/index.ts` cria **uma** instância (`createInstance()`) no escopo do módulo. No servidor, módulos são compartilhados entre requisições concorrentes. `I18nProvider` chama `i18n.changeLanguage(locale)` **durante o render** (`i18n-provider.tsx:6-8`), o que:
- causa efeito colateral no corpo do render (anti-padrão React);
- abre espaço para **vazamento de locale entre requisições** no SSR (request enUS muda o singleton e request ptBR concorrente renderiza enUS até ser corrigido);
- gera FOUC/mismatch de hidratação: o HTML do servidor sai com o `lng` default (`ptBR`) para usuários enUS.

Note que o `<html lang>` em `layout.tsx:60` está correto (lido do cookie server-side) — o problema é só o conteúdo traduzido.

**Ação:** para uma correção robusta, instanciar o i18n por requisição no servidor (ou usar uma abordagem RSC-aware). Como mitigação mínima, mover o `changeLanguage` para um `useEffect` e inicializar a instância já com o `locale` recebido. Dado que é um portfólio, é aceitável priorizar a correção do efeito-no-render e documentar a limitação.

### 7. `.husky/pre-commit` mistura Bun e pnpm
O hook roda `bunx prettier ...` num projeto cujo gerenciador é **pnpm** (`packageManager: pnpm@9`). Em qualquer máquina/CI sem Bun, o commit quebra.

```sh
# em vez de:
bunx prettier $PRETTIER_FILES --write --ignore-unknown
# usar:
pnpm exec prettier $PRETTIER_FILES --write --ignore-unknown
```

Além disso, o hook roda `pnpm lint` mas **não** roda `check-types` nem `test`. Agora que há Vitest, vale adicionar `pnpm test` (e idealmente `check-types`) ao pre-commit ou a um CI.

### 8. Site inteiro é client-side
`page.tsx`, `about/page.tsx` e **todas** as seções são `"use client"`. Não há uso de React Server Components para o conteúdo estático (about, projetos, experiência, quote — tudo derivado de constants). Consequências: mais JS no cliente e conteúdo traduzido renderizado no cliente.

Para um portfólio é tolerável, mas há ganho real de SEO/performance em transformar as seções estáticas em Server Components, deixando `"use client"` apenas onde há interação (header, toggles, heatmap, copy-email, animações). Combinar isso com i18n server-side resolveria o item 6 de quebra.

---

## 🟢 Severidade baixa / polish

### Configuração
- **`tsconfig.json`**: `exclude` lista `apps`/`packages` (legado — some quando os diretórios forem removidos). `declaration: true` + `declarationMap: true` são inócuos com `noEmit: true` — remover.
- **`eslint.config.js`**: usa `globals.serviceworker` (`eslint.config.js:30`) — herança do Cloudflare Worker. Para um app Next, o correto é `globals.browser` (+ `globals.node` onde aplicável). Também: `react-hooks/exhaustive-deps` está **desligado** globalmente (`:51`) — remove uma rede de proteção contra stale closures; considerar `"warn"`.
- Sem ordenação de classes Tailwind (`prettier-plugin-tailwindcss`) — opcional, mas padroniza a ordem das classes.

### Data layer
- **DRY de username:** `GITHUB_USERNAME` em `constants/profile.ts:5` não é usado; `lib/github.ts:34` redefine `PORTFOLIO_USERNAME = "FernaandoJr"`. Unificar (a lib deveria importar do constant).
- **Env não validado:** `process.env.MONGODB_URI!`/`GITHUB_TOKEN!`/`CRON_SECRET` usam non-null assertion; se faltarem, o erro é críptico. Um guard único (ex.: validação no boot) dá mensagens melhores.
- **Cache HTTP:** `GET /api/github/contributions` não envia `Cache-Control`. Como os dados mudam 1x/dia, um `s-maxage` curto na resposta reduziria carga e latência.

### Frontend
- **`infoSection/index.tsx` copyEmail (`:20-24`):** `navigator.clipboard.writeText` sem `try/catch` (lança em contexto inseguro/navegador antigo); o `setTimeout` não é limpo no unmount (warning de set-state-after-unmount em teoria).
- **`new-card.tsx`:** usa `React.forwardRef` + `assignRef` manual — funcional, mas em React 19 `ref` como prop simplifica. Cards animam `layout` (framer-motion) — custo desprezível aqui, mas observar se a grade crescer muito.
- **Consistência de nomes:** pasta `darkMode/` (camelCase) destoa do restante kebab-case; idem os dois arquivos de scroll.

### SEO
- **`about/page.tsx` é client** → não exporta `metadata`. Adicionar metadata própria (ou tornar a página Server Component com subárvore client) para título/description dedicados.
- Faltam **`app/sitemap.ts`** e **`app/robots.ts`**.
- **OG/Twitter sem imagem:** `metadata` em `layout.tsx` não define `openGraph.images` e o Twitter card é `summary` sem imagem. Uma OG image melhora muito o compartilhamento.

### Conteúdo
- **Projetos placeholder:** 5 dos 6 em `constants/projects.ts` (Orbit, Forge, Pixel, Stellar, Void) têm `github: "https://github.com"`, `demo: "https://example.com"` e imagens `picsum.photos`. Num portfólio, links mortos pesam negativamente — substituir por projetos reais ou remover.
- **Discord:** `socials.ts:15` aponta para um canal de DM pessoal (`/channels/@me/...`), que não funciona para visitantes. Trocar por convite de servidor ou remover.

---

## Plano de ação priorizado (quick wins primeiro)

**Limpeza imediata (baixo risco, alto impacto):**
1. Apagar `apps/`, `packages/`, `.turbo/` do disco; rotacionar segredos de `apps/api/.env`.
2. Apagar `src/lib/useScroll.ts`, `src/components/darkMode/`, `src/lib/registry-theme.ts` (+ uso em `new-card.tsx`), `src/components/ui/heatmap-calendar.tsx`.
3. Trocar `bunx` → `pnpm exec` no `.husky/pre-commit`.
4. Limpar `tsconfig.json` (`exclude`, `declaration*`) e `eslint.config.js` (`serviceworker` → `browser`).

**Documentação (alto impacto para repo público):**
5. Reescrever `README.md` (stack real + setup + env).
6. Reescrever `CLAUDE.md` para o app único (corrigir paths, regra de `process.env`, deploy, i18n).

**Correções de robustez:**
7. Corrigir o `changeLanguage` no render e o singleton de i18n no SSR (idealmente migrar seções estáticas para RSC).
8. Decidir o destino da paleta shadcn não usada e dropar dependências pesadas órfãs (`recharts`, `embla`, `vaul`, `cmdk`, `react-day-picker`, `react-resizable-panels`, `input-otp`) se a poda for aprovada.
9. Resolver duplicação `new-card`/`card` e `new-hover-card`/`hover-card` (nome canônico).

**Polimento:**
10. Metadata da página `/about`, `sitemap.ts`, `robots.ts`, OG image.
11. Substituir projetos placeholder e corrigir link do Discord.
12. Unificar `GITHUB_USERNAME`, validar env, adicionar `Cache-Control` na rota de contribuições.

---

## Observação sobre o estado atual da branch

Há trabalho não commitado nesta sessão (heatmap timezone fix + extração de `contribution-calendar.ts` + testes Vitest + remoção de `ex.json`). Conferir `git status` e commitar com mensagem Conventional Commits antes de iniciar a faxina acima, para manter os diffs separados e revisáveis.
