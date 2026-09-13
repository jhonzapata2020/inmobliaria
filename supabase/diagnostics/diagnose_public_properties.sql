-- Diagnostic Script: supabase/diagnostics/diagnose_public_properties.sql
-- Purpose: Inspect and verify state of public.properties table, editorial status, availability, RLS policies and indexes.

-- 1. General Count & Public Visibility
SELECT
  count(*) AS total,
  count(*) FILTER (
    WHERE editorial_status = 'published'
  ) AS publicadas,
  count(*) FILTER (
    WHERE availability <> 'Archivado'
  ) AS no_archivadas,
  count(*) FILTER (
    WHERE editorial_status = 'published'
      AND availability <> 'Archivado'
  ) AS visibles_publicamente
FROM public.properties;

-- 2. Distribution by Editorial Status
SELECT
  editorial_status,
  count(*) AS total
FROM public.properties
GROUP BY editorial_status
ORDER BY total DESC;

-- 3. Distribution by Availability
SELECT
  availability,
  count(*) AS total
FROM public.properties
GROUP BY availability
ORDER BY total DESC;

-- 4. Distribution by Modality
SELECT
  modality,
  count(*) AS total
FROM public.properties
GROUP BY modality
ORDER BY total DESC;

-- 5. Distribution by Municipality & Department
SELECT
  municipality,
  department,
  count(*) AS total
FROM public.properties
GROUP BY municipality, department
ORDER BY total DESC;

-- 6. Publicly Visible Properties Sample
SELECT
  id,
  code,
  title,
  modality,
  asset_type,
  municipality,
  department,
  editorial_status,
  availability,
  featured_image,
  created_at
FROM public.properties
WHERE editorial_status = 'published'
  AND availability <> 'Archivado'
ORDER BY created_at DESC
LIMIT 100;

-- 7. Query for Specific Filter Combination (Rental in Necoclí)
SELECT
  id,
  code,
  title,
  modality,
  municipality,
  editorial_status,
  availability
FROM public.properties
WHERE editorial_status = 'published'
  AND availability <> 'Archivado'
  AND modality = 'Arriendo'
  AND municipality ILIKE '%Necoclí%';

-- 8. Table Column Schema Verification
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'properties'
ORDER BY ordinal_position;

-- 9. Row Level Security Policies Review
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'properties'
ORDER BY policyname;

-- 10. Confirm RLS is Enabled
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'properties';
