import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];

export const verificationSchema = z.object({
  document: z
    .any()
    .refine((file) => file instanceof File, "Document is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported."
    ),
  selfie: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, "Invalid file format")
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png, .webp and .pdf formats are supported."
    ),
});
