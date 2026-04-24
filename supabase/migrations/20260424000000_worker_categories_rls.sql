-- Add missing RLS policies for worker_categories
-- Workers must be able to insert and delete their own category rows.

create policy "Workers can insert own categories"
  on public.worker_categories
  for insert
  with check (auth.uid() = worker_id);

create policy "Workers can delete own categories"
  on public.worker_categories
  for delete
  using (auth.uid() = worker_id);
