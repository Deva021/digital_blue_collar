import { z } from "zod";

export const workerCategoriesSchema = z.object({
  categories: z.array(z.string().uuid("Invalid category ID")),
});

export type WorkerCategoriesInput = z.infer<typeof workerCategoriesSchema>;
