-- Add logistics columns required by Phase 8: Worker Profile

alter table public.worker_profiles
add column if not exists can_travel boolean default false,
add column if not exists has_tools boolean default false;
