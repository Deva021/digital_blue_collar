-- Migration: Profile Refinement
-- Description: Adds full_name and contact fields to worker and customer profiles for identity and post-booking coordination.

-- Add columns to public.worker_profiles
ALTER TABLE public.worker_profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS contact_address text,
ADD COLUMN IF NOT EXISTS contact_notes text;

-- Add columns to public.customer_profiles
ALTER TABLE public.customer_profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS contact_address text,
ADD COLUMN IF NOT EXISTS contact_notes text;

-- Update RLS policies if necessary (they are already set to 'all' for owners, which is sufficient)
-- create policy "Workers can update own profile" on public.worker_profiles for all using (auth.uid() = id);
-- create policy "Customers can update own profile" on public.customer_profiles for all using (auth.uid() = id);
