import * as z from "zod";

export const customerProfileSchema = z.object({
  location_text: z.string().min(2, {
    message: "Location must be at least 2 characters long.",
  }).max(100, {
    message: "Location cannot exceed 100 characters."
  }),
});

export type CustomerProfileValues = z.infer<typeof customerProfileSchema>;
