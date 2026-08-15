# Boris Martinez Tattoo Website

Monorepo for Boris Martinez. The frontend is an [Astro](https://astro.build) + TypeScript app; the backend is a [Hono](https://hono.dev) app running on Cloudflare Workers, with shared code in `packages/*`. Everything is managed with [pnpm](https://pnpm.io) workspaces.

> Workspace packages are scoped under `@boris-martinez-tattoo/` (e.g. `@boris-martinez-tattoo/web`).

---

## Table of contents

1. [Monorepo architecture](#monorepo-architecture)
2. [Astro project architecture (`apps/web`)](#astro-project-architecture-appsweb)
3. [Backend architecture (`apps/api`)](#backend-architecture-appsapi)
4. [Persistence (`packages/database`)](#persistence-packagesdatabase)
5. [Shared contracts (`packages/core`)](#shared-contracts-packagescore)
6. [Design system (Tailwind v4)](#design-system-tailwind-v4)
7. [Using pnpm](#using-pnpm)
8. [Linting & type-checking](#linting--type-checking)
9. [Editor setup (VS Code)](#editor-setup-vs-code)
10. [Development mode](#development-mode)
11. [Production](#production)
12. [`apps/web` vs. `web` at the root](#appsweb-vs-web-at-the-root)

---

## Monorepo architecture

The repository uses **pnpm workspaces**. The root directory is the *workspace owner*; each sub-folder is an independent *workspace package* with its own `package.json`.

```
boris-martinez-tattoo/
├── package.json            # private root — workspace-level scripts only
├── pnpm-workspace.yaml     # workspace globs: apps/* and packages/*
├── pnpm-lock.yaml          # single shared lockfile
├── .gitignore
├── .vscode/                # committed editor config (see Editor setup)
├── apps/
│   ├── web/                # @boris-martinez-tattoo/web — the Astro frontend (Cloudflare Pages)
│   └── api/                # @boris-martinez-tattoo/api — Hono backend + admin SSR (Cloudflare Workers)
└── packages/
    ├── core/               # @boris-martinez-tattoo/core — shared TypeScript types + Zod schemas
    └── database/           # @boris-martinez-tattoo/database — Drizzle ORM schema, migrations, D1 client
```

- **`apps/*`** — deployable applications. The Astro site and the Hono API live here.
- **`packages/*`** — non-deployable shared libraries (utilities, shared types, UI primitives) consumed by apps through the `workspace:` protocol.

### Rules of the monorepo

- The root `package.json` is `private: true` — it is never published.
- Every workspace package is scoped under `@boris-martinez-tattoo/` (e.g. `@boris-martinez-tattoo/web`) to avoid name clashes on npm.
- There is **one** `pnpm-lock.yaml` at the root for the whole monorepo — never commit lockfiles inside individual apps.

### Workspace-level scripts (run from the repo root)

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the web app in development mode |
| `pnpm dev:api` | Start the API worker locally (`wrangler dev`, port 8787) |
| `pnpm build` | Build every workspace app (web → `dist/`, api → dry-run bundle check) |
| `pnpm preview` | Preview the web production build locally |
| `pnpm lint` | Lint every workspace |
| `pnpm check` | Type-check every workspace (`astro check` / `tsc --noEmit`) |
| `pnpm db:generate` | Generate a SQL migration from `packages/database/src/schema` |

### Adding a shared library consumed by both apps

```bash
pnpm create ./packages/core                 # name it @boris-martinez-tattoo/core
pnpm --filter @boris-martinez-tattoo/web  add @boris-martinez-tattoo/core --workspace
pnpm --filter @boris-martinez-tattoo/api  add @boris-martinez-tattoo/core --workspace
```

---

## Astro project architecture (`apps/web`)

The web app is organised in a **layered architecture**. Layers depend in a single direction — outer layers may use inner layers, never the reverse:

```
Presentation  →  Application  →  Domain  ←  Infrastructure
```

```
apps/web/src/
├── pages/            # Presentation — Astro routes (.astro). Thin: compose layouts/components and call application services.
│   ├── index.astro       # Home — hero/about/portfolio/pricing/health/location/booking sections
│   ├── gallery.astro     # Full portfolio (Pinterest-style masonry)
│   └── about.astro       # Full artist bio (blog-style article)
├── layouts/          # Presentation — page layouts (BaseLayout wires global.css + Navbar)
├── components/       # Presentation — reusable UI components (.astro)
│   ├── Navbar.astro          # header | left | right variant via PUBLIC_NAV_LAYOUT
│   ├── NavBrand.astro        # wax-seal medallion + wordmark (shared by all nav layouts)
│   ├── NavCta.astro          # nav-sized paper CTA
│   ├── NavMobileMenu.astro   # collapsible mobile menu + toggle script
│   ├── CtaButton.astro       # the two action styles: paper (primary) / outline (secondary)
│   ├── SectionHeading.astro  # eyebrow + title + subtitle for sections
│   ├── AssayMark.astro       # serial · placement · session stamp
│   ├── ImagePlaceholder.astro# stand-in for images/logos/icons (swap for real assets later)
│   └── sections/             # one component per home-page section
├── application/     # Application — use cases / services that orchestrate domain logic
├── domain/          # Domain — entities, value objects, repository *interfaces*, business rules. No framework deps.
├── infrastructure/ # Infrastructure — adapters: HTTP clients, CMS/API repositories implementing the domain interfaces
└── config/          # Site / app configuration constants (site.ts: SITE, NAV_LAYOUT, NAV_LINKS)
```

### Dependency rule

```
pages / layouts / components  →  application  →  domain  ←  infrastructure
```

- **`domain`** imports nothing from the other layers. It is the stable core and changes least often.
- **`infrastructure`** implements the interfaces declared in `domain` (dependency inversion).
- **`pages`** never reach into `infrastructure` directly — they go through `application`.

### Path aliases

Defined in `apps/web/tsconfig.json` and resolved automatically by Astro/Vite (no extra config needed):

| Alias | Resolves to |
| --- | --- |
| `@components/*` | `src/components/*` |
| `@layouts/*` | `src/layouts/*` |
| `@application/*` | `src/application/*` |
| `@domain/*` | `src/domain/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@config/*` | `src/config/*` |

```ts
import { getFeaturedArtists } from '@application/artists';
import type { Artist } from '@domain/artist';
```

### TypeScript

The project extends `astro/tsconfigs/strict`. Pages are `.astro` files; layer logic lives in `.ts` files. The build will refuse to pass if `pnpm check` reports type errors.

---

## Backend architecture (`apps/api`)

The API is a [Hono](https://hono.dev) app deployed on **Cloudflare Workers**. It follows the same layered architecture as the web app:

```
Presentation  →  Application  →  Domain  ←  Infrastructure
```

```
apps/api/
├── wrangler.toml          # Worker config: D1 + R2 bindings, migrations_dir, vars
├── .dev.vars.example      # local secrets template (copy to .dev.vars)
└── src/
    ├── index.ts           # Worker entry — Hono app, route mounting
    ├── config/            # env bindings type (env.ts)
    ├── presentation/      # HTTP routes (Hono). Thin: parse → call use case → respond
    │   └── routes/            # health.ts, bookings.ts
    ├── application/       # use cases / services that orchestrate domain logic
    │   └── bookings/          # create-booking.ts (validate → persist → schedule)
    ├── domain/            # entities + repository *interfaces* (ports). No framework deps
    │   └── booking/           # booking.ts: Booking, BookingRepository, AppointmentCalendar
    └── infrastructure/    # adapters implementing the domain ports
        ├── persistence/       # drizzle-booking-repository.ts (D1 via packages/database)
        └── calendar/          # google-appointment-calendar.ts (Google Calendar API)
```

The dependency rule matches `apps/web`: `presentation → application → domain ← infrastructure`, and routes never touch `infrastructure` through anything but the use cases they compose.

### Path aliases

Defined in `apps/api/tsconfig.json` and resolved by Wrangler's bundler:

| Alias | Resolves to |
| --- | --- |
| `@presentation/*` | `src/presentation/*` |
| `@application/*` | `src/application/*` |
| `@domain/*` | `src/domain/*` |
| `@infrastructure/*` | `src/infrastructure/*` |
| `@config/*` | `src/config/*` |

### Routes (current)

| Endpoint | Purpose |
| --- | --- |
| `GET /api/health` | Liveness probe |
| `POST /api/bookings` | Public booking request — validates with the shared Zod schema, persists to D1, schedules via Google Calendar. `422` on invalid payload |

Two adapters are **stubs pending integration** (they log and no-op, clearly marked `TODO`): the Drizzle repository (waiting on the schema design, see below) and the Google Calendar client. Swap the bodies in; the ports and wiring are final.

### Invisible admin panel (planned)

Per the architecture PDF: the admin dashboard will be Hono JSX SSR behind `/${ADMIN_PATH}` — an unguessable route segment. Requests without a valid encrypted HTTP-only session cookie get a plain `404`; there is no public login page. The `jsx` / `jsxImportSource: hono/jsx` compiler options are already set.

### Local development

```bash
cp apps/api/.dev.vars.example apps/api/.dev.vars   # fill in secrets
pnpm db:generate                                    # only after schema changes
pnpm --filter @boris-martinez-tattoo/api db:migrate:local
pnpm dev:api                                        # http://localhost:8787
```

D1 and R2 run in local simulation (`workerd`) — no Cloudflare account needed for dev.

---

## Persistence (`packages/database`)

**Cloudflare D1 (SQLite) + Drizzle ORM.** This package owns the schema, the migrations and the typed client factory; it never deploys on its own.

```
packages/database/
├── drizzle.config.ts      # dialect sqlite, schema src/schema, out migrations/
├── migrations/            # generated SQL — applied by wrangler, committed to git
└── src/
    ├── client.ts          # createDb(d1) → typed Drizzle client
    └── schema/            # sqliteTable definitions (one file per aggregate)
```

> **The schema is not designed yet.** `src/schema/index.ts` contains a `_template`
> table demonstrating the pattern, plus a generated `0000_*.sql` migration proving
> the pipeline works end-to-end. Delete both when the real tables
> (`bookings`, `portfolio_images`, …) are designed.

### Migration workflow

1. Edit tables in `packages/database/src/schema/`.
2. `pnpm db:generate` — emits `migrations/NNNN_<name>.sql`.
3. Apply from the API workspace (Wrangler reads `migrations_dir` from `wrangler.toml`):

```bash
pnpm --filter @boris-martinez-tattoo/api db:migrate:local    # local dev D1
pnpm --filter @boris-martinez-tattoo/api db:migrate:remote   # production D1
```

Consumers never talk to D1 directly — they call `createDb(env.DB)` inside an `infrastructure` adapter.

---

## Shared contracts (`packages/core`)

Framework-free TypeScript types and **Zod schemas** shared by `apps/web` (form validation) and `apps/api` (payload validation) — one contract, two runtimes. Currently holds the booking request schema (`bookingRequestSchema`).

```ts
import { bookingRequestSchema, type BookingRequest } from '@boris-martinez-tattoo/core';
```

Add it to any workspace with:

```bash
pnpm --filter <app> add @boris-martinez-tattoo/core --workspace
```

---

## Design system (Tailwind v4)

The web app ships with **Tailwind CSS v4** wired through its official Vite plugin — the recommended integration for Astro 7. There is no `tailwind.config.js`: every token lives in `@theme` blocks inside a single stylesheet, so the design system is pure CSS.

The committed visual world is **The Assay Catalog** — every tattoo treated as a hallmarked piece of precious metal, entered in a register. The full system rules live in [`apps/web/DESIGN.md`](apps/web/DESIGN.md); the durable product context in [`apps/web/PRODUCT.md`](apps/web/PRODUCT.md). Key facts:

- **Palette (OKLCH, dark-dominant):** `primary` = graphite velvet (dark gray, page ground), `secondary` = struck silver (all type), `tertiary` = certificate beige (documents, seals, stamps, focus rings only).
- **Fonts:** Cinzel (engraved display caps), Archivo (body), JetBrains Mono (assay serials/stamps) — self-hosted via `@fontsource/*`, imported in `BaseLayout.astro`.
- **Shape:** sharp corners (0–2px); roundness only for the wax seal and the mercury drop.
- **Signature:** the liquid-mercury drop (`src/components/shaders/mercury-drop/MercuryDrop.astro`) — a WebGL noise-displaced chrome drop, honors the artist's tattoo work.

```
apps/web/
├── astro.config.mjs        # registers @tailwindcss/vite
└── src/
    ├── styles/global.css   # ← the whole design system (theme + base layer)
    ├── layouts/BaseLayout.astro   # imports global.css + fonts; <slot/> for pages
    └── pages/index.astro          # uses BaseLayout + the utility classes
```

### How it is wired

1. `@tailwindcss/vite` is registered in `astro.config.mjs`:
   ```js
   import tailwindcss from '@tailwindcss/vite';
   export default defineConfig({
     site: process.env.PUBLIC_ASTRO_SITE || 'http://localhost:4321',
     vite: { plugins: [tailwindcss()] },
   });
   ```
2. `src/styles/global.css` starts with `@import "tailwindcss";` and declares all tokens inside an `@theme { … }` block. Tailwind v4 turns each token into a CSS variable (`--color-primary-500`, `--font-primary`, `--radius-lg`, …) **and** into matching utility classes (`bg-primary-500`, `font-primary`, `rounded-lg`, …).
3. `src/layouts/BaseLayout.astro` imports that stylesheet — `import '@styles/global.css'` — so any page that uses `BaseLayout` automatically gets the design system. The `@styles/*` path alias is registered in `tsconfig.json`.

### Tokens

Everything below is authored in **OKLCH** (`oklch(L C H)`). To re-skin the site you only change the values in `src/styles/global.css`; no other file needs editing because Tailwind regenerates the utilities from the variables.

| Group | Token prefix | What it produces |
| --- | --- | --- |
| Color scales (50→950, 11 steps each) | `--color-primary-*` `--color-secondary-*` `--color-tertiary-*` | `bg-primary-500`, `text-secondary-700`, `border-tertiary-200`, … |
| Semantic aliases | `--color-background` · `--color-foreground` · `--color-muted` · `--color-muted-foreground` · `--color-border` · `--color-ring` · `--color-raised` · `--color-paper` · `--color-paper-foreground` · `--color-accent` | `bg-background`, `text-muted-foreground`, `bg-paper`, `ring-*` |
| Fonts | `--font-primary` · `--font-secondary` · `--font-mono` | `font-primary` (body), `font-secondary` (engraved display), `font-mono` (assay marks) |
| Font sizes (with line-heights) | `--text-2xs` … `--text-9xl` + `--text-2xs--line-height` … | `text-2xs`, `text-sm`, `text-3xl`, … |
| Border radius | `--radius-none` · `--radius-xs` … `--radius-4xl` · `--radius-full` | `rounded-sm`, `rounded-xl`, `rounded-full`, … |
| Spacing multiplier | `--spacing` (default `0.25rem`) | every `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` step |
| Breakpoints | `--breakpoint-sm` … `--breakpoint-2xl` | `sm:`, `md:`, `lg:`, `xl:`, `2xl:` |
| Shell container | `--shell-max` (default `72rem`) · `--shell-pad` (default `1.5rem`) | the `.shell` and `.shell-start` utilities (see below) |

#### Color scales

Each scale has 11 steps, authored in OKLCH:

| Scale | Role | Hue |
| --- | --- | --- |
| `primary` | graphite velvet — the dark page ground | ≈ 90 (warm, near-neutral) |
| `secondary` | struck silver — all text and engraving | ≈ 260 (near-neutral) |
| `tertiary` | certificate beige — paper, wax, focus | ≈ 85 |

The semantic aliases map the dark-dominant register onto the ramps:

```css
--color-background:        var(--color-primary-950);
--color-foreground:       var(--color-secondary-100);
--color-muted:            var(--color-primary-800);
--color-muted-foreground: var(--color-secondary-400);
--color-border:           var(--color-primary-700);
--color-ring:             var(--color-tertiary-400);
--color-raised:           var(--color-primary-900);
--color-paper:            var(--color-tertiary-100);
--color-paper-foreground: var(--color-primary-900);
--color-accent:           var(--color-tertiary-400);
```

Prefer semantic tokens (`bg-background`, `text-muted-foreground`, `bg-paper`) over raw scale steps in components — they are the single point of change when the world is retuned.

#### Fonts

Three families are exposed (self-hosted via `@fontsource`):

- `font-primary` — UI / body: **Archivo**.
- `font-secondary` — engraved display / headings: **Cinzel** (inscription caps; headings get it automatically through the `@layer base` rule in `global.css`).
- `font-mono` — assay serials, dates, stamps: **JetBrains Mono** (functional registration data only, never decoration).

The world rules that govern them (The Paper Rule, The Two-Ink Rule, The Chisel Rule) are in `apps/web/DESIGN.md` — read it before adding new surfaces.

#### Font sizes

| Utility | Size | Line-height |
| --- | --- | --- |
| `text-2xs` | 10px | 14px |
| `text-xs` | 12px | 16px |
| `text-sm` | 14px | 20px |
| `text-base` | 16px | 24px |
| `text-lg` | 18px | 28px |
| `text-xl` | 20px | 28px |
| `text-2xl` | 24px | 32px |
| `text-3xl` | 30px | 36px |
| `text-4xl` | 36px | 40px |
| `text-5xl` → `text-9xl` | 48 → 128px | 1 (display sizes) |

#### Border radius

| Utility | Value |
| --- | --- |
| `rounded-none` | `0px` |
| `rounded-xs` | `1px` |
| `rounded-sm` | `2px` |
| `rounded-md` | `4px` |
| `rounded-lg` | `8px` |
| `rounded-xl` | `12px` |
| `rounded-2xl` | `16px` |
| `rounded-3xl` | `24px` |
| `rounded-4xl` | `32px` |
| `rounded-full` | `9999px` |

The Assay Catalog world uses `rounded-none` for nearly everything; `rounded-full` only for the wax seal.

#### Shell — one site container width

Every site-level container (header bar, section inner, page main, footer) reads the same two tokens through one utility, so retuning the site width is a one-line change:

| Utility | What it does |
| --- | --- |
| `.shell` | centered, capped at `--shell-max`, padded `--shell-pad` — apply to the outer wrapper of every header / section / footer / page main; child content aligns to the same edges with no per-element calculation |

```css
/* the tokens, in @theme */
--shell-max: 72rem;
--shell-pad: 1.5rem;

/* the utility, in global.css */
@utility shell { width: 100%; max-width: var(--shell-max); margin-inline: auto; padding-inline: var(--shell-pad); }
```

Edit `--shell-max` / `--shell-pad` → every container retunes. A narrower page or section (About article, Booking form) overrides the token on the element, not the utility:

```astro
<main class="shell" style="--shell-max: 48rem">   <!-- keeps .shell padding, halves the cap -->
```

The Hero's gradient veil spans the viewport edge-to-edge while its text column rides the same `.shell` wrapper as every other section, so the heading aligns with the header and the sections below — no `calc()` anywhere. Per-element measure widths (`max-w-md`, `max-w-2xl`, `max-w-[65ch]`) are left untouched — they govern readability line lengths, not site layout.

### Using the design system in a component

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout>
  <section class="border border-border bg-background p-6">
    <p class="font-mono text-2xs uppercase tracking-[0.14em] text-tertiary-400">Entry tag</p>
    <h2 class="mt-2 font-secondary text-2xl text-foreground">Engraved heading</h2>
    <p class="mt-2 text-sm text-muted-foreground">Register body text…</p>
    <button class="mt-4 inline-flex items-center bg-paper px-6 py-3
                   font-secondary text-xs uppercase tracking-[0.12em] text-paper-foreground
                   transition hover:bg-tertiary-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
      Stamped action
    </button>
  </section>
</BaseLayout>
```

### Verifying the build

```bash
pnpm --filter @boris-martinez-tattoo/web check   # type checks .astro + .ts
pnpm --filter @boris-martinez-tattoo/web build    # compiles Tailwind v4 + Astro → dist/
```

The Tailwind v4 build only emits the utilities actually used on the page (just-in-time, automatic content detection — no `content` array to maintain).

---

## Using pnpm

Commands below work the same on Windows (PowerShell), macOS and Linux. The only requirement is Node ≥ 22.12.

### One-time install of pnpm

Node 22 ships with [Corepack](https://nodejs.org/api/corepack.html), so you don't need a global install:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Day-to-day commands

```bash
pnpm install                 # install everything (run from the repo root)
pnpm install --frozen-lockfile   # CI / reproducible installs
```

### Working with a specific workspace

Use `--filter <package-name>`. The package name is the `name` field in that app's `package.json` (`@boris-martinez-tattoo/web`):

```bash
pnpm --filter @boris-martinez-tattoo/web add astro-icon       # add a dependency to web only
pnpm --filter @boris-martinez-tattoo/web exec astro --version # run a binary *inside* the web workspace
pnpm --filter @boris-martinez-tattoo/web dev                   # run only the web dev script
```

### Working across all workspaces

```bash
pnpm -r add zod          # add a dependency to every workspace
pnpm -r build            # run "build" in every workspace
```

> Tip: always run `pnpm install` and `pnpm add` from the **repository root**, never from inside `apps/web`, so the single root lockfile stays in sync.

---

## Linting & type-checking

The linter is **ESLint 9** with a flat config at `apps/web/eslint.config.mjs`, combining:

- `@eslint/js` recommended rules,
- `typescript-eslint` recommended rules for `.ts` files,
- `eslint-plugin-astro` recommended rules for `.astro` files.

Run from the repo root:

```bash
pnpm lint                                  # lint every workspace
pnpm --filter @boris-martinez-tattoo/web lint --fix  # auto-fix lint issues in web
pnpm check                                 # astro check — TypeScript diagnostics for .astro + .ts
```

`pnpm check` (Astro's own type-checker) is what gates the build: a type error fails `astro check` *and* `astro build`.

---

## Editor setup (VS Code)

Editor config is committed under `.vscode/`, so opening the repo in VS Code applies everything automatically.

1. **Install the recommended extensions.** VS Code prompts on first open, or run the **Extensions: Show Recommended Extensions** command. The two you need (listed in `.vscode/extensions.json`) are:
   - **Astro** — `astro-build.astro-vscode`
   - **ESLint** — `dbaeumer.vscode-eslint`
2. **`.vscode/settings.json`** already:
   - enables ESLint flat config,
   - registers `.astro` as a lintable language,
   - runs `source.fixAll.eslint` on save (auto-fixes lint issues as you save `.ts` / `.astro` / `.js` files).

No Prettier is configured — ESLint is the single source of truth for style and conventions, so don't add a formatter that fights it.

For other editors (WebStorm, Neovim, …), point the TypeScript and ESLint language servers at `apps/web/tsconfig.json` and `apps/web/eslint.config.mjs`.

---

## Development mode

From the repo root:

```bash
pnpm install   # only the first time, or after pulling changes that touched dependencies
pnpm dev
```

Astro's dev server starts at <http://localhost:4321> with hot reload. Optional environment variables control the site URL / base path and the navbar layout (see `.env.example` in `apps/web`):

| Variable | Values | Default | Effect |
| --- | --- | --- | --- |
| `PUBLIC_NAV_LAYOUT` | `header` \| `left` \| `right` | `header` | Navbar renders as a sticky top header, or as a fixed left/right sidebar on desktop (`lg+`) with a top-header fallback on mobile |
| `PUBLIC_ASTRO_SITE` | URL | `http://localhost:4321` | Canonical site URL (`astro.config.mjs` → `site`) |
| `PUBLIC_ASTRO_BASE` | path | `/` | Base path when deployed under a subpath |

```bash
# PowerShell
$env:PUBLIC_NAV_LAYOUT="right"; $env:PUBLIC_ASTRO_SITE="https://boris-martinez-tattoo.com"; pnpm dev

# macOS / Linux
PUBLIC_NAV_LAYOUT="right" PUBLIC_ASTRO_SITE="https://boris-martinez-tattoo.com" pnpm dev
```

`PUBLIC_*` variables are inlined at build time, so restart the dev server after changing them.

### API

```bash
pnpm dev:api   # wrangler dev → http://localhost:8787
```

The worker simulates D1 and R2 locally. Secrets come from `apps/api/.dev.vars` (copy from `.dev.vars.example`); config vars and bindings live in `apps/api/wrangler.toml`.

---

## Production

The web app builds to a **fully static site**; the API deploys as a **Cloudflare Worker**.

```bash
pnpm build      # web → apps/web/dist/  ·  api → dry-run bundle check
pnpm preview    # serve the web build locally to verify it before deploying
```

### API deploy (Cloudflare Workers)

One-time resource setup (requires `wrangler login`):

```bash
pnpm --filter @boris-martinez-tattoo/api exec wrangler d1 create boris-martinez-tattoo-db
# → paste the returned database_id into apps/api/wrangler.toml
pnpm --filter @boris-martinez-tattoo/api exec wrangler r2 bucket create boris-martinez-tattoo-portfolio
pnpm --filter @boris-martinez-tattoo/api exec wrangler secret put SESSION_SECRET
pnpm --filter @boris-martinez-tattoo/api exec wrangler secret put GOOGLE_CALENDAR_ID
pnpm --filter @boris-martinez-tattoo/api exec wrangler secret put GOOGLE_SERVICE_ACCOUNT_KEY
# set ADMIN_PATH in wrangler.toml [vars] to a long random string
```

Then deploy and migrate:

```bash
pnpm --filter @boris-martinez-tattoo/api deploy
pnpm --filter @boris-martinez-tattoo/api db:migrate:remote
```

### Deploy

See [DEPLOY.md](DEPLOY.md) for full setup guide — GitHub Variables, provider switching, troubleshooting.

`apps/web/dist/` is plain HTML/CSS/JS — host it on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CDN, …).

| Setting | Value |
| --- | --- |
| Build command | `pnpm --filter @boris-martinez-tattoo/web build` |
| Output / publish directory | `apps/web/dist` |
| Node version | `22.12` or newer |

---

## `apps/web` vs. `web` at the root

You asked whether `apps/web/` (current) should be flattened to `boris-martinez-tattoo/web/`. **Keep `apps/web`.**

- A backend is coming. `apps/web` + `apps/api` keeps every deployable under one predictable folder, while a flat layout ends up mixing apps with shared packages at the root.
- `packages/*` is already wired for shared libraries both apps will consume; the `apps/` + `packages/` split is the convention pnpm and Turbo/Nx expect, so tooling and contributors recognise it instantly.
- The single extra directory level costs nothing, and migrating now would only re-churn paths and aliases for no real benefit.