import * as z from "zod";

export const workerProfileSchema = z.object({
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
  can_travel: z.boolean().default(false),
  has_tools: z.boolean().default(false),
  availability_status: z.enum(['available', 'busy', 'offline']).default('available'),
});

export type WorkerProfileValues = z.infer<typeof workerProfileSchema>;
