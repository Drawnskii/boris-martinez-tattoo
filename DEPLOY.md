# Deploy Guide

> This guide covers the **web frontend** (static site). For the **API worker**
> (Cloudflare Workers + D1 + R2), see "API deploy" in [README.md](README.md#production).

## How it works

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds static site, deploys it. All config driven by **GitHub Variables** — no workflow edits needed to change hosting.

Push to `main` triggers deploy. Manual trigger also available via Actions tab.

---

## Step 1 — Set GitHub Variables

Settings > Secrets and Variables > Actions > Variables. Add these:

| Variable | Example (GitHub Pages) | Future (custom domain) |
|---|---|---|
| `PUBLIC_ASTRO_SITE` | `https://<user>.github.io` | `https://boris-martinez-tattoo.com` |
| `PUBLIC_ASTRO_BASE` | `/boris-martinez-tattoo/` | `/` |
| `DEPLOY_TARGET` | `github-pages` | `cloudflare-pages` (or future provider name) |

### What each means

- **`PUBLIC_ASTRO_SITE`** — Canonical site URL. No trailing slash.
- **`PUBLIC_ASTRO_BASE`** — Subpath under the domain. Trailing slash required. Root domain: `/`. GitHub Pages project page: `/repo-name/`.
- **`DEPLOY_TARGET`** — Which provider to deploy to. Workflow picks job matching this value.

---

## Step 2 — Enable GitHub Pages

Repo Settings > Pages > Source: **GitHub Actions**.

---

## Step 3 — Deploy

### Automatic

Push to `main`. Workflow runs, site goes live.

### Manual

Actions tab > "Deploy Boris Martinez Tattoo Web" > **Run workflow**. Optionally override `deploy_target`.

---

## Verify

After deploy completes, visit `https://<user>.github.io/boris-martinez-tattoo/`.

If broken:
- Check workflow run logs for build errors
- Verify `PUBLIC_ASTRO_BASE` matches repo name exactly (case-sensitive, trailing slash)
- Verify GitHub Pages source set to "GitHub Actions"

---

## Add another provider

1. Set `DEPLOY_TARGET` variable to new provider name (e.g. `cloudflare-pages`)
2. Add new deploy job in `.github/workflows/deploy.yml` with matching `if:` condition
3. Add any provider-specific secrets (API tokens) in Settings > Secrets and Variables > Secrets
4. Push. Only new provider job runs.

No existing workflow code changes needed — the `if:` guard skips irrelevant jobs.

---

## Build locally

```bash
pnpm install
pnpm build
pnpm preview
```

Use env vars to test production paths locally:

```powershell
$env:PUBLIC_ASTRO_SITE="https://boris-martinez-tattoo.com"
$env:PUBLIC_ASTRO_BASE="/"
pnpm dev
```
