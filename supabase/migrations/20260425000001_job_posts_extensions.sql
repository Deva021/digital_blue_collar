-- Add missing columns for Phase 13 Job Posting requirements
alter table public.job_posts
  add column if not exists is_negotiable boolean default false not null,
  add column if not exists workers_needed integer default 1 not null;
