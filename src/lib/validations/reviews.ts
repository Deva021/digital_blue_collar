import { z } from "zod";

export const reviewSchema = z.object({
  booking_id: z.string().uuid("Invalid booking ID"),
  reviewee_id: z.string().uuid("Invalid worker ID"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .int("Rating must be a whole number"),
  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val)),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export type Review = {
  id: string;
  booking_id: string;
  reviewee_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  customer_profiles?: {
    id: string;
    location_text: string | null;
  } | null;
};
