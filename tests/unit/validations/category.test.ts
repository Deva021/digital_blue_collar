import { describe, it, expect } from "vitest";
import { workerCategoriesSchema } from "@/lib/validations/category";

const validUUID = () => "550e8400-e29b-41d4-a716-446655440000";

describe("workerCategoriesSchema", () => {
  it("accepts a valid array of UUIDs", () => {
    const result = workerCategoriesSchema.safeParse({
      categories: [validUUID(), "6ba7b810-9dad-11d1-80b4-00c04fd430c8"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty categories array", () => {
    const result = workerCategoriesSchema.safeParse({ categories: [] });
    expect(result.success).toBe(true);
  });

  it("rejects non-UUID strings", () => {
    const result = workerCategoriesSchema.safeParse({
      categories: ["not-a-uuid"],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("Invalid category ID");
    }
  });

  it("rejects a mix of valid and invalid UUIDs", () => {
    const result = workerCategoriesSchema.safeParse({
      categories: [validUUID(), "invalid-uuid"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects if categories field is missing", () => {
    const result = workerCategoriesSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects non-array categories", () => {
    const result = workerCategoriesSchema.safeParse({
      categories: validUUID(),
    });
    expect(result.success).toBe(false);
  });
});
