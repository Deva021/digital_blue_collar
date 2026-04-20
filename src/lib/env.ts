import { z } from "zod";

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Anon key is required"),
  
  // Server-side only (Optional for generic dev, required for certain operations)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Database Connection
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
});

// Since Next.js exposes NEXT_PUBLIC variables selectively to the client, 
// we only validate them when this file is evaluated (typically server-side or during build).
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  throw new Error("Invalid environment variables. Please check your .env file.");
}

export const env = _env.data;
