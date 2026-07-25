import { Hono } from 'hono';
import type { Bindings } from '@config/env';
import { CreateBooking } from '@application/bookings/create-booking';
import { DrizzleBookingRepository } from '@infrastructure/persistence/drizzle-booking-repository';
import { GoogleAppointmentCalendar } from '@infrastructure/calendar/google-appointment-calendar';

export const bookingRoutes = new Hono<{ Bindings: Bindings }>().post(
  '/',
  async (c) => {
    const useCase = new CreateBooking({
      bookings: new DrizzleBookingRepository(c.env.DB),
      calendar: new GoogleAppointmentCalendar({
        calendarId: c.env.GOOGLE_CALENDAR_ID,
        serviceAccountKey: c.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      }),
    });

    const body = await c.req.json().catch(() => null);
    const result = await useCase.execute(body);

    if (!result.ok) {
      return c.json({ error: 'validation_failed', issues: result.issues }, 422);
    }
    return c.json({ status: 'received' }, 202);
  },
);
