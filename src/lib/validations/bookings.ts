import { z } from "zod";

export const bookingStatuses = ["pending", "accepted", "in_progress", "completed", "cancelled"] as const;
export type BookingStatus = typeof bookingStatuses[number];

// Zod schema for creating a direct booking
export const directBookingSchema = z.object({
  worker_id: z.string().uuid("Invalid worker ID"),
  worker_service_id: z.string().uuid("Invalid service ID").optional(),
  scheduled_at: z
    .string()
    .min(1, "Scheduled date/time is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Scheduled time must be in the future"),
  location_text: z.string().min(3, "Location must be at least 3 characters"),
  final_price: z.coerce
    .number()
    .positive("Price must be greater than zero"),
});

export type DirectBookingInput = z.infer<typeof directBookingSchema>;

// Zod schema for accepting an application and creating a booking
export const acceptApplicationBookingSchema = z.object({
  application_id: z.string().uuid("Invalid application ID"),
  scheduled_at: z
    .string()
    .min(1, "Scheduled date/time is required")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, "Scheduled time must be in the future"),
  location_text: z.string().min(3, "Location must be at least 3 characters"),
});

export type AcceptApplicationBookingInput = z.infer<typeof acceptApplicationBookingSchema>;

// Zod schema for status transitions
export const bookingStatusUpdateSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  new_status: z.enum(bookingStatuses),
});

export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
