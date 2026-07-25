import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ─────────────────────────────────────────────────────────────────────────────
// Database schema — NOT DESIGNED YET.
//
// Define tables here as `sqliteTable(...)` exports, then run `pnpm db:generate`
// from the repo root to emit a SQL migration into packages/database/migrations.
//
// Entities expected by the architecture (see the stack PDF):
//   - bookings          client name, contact, origin city, style, preferred date
//   - portfolio_images  R2 object key, title, style, tags
//
// Reference template (delete once real tables exist):
// ─────────────────────────────────────────────────────────────────────────────

export const _template = sqliteTable('_template', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  example: text('example').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
