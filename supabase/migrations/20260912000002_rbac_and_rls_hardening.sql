-- Migration: 20260912000002_rbac_and_rls_hardening.sql
-- Description: Implement strict RBAC with public profiles, security definer functions, RLS hardening, and relational dossier schema.

-- 1. Profiles Table for RBAC
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'sales' check (role in ('admin', 'inventory_manager', 'legal', 'sales')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_app_meta_data->>'role', new.raw_user_meta_data->>'role', 'sales'),
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

-- 2. Security Definer Helper for Role Verification
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'inventory_manager', 'legal')
  );
end;
$$ language plpgsql security definer set search_path = public;

-- 3. Row Level Security Hardening for Properties
alter table public.properties enable row level security;

drop policy if exists "Public read published properties" on public.properties;
drop policy if exists "Public properties read policy" on public.properties;
create policy "Public properties read policy" on public.properties
  for select
  to anon, authenticated
  using (editorial_status = 'published' and availability != 'Archivado');

drop policy if exists "Admin full access properties" on public.properties;
drop policy if exists "Admin properties access policy" on public.properties;
create policy "Admin properties access policy" on public.properties
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Row Level Security Hardening for CRM Leads
alter table public.crm_leads enable row level security;

drop policy if exists "Admin full access crm_leads" on public.crm_leads;
drop policy if exists "Admin crm_leads access policy" on public.crm_leads;
create policy "Admin crm_leads access policy" on public.crm_leads
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- 5. Relational Dossier Items Schema
create table if not exists public.dossier_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  property_id uuid not null references public.properties(id) on delete cascade,
  notes text,
  created_at timestamptz not null default now(),
  constraint dossier_user_or_session check (user_id is not null or session_id is not null)
);

alter table public.dossier_items enable row level security;

drop policy if exists "User dossier access policy" on public.dossier_items;
create policy "User dossier access policy" on public.dossier_items
  for all
  using (
    (auth.uid() is not null and user_id = auth.uid()) or
    (session_id is not null)
  );
