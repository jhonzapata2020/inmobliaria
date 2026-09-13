-- Migration: 20260912000003_security_remediation_p0_p1.sql
-- Description: Add is_active column to profiles, strip user_metadata role assignment, harden is_admin() function, and fix dossier_items RLS policy.

-- 1. Add is_active column to public.profiles
alter table public.profiles 
add column if not exists is_active boolean not null default true;

-- 2. Update trigger to assign safe default role ('pending') and ignore raw_user_meta_data for roles
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, is_active, full_name)
  values (
    new.id,
    coalesce(new.raw_app_meta_data->>'role', 'pending'),
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

-- 3. Update is_admin() helper to enforce is_active = true and exact authorized inventory roles
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() 
      and is_active = true 
      and role in ('admin', 'inventory_manager', 'legal')
  );
end;
$$ language plpgsql security definer set search_path = public;

-- 4. Harden RLS on dossier_items table
alter table public.dossier_items enable row level security;

drop policy if exists "User dossier access policy" on public.dossier_items;
create policy "User dossier access policy" on public.dossier_items
  for all
  using (
    auth.uid() is not null and user_id = auth.uid()
  );
