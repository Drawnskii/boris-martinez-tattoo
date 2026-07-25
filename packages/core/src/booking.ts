import { z } from 'zod';

/**
 * Public booking request payload — contract shared by the web frontend
 * (`apps/web`) and the API (`apps/api`). Validation happens server-side;
 * the frontend may reuse this schema for early form feedback.
 */
export const bookingRequestSchema = z.object({
  clientName: z.string().min(1).max(120),
  email: z.email(),
  phone: z.string().min(5).max(40).optional(),
  /** Customer origin city — recorded for business analytics. */
  city: z.string().min(1).max(120),
  /** Tattoo style requested (free text until a style catalog exists). */
  style: z.string().min(1).max(120),
  /** ISO date (YYYY-MM-DD) of the preferred appointment day. */
  preferredDate: z.iso.date(),
  notes: z.string().max(2000).optional(),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;
