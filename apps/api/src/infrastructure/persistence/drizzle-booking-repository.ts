import { createDb, type Db } from '@boris-martinez-tattoo/database';
import type { Booking, BookingRepository } from '@domain/booking/booking';

/**
 * Drizzle + D1 implementation of the booking persistence port.
 *
 * TODO(persistence): the database schema is not designed yet
 * (packages/database/src/schema). Once the `bookings` table exists and
 * migrations are applied, replace the placeholder body with:
 *
 *   await this.db.insert(bookings).values({ ...booking }).run();
 */
export class DrizzleBookingRepository implements BookingRepository {
  private readonly db: Db;

  constructor(d1: D1Database) {
    this.db = createDb(d1);
  }

  async save(booking: Booking): Promise<void> {
    console.info('[booking] persist pending schema', {
      city: booking.city,
      style: booking.style,
      preferredDate: booking.preferredDate,
      db: Boolean(this.db),
    });
  }
}
