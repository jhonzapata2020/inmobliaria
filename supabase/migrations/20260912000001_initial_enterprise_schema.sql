-- Migration 20260912000001: Initial Enterprise Schema for Activos & Inversiones Darién S.A.S.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROPERTIES TABLE
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR UNIQUE NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    title VARCHAR NOT NULL,
    short_description TEXT,
    description TEXT,
    opportunity_analysis TEXT,
    asset_type VARCHAR NOT NULL,
    modality VARCHAR NOT NULL CHECK (modality IN ('Venta', 'Arriendo', 'Custodia SAE', 'Inversión')),
    
    -- Real SAE Metadata
    is_sae BOOLEAN DEFAULT false,
    sae_id_activo VARCHAR,
    folio_matricula VARCHAR,

    -- Financial Values (COP)
    sale_price_cop NUMERIC,
    monthly_rent_cop NUMERIC,
    estimated_value_cop NUMERIC,
    
    -- Areas
    land_area_m2 NUMERIC,
    land_area_ha NUMERIC,
    built_area_m2 NUMERIC,

    -- Location
    department VARCHAR NOT NULL,
    municipality VARCHAR NOT NULL,
    sector_vereda VARCHAR,
    vereda VARCHAR,
    address TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    is_confidential_coords BOOLEAN DEFAULT false,
    altitude_msl NUMERIC,

    -- Technical Specs
    matricula_inmobiliaria VARCHAR,
    cedula_catastral VARCHAR,
    topography VARCHAR,
    access_roads VARCHAR,
    water_sources VARCHAR,
    public_services TEXT[] DEFAULT '{}',
    current_use VARCHAR,
    potential_uses TEXT[] DEFAULT '{}',
    existing_infrastructure TEXT[] DEFAULT '{}',
    environmental_notes TEXT,

    -- Legal & Editorial
    legal_status VARCHAR,
    document_status VARCHAR,
    commercial_conditions TEXT,
    editorial_status VARCHAR NOT NULL DEFAULT 'published' CHECK (editorial_status IN ('draft', 'review', 'published', 'archived')),
    is_demo_data BOOLEAN DEFAULT false,

    -- Media & Documents
    images TEXT[] DEFAULT '{}',
    featured_image TEXT,
    video_url TEXT,
    virtual_tour_url TEXT,
    documents_available JSONB DEFAULT '[]'::jsonb,

    -- Status & Flags
    availability VARCHAR NOT NULL DEFAULT 'Disponible',
    is_featured BOOLEAN DEFAULT false,
    is_investment_opportunity BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES FOR PERFORMANCE & LOCATION FILTERING
CREATE INDEX IF NOT EXISTS idx_properties_dept_muni ON properties(department, municipality);
CREATE INDEX IF NOT EXISTS idx_properties_modality ON properties(modality);
CREATE INDEX IF NOT EXISTS idx_properties_editorial ON properties(editorial_status);
CREATE INDEX IF NOT EXISTS idx_properties_code ON properties(code);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- CRM LEADS TABLE
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR NOT NULL,
    company_name VARCHAR,
    phone VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    property_of_interest_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    property_code VARCHAR,
    property_of_interest_title VARCHAR,
    potential_value NUMERIC,
    stage VARCHAR NOT NULL DEFAULT 'Nuevo' CHECK (stage IN ('Nuevo', 'Contactado', 'En Visita', 'Negociación', 'Cerrado', 'Descartado')),
    priority VARCHAR NOT NULL DEFAULT 'Media' CHECK (priority IN ('Alta', 'Media', 'Baja')),
    next_activity VARCHAR,
    assigned_agent VARCHAR,
    tags TEXT[] DEFAULT '{}',
    notes JSONB DEFAULT '[]'::jsonb,
    activities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_stage ON crm_leads(stage);

-- DOSSIERS TABLE
CREATE TABLE IF NOT EXISTS dossiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_ids UUID[] DEFAULT '{}',
    client_name VARCHAR NOT NULL,
    client_company VARCHAR,
    client_email VARCHAR NOT NULL,
    client_phone VARCHAR NOT NULL,
    client_city VARCHAR NOT NULL,
    dossier_type VARCHAR NOT NULL,
    status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired')),
    notes TEXT,
    assigned_agent VARCHAR,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE dossiers ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR PROPERTIES
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published properties') THEN
        CREATE POLICY "Public read published properties" ON properties 
            FOR SELECT USING (editorial_status = 'published');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access properties') THEN
        CREATE POLICY "Admin full access properties" ON properties 
            FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access crm_leads') THEN
        CREATE POLICY "Admin full access crm_leads" ON crm_leads 
            FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin full access dossiers') THEN
        CREATE POLICY "Admin full access dossiers" ON dossiers 
            FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
    END IF;
END $$;
