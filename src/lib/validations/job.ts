import { z } from "zod";

export const jobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category_id: z.string().min(1, "Please select a valid category"),
  location_text: z.string().min(2, "Please enter a valid location").max(100),
  budget_range: z.string().optional(),
  is_negotiable: z.boolean(),
  workers_needed: z.number().min(1, "At least 1 worker is required").max(100, "Maximum 100 workers allowed"),
});

export type JobPostFormValues = z.infer<typeof jobPostSchema>;
