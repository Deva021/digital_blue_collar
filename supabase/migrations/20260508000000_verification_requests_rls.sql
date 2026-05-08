-- Create RLS policies for verification_requests

-- Workers can insert their own verification requests
create policy "Workers can insert own verification requests"
on public.verification_requests
for insert
with check (auth.uid() = worker_id);

-- Workers can view their own verification requests
create policy "Workers can view own verification requests"
on public.verification_requests
for select
using (auth.uid() = worker_id);

-- Workers can update their own verification requests
create policy "Workers can update own verification requests"
on public.verification_requests
for update
using (auth.uid() = worker_id);
