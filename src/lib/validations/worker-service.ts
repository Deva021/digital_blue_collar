import { z } from "zod";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const workerServiceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description is too long"),
  category_id: z.string().refine((v) => UUID_REGEX.test(v), { message: "Invalid category selection" }),
  is_negotiable: z.boolean(),
  base_price: z.coerce.number().min(0, "Price cannot be negative").optional().or(z.literal("")),
  is_active: z.boolean(),
}).superRefine((data, ctx) => {
  if (!data.is_negotiable) {
    if (data.base_price === undefined || data.base_price === null || data.base_price === "" || Number(data.base_price) <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Base price is required when pricing is not negotiable",
        path: ["base_price"],
      });
    }
  }
});

export type WorkerServiceInput = z.infer<typeof workerServiceSchema>;
