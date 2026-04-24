import { describe, it, expect } from "vitest";
import { workerServiceSchema } from "@/lib/validations/worker-service";

const basePayload = {
  title: "Professional Service",
  description: "A very detailed description of the service offered.",
  category_id: "550e8400-e29b-41d4-a716-446655440000",
  is_active: true,
};

describe("workerServiceSchema", () => {
  it("accepts a fully valid payload with negotiation", () => {
    const result = workerServiceSchema.safeParse({
      ...basePayload,
      is_negotiable: true,
      base_price: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects when not negotiable but missing base price", () => {
    const result = workerServiceSchema.safeParse({
      ...basePayload,
      is_negotiable: false,
      base_price: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Base price is required when pricing is not negotiable");
    }
  });

  it("accepts when not negotiable and base price is valid", () => {
    const result = workerServiceSchema.safeParse({
      ...basePayload,
      is_negotiable: false,
      base_price: "49.99",
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative or zero base prices when not negotiable", () => {
    const result = workerServiceSchema.safeParse({
      ...basePayload,
      is_negotiable: false,
      base_price: "-5.00", // Zod coerce number .min(0) catches this first, or the refine catches it
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid titles", () => {
    const result = workerServiceSchema.safeParse({
      ...basePayload,
      title: "a", // min 3
      is_negotiable: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid UUIDs for category", () => {
    const result = workerServiceSchema.safeParse({
      ...basePayload,
      category_id: "invalid-uuid",
      is_negotiable: true,
    });
    expect(result.success).toBe(false);
  });
});
