import { describe, it, expect } from 'vitest';
import { workerProfileSchema } from '../../../src/lib/validations/worker';

describe('Worker Profile Zod Schema Validation', () => {
  it('should accept a valid minimal worker profile', () => {
    const validData = {
      bio: 'I am a highly experienced tradesperson.',
      location_text: 'Central Addis Ababa',
    };
    
    const result = workerProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.can_travel).toBe(false); // default
      expect(result.data.availability_status).toBe('available'); // default
    }
  });

  it('should reject bios that are too short', () => {
    const invalidData = {
      bio: 'Short',
      location_text: 'Bole',
    };
    
    const result = workerProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.bio?.[0]).toContain('at least 10 characters');
    }
  });

  it('should reject locations that are too short', () => {
    const invalidData = {
      bio: 'I am an exceptionally skilled professional working in the city.',
      location_text: 'A',
    };
    
    const result = workerProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.location_text?.[0]).toContain('at least 2 characters');
    }
  });

  it('should successfully parse complete logistical overrides', () => {
    const fullData = {
      bio: 'Skilled electrical engineer available for full residential rewiring.',
      location_text: 'Piassa, Addis Ababa',
      can_travel: true,
      has_tools: true,
      availability_status: 'busy'
    };

    const result = workerProfileSchema.safeParse(fullData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.can_travel).toBe(true);
      expect(result.data.has_tools).toBe(true);
      expect(result.data.availability_status).toBe('busy');
    }
  });
});
