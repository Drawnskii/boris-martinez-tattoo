import { bookingRequestSchema } from '@boris-martinez-tattoo/core';
import type {
  AppointmentCalendar,
  Booking,
  BookingRepository,
} from '@domain/booking/booking';

export type CreateBookingResult =
  | { ok: true }
  | { ok: false; issues: unknown[] };

/**
 * Use case: register a booking request.
 * Validates the transport payload (shared Zod schema), then persists the
 * booking and schedules the appointment.
 */
export class CreateBooking {
  constructor(
    private readonly deps: {
      bookings: BookingRepository;
      calendar: AppointmentCalendar;
    },
  ) {}

  async execute(input: unknown): Promise<CreateBookingResult> {
    const parsed = bookingRequestSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, issues: parsed.error.issues };
    }

    const booking: Booking = { ...parsed.data };
    await this.deps.bookings.save(booking);
    await this.deps.calendar.createEvent(booking);
    return { ok: true };
  }
}
