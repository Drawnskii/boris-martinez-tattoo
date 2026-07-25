import { defineConfig } from 'drizzle-kit';

// Schema-first workflow:
//   1. Define/edit tables in src/schema/
//   2. `pnpm db:generate` (from repo root) → SQL migration in ./migrations
//   3. Apply with wrangler from apps/api:
//      `pnpm --filter @boris-martinez-tattoo/api db:migrate:local`   (dev)
//      `pnpm --filter @boris-martinez-tattoo/api db:migrate:remote`  (prod)
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/schema/index.ts',
  out: './migrations',
});
