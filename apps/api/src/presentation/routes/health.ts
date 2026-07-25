import { Hono } from 'hono';
import type { Bindings } from '@config/env';

export const healthRoutes = new Hono<{ Bindings: Bindings }>().get('/', (c) =>
  c.json({ status: 'ok' }),
);
