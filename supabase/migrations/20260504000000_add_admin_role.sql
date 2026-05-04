-- Migration to add admin role to users

-- 1. Add the column
alter table public.users add column if not exists is_admin boolean default false not null;

-- 2. Create a function to protect the is_admin column from being updated by normal users
create or replace function public.prevent_is_admin_update()
returns trigger as $$
begin
  -- If the user is trying to change the is_admin flag
  if new.is_admin IS DISTINCT FROM old.is_admin then
    -- Check if the current role is an admin or service role.
    -- Supabase API requests run as 'authenticated' or 'anon'.
    if current_setting('role') IN ('authenticated', 'anon') then
      raise exception 'Unauthorized to modify is_admin flag';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

-- 3. Attach the trigger to the users table
drop trigger if exists ensure_is_admin_protected on public.users;
create trigger ensure_is_admin_protected
  before update on public.users
  for each row
  execute procedure public.prevent_is_admin_update();

-- Create a policy allowing users to read their own is_admin flag.
-- Actually, the existing policy "Users can view their own record" on public.users for select already covers this.
