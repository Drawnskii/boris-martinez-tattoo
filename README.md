# Pole Tattoo Website

Monorepo for the Pole Tattoo website. The frontend is an [Astro](https://astro.build) + TypeScript app; a backend service will be added in later iterations alongside it. Everything is managed with [pnpm](https://pnpm.io) workspaces.

---

## Table of contents

1. [Monorepo architecture](#monorepo-architecture)
2. [Astro project architecture (`apps/web`)](#astro-project-architecture-appsweb)
3. [Design system (Tailwind v4)](#design-system-tailwind-v4)
4. [Using pnpm](#using-pnpm)
5. [Linting & type-checking](#linting--type-checking)
6. [Editor setup (VS Code)](#editor-setup-vs-code)
7. [Development mode](#development-mode)
8. [Production](#production)
9. [`apps/web` vs. `web` at the root](#appsweb-vs-web-at-the-root)

---

## Monorepo architecture

The repository uses **pnpm workspaces**. The root directory is the *workspace owner*; each sub-folder is an independent *workspace package* with its own `package.json`.

```
pole-tattoo-website/
├── package.json            # private root — workspace-level scripts only
├── pnpm-workspace.yaml     # workspace globs: apps/* and packages/*
├── pnpm-lock.yaml          # single shared lockfile
├── .gitignore
├── .vscode/                # committed editor config (see Editor setup)
├── apps/
│   └── web/                # @pole-tattoo/web — the Astro frontend
└── packages/               # (reserved) shared libraries consumed by several apps
```

- **`apps/*`** — deployable applications. The Astro site lives here now; the future backend will join it as `apps/api`.
- **`packages/*`** — non-deployable shared libraries (utilities, shared types, UI primitives) consumed by apps through the `workspace:` protocol.

### Rules of the monorepo

- The root `package.json` is `private: true` — it is never published.
- Every workspace package is scoped under `@pole-tattoo/` (e.g. `@pole-tattoo/web`) to avoid name clashes on npm.
- There is **one** `pnpm-lock.yaml` at the root for the whole monorepo — never commit lockfiles inside individual apps.

### Workspace-level scripts (run from the repo root)

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the web app in development mode |
| `pnpm build` | Build every workspace app |
| `pnpm preview` | Preview the web production build locally |
| `pnpm lint` | Lint every workspace |
| `pnpm check` | Type-check every workspace (`astro check`) |

### Adding the backend later

```bash
mkdir apps/api
pnpm --filter "@pole-tattoo/api" init      # or cd apps/api && pnpm init, then name it @pole-tattoo/api
pnpm install                                # from the root — re-links the workspace
```

### Adding a shared library consumed by both apps

```bash
pnpm create ./packages/core                 # name it @pole-tattoo/core
pnpm --filter @pole-tattoo/web  add @pole-tattoo/core --workspace
pnpm --filter @pole-tattoo/api  add @pole-tattoo/core --workspace
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
├── layouts/          # Presentation — page layouts
├── components/       # Presentation — reusable UI components (.astro)
├── application/     # Application — use cases / services that orchestrate domain logic
├── domain/          # Domain — entities, value objects, repository *interfaces*, business rules. No framework deps.
├── infrastructure/ # Infrastructure — adapters: HTTP clients, CMS/API repositories implementing the domain interfaces
└── config/          # Site / app configuration constants
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

## Design system (Tailwind v4)

The web app ships with **Tailwind CSS v4** wired through its official Vite plugin — the recommended integration for Astro 7. There is no `tailwind.config.js`: every token lives in `@theme` blocks inside a single stylesheet, so the design system is pure CSS.

```
apps/web/
├── astro.config.mjs        # registers @tailwindcss/vite
└── src/
    ├── styles/global.css   # ← the whole design system (theme + base layer)
    ├── layouts/BaseLayout.astro   # imports global.css; <slot/> for pages
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

Everything below is the default, computed in **OKLCH** (`oklch(L C H)`). To re-skin the site you only change the values in `src/styles/global.css`; no other file needs editing because Tailwind regenerates the utilities from the variables.

| Group | Token prefix | What it produces |
| --- | --- | --- |
| Color scales (50→950, 11 steps each) | `--color-primary-*` `--color-secondary-*` `--color-tertiary-*` `--color-surface-*` | `bg-primary-500`, `text-secondary-700`, `border-tertiary-200`, … |
| Semantic aliases | `--color-background` · `--color-foreground` · `--color-muted` · `--color-muted-foreground` · `--color-border` · `--color-ring` | `bg-background`, `text-muted-foreground`, `border-border`, `ring-*` |
| Fonts | `--font-primary` · `--font-secondary` | `font-primary` (UI / body), `font-secondary` (display headings) |
| Font sizes (with line-heights) | `--text-2xs` … `--text-9xl` + `--text-2xs--line-height` … | `text-2xs`, `text-sm`, `text-3xl`, … |
| Border radius | `--radius-none` · `--radius-xs` … `--radius-4xl` · `--radius-full` | `rounded-sm`, `rounded-xl`, `rounded-full`, … |
| Spacing multiplier | `--spacing` (default `0.25rem`) | every `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` step |
| Breakpoints | `--breakpoint-sm` … `--breakpoint-2xl` | `sm:`, `md:`, `lg:`, `xl:`, `2xl:` |

#### Color scales

Each scale has 11 steps, authored in OKLCH. The defaults are placeholders chosen to look right out of the box — adjust the three hue angles to rebrand:

| Scale | Default direction | Hue |
| --- | --- | --- |
| `primary` | deep crimson "ink" | ≈ 25 |
| `secondary` | cool slate / steel blue | ≈ 230 |
| `tertiary` | amber / gold highlight | ≈ 85 |
| `surface` | warm graphite neutral ramp | ≈ 240 |

Each color is written as `oklch(<lightness> <chroma> <hue>)`. To shift a brand color without redesigning the ramp, change only the `<hue>` numbers across the 11 steps; the lightness/chroma progression stays consistent. A handy reference for the math: <https://oklch.com/>.

The semantic aliases map onto `surface-*` and `primary-500`:

```css
--color-background:        var(--color-surface-50);
--color-foreground:       var(--color-surface-900);
--color-muted:            var(--color-surface-200);
--color-muted-foreground: var(--color-surface-600);
--color-border:           var(--color-surface-200);
--color-ring:             var(--color-primary-500);
```

Prefer semantic tokens (`bg-background`, `text-muted-foreground`) over raw scale steps in components — they are the single point of change when a dark/light theme is added later.

#### Fonts

Two families are exposed:

- `font-primary` — UI / body. Default stack starts with `InterVariable` / `Inter` and falls back to the system sans stack.
- `font-secondary` — display / headings. Default stack starts with `Fraunces` / `Playfair Display` and falls back to a serif stack.

Neither font is loaded yet — install them when the typography is finalised (self-host via `@fontsource`/`@fontsource-variable` is recommended), then update the stacks in `--font-primary` / `--font-secondary`. Headings automatically use the secondary font through the `@layer base` rule in `global.css` (`h1`–`h6 { font-family: var(--font-secondary); }`).

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

Edit any `--text-<step>` / `--text-<step>--line-height` pair to retune the type scale; the matching `text-<step>` utility and its default line-height update automatically.

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

### Using the design system in a component

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout>
  <section class="rounded-xl border border-border bg-background p-6">
    <h2 class="font-secondary text-2xl text-foreground">Heading</h2>
    <p class="mt-2 text-sm text-muted-foreground">Body text…</p>
    <button class="mt-4 inline-flex items-center rounded-lg
                   bg-primary-600 px-4 py-2 text-white
                   hover:bg-primary-500 transition focus-visible:ring-2">
      Action
    </button>
  </section>
</BaseLayout>
```

### Previewing the tokens

`src/pages/index.astro` already renders a small swatch + type + radius preview using the live tokens — run `pnpm dev` and open <http://localhost:4321> to see the scales, type scale, radius scale and both fonts together. Re-tune values in `src/styles/global.css` and the page hot-reloads.

### Verifying the build

```bash
pnpm --filter @pole-tattoo/web check   # type checks .astro + .ts
pnpm --filter @pole-tattoo/web build    # compiles Tailwind v4 + Astro → dist/
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

Use `--filter <package-name>`. The package name is the `name` field in that app's `package.json` (`@pole-tattoo/web`):

```bash
pnpm --filter @pole-tattoo/web add astro-icon       # add a dependency to web only
pnpm --filter @pole-tattoo/web exec astro --version # run a binary *inside* the web workspace
pnpm --filter @pole-tattoo/web dev                   # run only the web dev script
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
pnpm --filter @pole-tattoo/web lint --fix  # auto-fix lint issues in web
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

Astro's dev server starts at <http://localhost:4321> with hot reload. Two optional environment variables control the site URL / base path (useful for matching your production deployment):

```bash
# PowerShell
$env:PUBLIC_ASTRO_SITE="https://pole-tatto.example.com"; $env:PUBLIC_ASTRO_BASE="/"; pnpm dev

# macOS / Linux
PUBLIC_ASTRO_SITE="https://pole-tatto.example.com" PUBLIC_ASTRO_BASE="/" pnpm dev
```

---

## Production

The web app builds to a **fully static site**.

```bash
pnpm build      # outputs static files to apps/web/dist/
pnpm preview     # serve that build locally to verify it before deploying
```

### Deploy

`apps/web/dist/` is plain HTML/CSS/JS — host it on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3 + CDN, …).

Configure your host with:

| Setting | Value |
| --- | --- |
| Build command | `pnpm --filter @pole-tattoo/web build` |
| Output / publish directory | `apps/web/dist` |
| Node version | `22.12` or newer |

### GitHub Pages (project page under a subpath)

If the site is served from `https://<user>.github.io/pole-tatto-website/`, set the base path at build time:

```bash
# PowerShell
$env:PUBLIC_ASTRO_BASE="/pole-tatto-website/"; pnpm --filter @pole-tattoo/web build

# macOS / Linux
PUBLIC_ASTRO_BASE="/pole-tatto-website/" pnpm --filter @pole-tattoo/web build
```

Then publish the contents of `apps/web/dist/` (e.g. to the `gh-pages` branch or via GitHub Actions).

---

## `apps/web` vs. `web` at the root

You asked whether `apps/web/` (current) should be flattened to `pole-tattoo-website/web/`. **Keep `apps/web`.**

- A backend is coming. `apps/web` + `apps/api` keeps every deployable under one predictable folder, while a flat layout ends up mixing apps with shared packages at the root.
- `packages/*` is already wired for shared libraries both apps will consume; the `apps/` + `packages/` split is the convention pnpm and Turbo/Nx expect, so tooling and contributors recognise it instantly.
- The single extra directory level costs nothing, and migrating now would only re-churn paths and aliases for no real benefit.