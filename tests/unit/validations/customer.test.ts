import { describe, it, expect } from 'vitest';
import { customerProfileSchema } from '../../../src/lib/validations/customer';

describe('Customer Profile Zod Schema Validation', () => {
  it('should accept a valid minimal customer profile', () => {
    const validData = {
      location_text: 'Central Addis Ababa',
    };
    
    const result = customerProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject locations that are too short', () => {
    const invalidData = {
      location_text: 'A',
    };
    
    const result = customerProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.location_text?.[0]).toContain('at least 2 characters');
    }
  });

  it('should reject structurally missing location boundaries', () => {
    const invalidData = {}; // location missing
    
    const result = customerProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
