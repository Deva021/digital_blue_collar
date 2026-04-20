-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "moddatetime" schema extensions;

-- T001: Enums
create type availability_status as enum ('available', 'busy', 'offline');
create type application_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type booking_status as enum ('pending', 'accepted', 'in_progress', 'completed', 'cancelled');
create type job_status as enum ('open', 'in_progress', 'closed', 'cancelled');
create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');

-- T003: service_categories
create table public.service_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  parent_id uuid references public.service_categories(id) on delete restrict,
  is_active boolean default true not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.service_categories
  for each row execute procedure moddatetime (updated_at);

-- T004: users
-- Note: Supabase auth.users is automatically managed by Supabase Auth.
-- This is a public proxy for application relation mapping.
create table public.users (
  id uuid primary key, -- should match auth.users ID
  email text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.users
  for each row execute procedure moddatetime (updated_at);

-- T005: worker_profiles
create table public.worker_profiles (
  id uuid references public.users(id) on delete cascade primary key,
  bio text,
  availability_status availability_status default 'offline' not null,
  location_text text,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.worker_profiles
  for each row execute procedure moddatetime (updated_at);

-- T006: customer_profiles
create table public.customer_profiles (
  id uuid references public.users(id) on delete cascade primary key,
  location_text text,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.customer_profiles
  for each row execute procedure moddatetime (updated_at);

-- T007: worker_categories
create table public.worker_categories (
  worker_id uuid references public.worker_profiles(id) on delete cascade,
  category_id uuid references public.service_categories(id) on delete restrict,
  created_at timestamptz default now() not null,
  primary key (worker_id, category_id)
);

-- T008: worker_services
create table public.worker_services (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.worker_profiles(id) on delete cascade not null,
  category_id uuid references public.service_categories(id) on delete restrict not null,
  base_price numeric(10, 2),
  is_negotiable boolean default true not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.worker_services
  for each row execute procedure moddatetime (updated_at);

-- T009: job_posts
create table public.job_posts (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.customer_profiles(id) on delete cascade not null,
  category_id uuid references public.service_categories(id) on delete restrict not null,
  title text not null,
  description text not null,
  location_text text,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  budget_range text,
  status job_status default 'open' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.job_posts
  for each row execute procedure moddatetime (updated_at);

-- T010: job_applications
create table public.job_applications (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.worker_profiles(id) on delete cascade not null,
  job_post_id uuid references public.job_posts(id) on delete cascade not null,
  proposed_price numeric(10, 2),
  message text,
  status application_status default 'pending' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(worker_id, job_post_id)
);

create trigger handle_updated_at before update on public.job_applications
  for each row execute procedure moddatetime (updated_at);

-- T011: bookings
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.customer_profiles(id) on delete cascade not null,
  worker_id uuid references public.worker_profiles(id) on delete cascade not null,
  job_post_id uuid references public.job_posts(id) on delete set null,
  worker_service_id uuid references public.worker_services(id) on delete set null,
  final_price numeric(10, 2),
  scheduled_at timestamptz not null,
  status booking_status default 'pending' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.bookings
  for each row execute procedure moddatetime (updated_at);

-- T012: reviews
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  booking_id uuid references public.bookings(id) on delete cascade not null,
  reviewer_id uuid references public.customer_profiles(id) on delete cascade not null,
  reviewee_id uuid references public.worker_profiles(id) on delete cascade not null,
  rating smallint check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(booking_id)
);

create trigger handle_updated_at before update on public.reviews
  for each row execute procedure moddatetime (updated_at);

-- T013: verification_requests
create table public.verification_requests (
  id uuid default gen_random_uuid() primary key,
  worker_id uuid references public.worker_profiles(id) on delete cascade not null,
  status verification_status default 'pending' not null,
  document_url text not null,
  admin_notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger handle_updated_at before update on public.verification_requests
  for each row execute procedure moddatetime (updated_at);

-- T014: notifications
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  body text,
  is_read boolean default false not null,
  payload jsonb,
  created_at timestamptz default now() not null
);

-- T019: Indexes
create index idx_service_categories_parent on public.service_categories(parent_id);
create index idx_worker_profiles_search on public.worker_profiles(availability_status, location_text);
create index idx_job_posts_search on public.job_posts(status, category_id, location_text);
create index idx_job_applications_worker on public.job_applications(worker_id);
create index idx_job_applications_job on public.job_applications(job_post_id);
create index idx_bookings_customer on public.bookings(customer_id);
create index idx_bookings_worker on public.bookings(worker_id);
create index idx_notifications_user on public.notifications(user_id, is_read);

-- T018: RLS Base Policies
alter table public.service_categories enable row level security;
alter table public.users enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.worker_categories enable row level security;
alter table public.worker_services enable row level security;
alter table public.job_posts enable row level security;
alter table public.job_applications enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.verification_requests enable row level security;
alter table public.notifications enable row level security;

-- Basic MVP permissive select for public categories
create policy "Anyone can see active categories" on public.service_categories for select using (is_active = true);
-- Users can see their own profile
create policy "Users can view their own record" on public.users for select using (auth.uid() = id);
create policy "Public worker profiles" on public.worker_profiles for select using (true);
create policy "Public customer profiles" on public.customer_profiles for select using (true);
create policy "Public worker categories" on public.worker_categories for select using (true);
create policy "Public worker services" on public.worker_services for select using (true);
create policy "Public job posts" on public.job_posts for select using (true);

-- Common mutation policies (owner bounded)
create policy "Users can update own record" on public.users for update using (auth.uid() = id);
create policy "Workers can update own profile" on public.worker_profiles for all using (auth.uid() = id);
create policy "Customers can update own profile" on public.customer_profiles for all using (auth.uid() = id);

create policy "Customers can modify own custom jobs" on public.job_posts for all using (auth.uid() = customer_id);
create policy "Users can access their bookings" on public.bookings for all using (auth.uid() = worker_id or auth.uid() = customer_id);
create policy "Users can access their reviews" on public.reviews for select using (true);
create policy "Users can modify notifications" on public.notifications for all using (auth.uid() = user_id);
