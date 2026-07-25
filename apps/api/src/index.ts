import { Hono } from 'hono';
import type { Bindings } from '@config/env';
import { healthRoutes } from '@presentation/routes/health';
import { bookingRoutes } from '@presentation/routes/bookings';

const app = new Hono<{ Bindings: Bindings }>();

app.route('/api/health', healthRoutes);
app.route('/api/bookings', bookingRoutes);

// TODO(admin): invisible admin panel — Hono JSX SSR behind `/${ADMIN_PATH}`,
// encrypted HTTP-only session cookie, 404 for any unauthorized request.
// See the stack PDF, section "Advanced Security: The Invisible Admin Panel".

export default app;
