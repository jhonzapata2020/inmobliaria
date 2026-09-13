import { Property, Modality, AssetType, EditorialStatus, AvailabilityStatus } from '../../types/property';
import { Lead, CRMStage, LeadPriority, LeadNote, LeadActivity } from '../../types/crm';

export function mapDbToProperty(row: Record<string, unknown>): Property {
  const parseNum = (v: unknown): number | undefined => {
    if (v === null || v === undefined || v === '') return undefined;
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  };

  const parseArray = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String);
    return [];
  };

  const parseJson = <T>(v: unknown, fallback: T): T => {
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return fallback; }
    }
    if (v && typeof v === 'object') return v as T;
    return fallback;
  };

  const landAreaM2 = parseNum(row.land_area_m2);
  const landAreaHa = parseNum(row.land_area_ha) ?? (landAreaM2 ? landAreaM2 / 10000 : undefined);

  return {
    id: String(row.id || ''),
    code: String(row.code || ''),
    slug: String(row.slug || ''),
    title: String(row.title || ''),
    shortDescription: String(row.short_description || ''),
    description: String(row.description || ''),
    opportunityAnalysis: String(row.opportunity_analysis || ''),
    assetType: (row.asset_type as AssetType) || 'Finca',
    modality: (row.modality as Modality) || 'Venta',

    isSae: Boolean(row.is_sae),
    saeIdActivo: row.sae_id_activo ? String(row.sae_id_activo) : undefined,
    folioMatricula: row.folio_matricula ? String(row.folio_matricula) : undefined,

    salePriceCop: parseNum(row.sale_price_cop),
    monthlyRentCop: parseNum(row.monthly_rent_cop),
    estimatedValueCop: parseNum(row.estimated_value_cop),

    landAreaM2,
    landAreaHa,
    builtAreaM2: parseNum(row.built_area_m2),

    department: String(row.department || 'Antioquia'),
    municipality: String(row.municipality || 'Turbo'),
    sectorVereda: row.sector_vereda ? String(row.sector_vereda) : undefined,
    vereda: row.vereda ? String(row.vereda) : undefined,
    address: row.address ? String(row.address) : undefined,
    latitude: Number(row.latitude ?? 8.5),
    longitude: Number(row.longitude ?? -76.7),
    isConfidentialCoords: Boolean(row.is_confidential_coords),
    altitudeMsl: parseNum(row.altitude_msl),

    matriculaInmobiliaria: String(row.matricula_inmobiliaria || ''),
    cedulaCatastral: String(row.cedula_catastral || ''),
    topography: String(row.topography || ''),
    accessRoads: String(row.access_roads || ''),
    waterSources: String(row.water_sources || ''),
    publicServices: parseArray(row.public_services),
    currentUse: String(row.current_use || ''),
    potentialUses: parseArray(row.potential_uses),
    existingInfrastructure: parseArray(row.existing_infrastructure),
    environmentalNotes: String(row.environmental_notes || ''),

    legalStatus: String(row.legal_status || 'Saneado'),
    documentStatus: String(row.document_status || ''),
    commercialConditions: String(row.commercial_conditions || ''),
    editorialStatus: (row.editorial_status as EditorialStatus) || 'published',
    isDemoData: Boolean(row.is_demo_data),

    images: parseArray(row.images),
    featuredImage: row.featured_image ? String(row.featured_image) : undefined,
    videoUrl: row.video_url ? String(row.video_url) : undefined,
    virtualTourUrl: row.virtual_tour_url ? String(row.virtual_tour_url) : undefined,
    documentsAvailable: parseJson(row.documents_available, []),

    availability: (row.availability as AvailabilityStatus) || 'Disponible',
    isFeatured: Boolean(row.is_featured),
    isInvestmentOpportunity: Boolean(row.is_investment_opportunity),
    createdDate: row.created_at ? new Date(String(row.created_at)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    updatedDate: row.updated_at ? new Date(String(row.updated_at)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export function mapDbToLead(row: Record<string, unknown>): Lead {
  const parseArray = (v: unknown): string[] => {
    if (Array.isArray(v)) return v.map(String);
    return [];
  };

  const parseJson = <T>(v: unknown, fallback: T): T => {
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return fallback; }
    }
    if (v && typeof v === 'object') return v as T;
    return fallback;
  };

  return {
    id: String(row.id || ''),
    clientName: String(row.client_name || ''),
    companyName: row.company_name ? String(row.company_name) : undefined,
    phone: String(row.phone || ''),
    email: String(row.email || ''),
    propertyOfInterestId: row.property_of_interest_id ? String(row.property_of_interest_id) : undefined,
    propertyCode: row.property_code ? String(row.property_code) : undefined,
    propertyOfInterestTitle: row.property_of_interest_title ? String(row.property_of_interest_title) : undefined,
    potentialValue: row.potential_value ? Number(row.potential_value) : undefined,
    stage: (row.stage as CRMStage) || 'Nuevo',
    priority: (row.priority as LeadPriority) || 'Media',
    nextActivity: row.next_activity ? String(row.next_activity) : undefined,
    assignedAgent: row.assigned_agent ? String(row.assigned_agent) : undefined,
    updatedDate: row.updated_at ? new Date(String(row.updated_at)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    createdDate: row.created_at ? new Date(String(row.created_at)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    tags: parseArray(row.tags),
    notes: parseJson<LeadNote[]>(row.notes, []),
    activities: parseJson<LeadActivity[]>(row.activities, []),
  };
}
