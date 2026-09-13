-- Migration: 20260913000001_fix_public_properties_visibility.sql
-- Description: Harden RLS policies on public.properties ensuring explicit public read access for published non-archived properties.

-- 1. Enable RLS on public.properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 2. Drop obsolete or conflicting public read policies
DROP POLICY IF EXISTS "Public read published properties" ON public.properties;
DROP POLICY IF EXISTS "Public properties read policy" ON public.properties;

-- 3. Create explicit public read policy for anon and authenticated users
CREATE POLICY "Public properties read policy"
ON public.properties
FOR SELECT
TO anon, authenticated
USING (
  editorial_status = 'published'
  AND availability <> 'Archivado'
);

-- 4. Ensure admin full access policy remains protected
DROP POLICY IF EXISTS "Admin full access properties" ON public.properties;
DROP POLICY IF EXISTS "Admin properties access policy" ON public.properties;

CREATE POLICY "Admin properties access policy"
ON public.properties
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
