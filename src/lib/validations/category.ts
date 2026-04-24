import { z } from "zod";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const workerCategoriesSchema = z.object({
  categories: z.array(
    z.string().refine((v) => UUID_REGEX.test(v), { message: "Invalid category ID" })
  ),
});

export type WorkerCategoriesInput = z.infer<typeof workerCategoriesSchema>;
