import type { AppointmentCalendar, Booking } from '@domain/booking/booking';

/**
 * Google Calendar API implementation of the scheduling port.
 *
 * TODO(calendar): sign a JWT with the service-account key, exchange it for an
 * access token and call `calendar.events.insert`. Until then bookings are
 * logged only — no event is created.
 */
export class GoogleAppointmentCalendar implements AppointmentCalendar {
  constructor(
    private readonly creds: { calendarId: string; serviceAccountKey: string },
  ) {}

  async createEvent(booking: Booking): Promise<void> {
    console.info('[calendar] event pending integration', {
      calendarId: Boolean(this.creds.calendarId),
      key: Boolean(this.creds.serviceAccountKey),
      preferredDate: booking.preferredDate,
      clientName: booking.clientName,
    });
  }
}
