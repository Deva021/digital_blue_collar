-- RLS Policies for job_applications

-- 1. Workers can view their own applications
create policy "Workers can view own applications" on public.job_applications
  for select using (auth.uid() = worker_id);

-- 2. Job owners (customers) can view applications received for their jobs
create policy "Customers can view applications for their jobs" on public.job_applications
  for select using (
    exists (
      select 1 from public.job_posts
      where id = job_applications.job_post_id
      and customer_id = auth.uid()
    )
  );

-- 3. Workers can submit applications (must be the worker themselves)
create policy "Workers can insert applications" on public.job_applications
  for insert with check (auth.uid() = worker_id);

-- 4. Job owners (customers) can update application status (accept/reject)
create policy "Customers can update applications for their jobs" on public.job_applications
  for update using (
    exists (
      select 1 from public.job_posts
      where id = job_applications.job_post_id
      and customer_id = auth.uid()
    )
  );
