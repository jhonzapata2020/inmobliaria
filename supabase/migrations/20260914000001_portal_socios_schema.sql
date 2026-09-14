-- Migration: 20260914000001_portal_socios_schema.sql
-- Description: Schema update for Portal de Socios (Broker & Owner accounts, property creator tracking, commission agreements, and RLS policies)

-- 1. Updates to public.profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_type VARCHAR(30) DEFAULT 'broker',
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30),
  ADD COLUMN IF NOT EXISTS company_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.profiles.user_type IS 'Valores: owner, broker, investor, admin';

-- 2. Updates to public.properties
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS commission_agreement VARCHAR(50) DEFAULT 'split_50_50',
  ADD COLUMN IF NOT EXISTS contact_notes TEXT;

COMMENT ON COLUMN public.properties.commission_agreement IS 'Valores: split_50_50, direct_owner, custom';
COMMENT ON COLUMN public.properties.contact_notes IS 'Datos de contacto directo del titular o del comisionista (privado, visible admin y creador)';

-- Ensure editorial_status default is pending_review for partner submissions
ALTER TABLE public.properties 
  ALTER COLUMN editorial_status SET DEFAULT 'pending_review';

-- 3. RLS Policies Configuration
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id 
    AND (role IN ('admin', 'inventory_manager', 'legal') OR user_type = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies to prevent conflict errors
DROP POLICY IF EXISTS "Public can view published properties" ON public.properties;
DROP POLICY IF EXISTS "Users can view own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins have full access to properties" ON public.properties;
DROP POLICY IF EXISTS "Authenticated users can insert pending properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update own pending properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;

-- Public can view published properties that are not archived
CREATE POLICY "Public can view published properties" 
  ON public.properties
  FOR SELECT 
  USING (editorial_status = 'published' AND (availability IS NULL OR availability != 'Archivado'));

-- Partners can view their own properties regardless of editorial_status
CREATE POLICY "Users can view own properties"
  ON public.properties
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND (created_by = auth.uid() OR public.is_admin(auth.uid())));

-- Partners can insert properties (forced created_by = auth.uid for non-admins)
CREATE POLICY "Authenticated users can insert pending properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND 
    (created_by = auth.uid() OR created_by IS NULL OR public.is_admin(auth.uid()))
  );

-- Partners can update their own properties if not published yet, or Admins can update anything
CREATE POLICY "Users can update own pending properties"
  ON public.properties
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND (
      (created_by = auth.uid() AND editorial_status = 'pending_review') 
      OR public.is_admin(auth.uid())
    )
  );

-- Admins can delete properties
CREATE POLICY "Admins can delete properties"
  ON public.properties
  FOR DELETE
  USING (auth.uid() IS NOT NULL AND public.is_admin(auth.uid()));

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow user insert profile on signup" ON public.profiles;

CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND (id = auth.uid() OR public.is_admin(auth.uid())));

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() IS NOT NULL AND (id = auth.uid() OR public.is_admin(auth.uid())));

CREATE POLICY "Allow user insert profile on signup"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (id = auth.uid() OR public.is_admin(auth.uid())));
