import * as z from "zod";

export const customerProfileSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }).max(100, {
    message: "Full name cannot exceed 100 characters."
  }),
  location_text: z.string().min(2, {
    message: "Location must be at least 2 characters long.",
  }).max(100, {
    message: "Location cannot exceed 100 characters."
  }),
  contact_phone: z.string().max(20).optional().or(z.literal('')),
  contact_address: z.string().max(200).optional().or(z.literal('')),
  contact_notes: z.string().max(500).optional().or(z.literal('')),
});

export type CustomerProfileValues = z.infer<typeof customerProfileSchema>;
