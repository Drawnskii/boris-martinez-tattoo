/**
 * Worker environment bindings (wrangler.toml + secrets).
 * Non-secrets live under `[vars]`; secrets via `.dev.vars` / `wrangler secret put`.
 */
export type Bindings = {
  /** D1 database — bookings, portfolio metadata, analytics. */
  DB: D1Database;
  /** R2 bucket — high-resolution portfolio images. */
  PORTFOLIO_BUCKET: R2Bucket;
  /** Unguessable admin route segment (var). */
  ADMIN_PATH: string;
  /** Secret encrypting the admin session cookie. */
  SESSION_SECRET: string;
  /** Google Calendar API (secrets). */
  GOOGLE_CALENDAR_ID: string;
  GOOGLE_SERVICE_ACCOUNT_KEY: string;
};
