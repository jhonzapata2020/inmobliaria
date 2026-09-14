-- Migration: 20260914000002_flexible_commissions_and_partner_profile.sql
-- Description: Additional fields for flexible commission schemes, partner base municipality, and linderos

ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS municipality_base VARCHAR(100);

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS net_price_owner_cop NUMERIC,
  ADD COLUMN IF NOT EXISTS group_commission_cop NUMERIC,
  ADD COLUMN IF NOT EXISTS fixed_fee_cop NUMERIC,
  ADD COLUMN IF NOT EXISTS linderos_notes TEXT;

COMMENT ON COLUMN public.profiles.municipality_base IS 'Municipio base del corredor o propietario en Urabá/Córdoba';
COMMENT ON COLUMN public.properties.net_price_owner_cop IS 'Valor neto solicitado por el dueño';
COMMENT ON COLUMN public.properties.group_commission_cop IS 'Comisión total requerida por el grupo de aliados';
COMMENT ON COLUMN public.properties.fixed_fee_cop IS 'Fee fijo de cierre/plataforma';
COMMENT ON COLUMN public.properties.linderos_notes IS 'Notas de linderos y topografía';
