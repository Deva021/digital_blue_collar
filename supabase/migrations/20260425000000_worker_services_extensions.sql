-- Add missing columns to worker_services based on Phase 11 spec
alter table public.worker_services
add column title text not null default 'Untitled Service',
add column is_active boolean default true not null;

-- Remove the default we just used to backfill existing rows
alter table public.worker_services
alter column title drop default;

-- Add RLS policies so workers can manage their services
create policy "Workers can insert own services"
  on public.worker_services
  for insert
  with check (auth.uid() = worker_id);

create policy "Workers can update own services"
  on public.worker_services
  for update
  using (auth.uid() = worker_id);

create policy "Workers can delete own services"
  on public.worker_services
  for delete
  using (auth.uid() = worker_id);
