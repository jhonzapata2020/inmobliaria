-- Migration: 20260912000004_fix_profiles_pending_check.sql
-- Description: Update public.profiles role constraint to support 'pending' and enforce 'pending' as default in trigger.

-- 1. Drop old constraint and add updated constraint allowing 'pending'
alter table public.profiles 
drop constraint if exists profiles_role_check;

alter table public.profiles 
add constraint profiles_role_check 
check (role in ('admin', 'inventory_manager', 'legal', 'sales', 'pending'));

-- 2. Update handle_new_user() to always assign 'pending' for new signups
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, is_active, full_name)
  values (
    new.id,
    'pending',
    true,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do update
  set updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
