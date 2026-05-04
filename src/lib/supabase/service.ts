import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with the service role key.
 * This client bypasses Row Level Security (RLS).
 * 
 * IMPORTANT: This must ONLY be used in server-side environments (Server Actions, API Routes)
 * and MUST be gated behind administrative authorization checks (e.g., requireAdmin()).
 */
export function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Ensure it is set in your environment variables.')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
