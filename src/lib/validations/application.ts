import { z } from "zod";

export const applicationSchema = z.object({
  job_id: z.string().uuid("Invalid job ID"),
  application_message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
  proposed_price: z.coerce.number().positive("Proposed price must be greater than zero"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
