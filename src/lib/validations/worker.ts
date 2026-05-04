import * as z from "zod";

export const workerProfileSchema = z.object({
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }).max(100, {
    message: "Full name cannot exceed 100 characters."
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }).max(1000, {
    message: "Bio cannot exceed 1000 characters."
  }),
  location_text: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }).max(100, {
    message: "Location cannot exceed 100 characters."
  }),
  contact_phone: z.string().max(20).optional().or(z.literal('')),
  contact_address: z.string().max(200).optional().or(z.literal('')),
  contact_notes: z.string().max(500).optional().or(z.literal('')),
  can_travel: z.boolean().default(false),
  has_tools: z.boolean().default(false),
  availability_status: z.enum(['available', 'busy', 'offline']).default('available'),
});

export type WorkerProfileValues = z.infer<typeof workerProfileSchema>;
