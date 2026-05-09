-- Migration to add ban capabilities for users and suspension for job posts

-- 1. Add columns to users table
alter table public.users
  add column if not exists is_banned boolean default false not null,
  add column if not exists banned_until timestamptz,
  add column if not exists ban_reason text;

-- 2. Add columns to job_posts table
alter table public.job_posts
  add column if not exists is_suspended boolean default false not null,
  add column if not exists suspension_reason text;

-- 3. Update job_posts RLS policy to hide suspended jobs
-- We assume the old policy name was "Public job posts"
drop policy if exists "Public job posts" on public.job_posts;

create policy "Public job posts" on public.job_posts 
  for select using (is_suspended = false);

-- Note: We do not need a public policy for users' ban status specifically because 
-- "Users can view their own record" already lets them see their own fields, 
-- and "Public worker profiles" allows viewing worker info without needing the users table.
-- Admins will bypass RLS using the service role key.
