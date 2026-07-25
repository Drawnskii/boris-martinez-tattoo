/**
 * Domain — Booking entity and the ports it needs.
 * No framework, Hono, Drizzle or Cloudflare imports allowed in this layer.
 */
export interface Booking {
  clientName: string;
  email: string;
  phone?: string;
  city: string;
  style: string;
  preferredDate: string;
  notes?: string;
}

/** Persistence port — implemented in infrastructure (Drizzle + D1). */
export interface BookingRepository {
  save(booking: Booking): Promise<void>;
}

/** Scheduling port — implemented in infrastructure (Google Calendar API). */
export interface AppointmentCalendar {
  createEvent(booking: Booking): Promise<void>;
}
