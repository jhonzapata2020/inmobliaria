import { INITIAL_PROPERTIES } from '../src/data/mockProperties';
import { INITIAL_LEADS } from '../src/data/mockLeads';
import { Property, Modality } from '../src/types/property';
import { Lead, CRMStage } from '../src/types/crm';
import dotenv from 'dotenv';
import pg from 'pg';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
dotenv.config({ path: '.env.local' });

const rawDbUrl = process.env.DATABASE_URL || 'postgresql://postgres.ehfejbgzronpllbeyzqj:Galimatias%402020@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require';
const dbUrl = rawDbUrl.split('?')[0];

const STAGE_MAP: Record<string, CRMStage> = {
  'Nuevo interesado': 'Nuevo',
  'Nuevo': 'Nuevo',
  'Contactado': 'Contactado',
  'En estudio jurídico': 'Contactado',
  'En análisis de necesidad': 'Contactado',
  'Visita programada': 'En Visita',
  'En Visita': 'En Visita',
  'Oferta radicada': 'Negociación',
  'Negociación': 'Negociación',
  'Cierre / contrato': 'Cerrado',
  'Cerrado': 'Cerrado',
  'No concretado': 'Descartado',
  'Descartado': 'Descartado',
};

async function seed() {
  console.log('==================================================');
  console.log(' SEEDING ENTERPRISE DATABASE - ACTIVOS DARIÉN');
  console.log('==================================================');

  const client = new pg.Client({ 
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log(`\n[1/2] Normalizing & Upserting ${INITIAL_PROPERTIES.length} Properties...`);
  
  const propertyIdMap = new Map<string, string>(); // code -> DB UUID

  for (const rawPropItem of INITIAL_PROPERTIES) {
    const rawProp = rawPropItem as any;
    const rawModality = (rawProp.modality as string) === 'Custodia' ? 'Custodia SAE' : rawProp.modality;
    const modality: Modality = ['Venta', 'Arriendo', 'Custodia SAE', 'Inversión'].includes(rawModality) 
      ? (rawModality as Modality) 
      : 'Venta';

    const salePriceCop = rawProp.salePriceCop ?? rawProp.price ?? rawProp.priceTotal ?? null;
    const monthlyRentCop = rawProp.monthlyRentCop ?? rawProp.monthlyRent ?? rawProp.rentMonthly ?? null;
    const estimatedValueCop = rawProp.estimatedValueCop ?? rawProp.estimatedValue ?? null;

    let landAreaM2 = rawProp.landAreaM2 ?? rawProp.areaTotalM2 ?? null;
    let landAreaHa = rawProp.landAreaHa ?? rawProp.areaTotalHa ?? null;
    if (!landAreaM2 && landAreaHa) {
      landAreaM2 = landAreaHa * 10000;
    }
    if (!landAreaHa && landAreaM2) {
      landAreaHa = landAreaM2 / 10000;
    }

    const builtAreaM2 = rawProp.builtAreaM2 ?? rawProp.builtArea ?? null;
    const lat = rawProp.latitude ?? rawProp.coordinates?.lat ?? 8.5;
    const lng = rawProp.longitude ?? rawProp.coordinates?.lng ?? -76.7;

    const query = `
      INSERT INTO properties (
        code, slug, title, short_description, description, opportunity_analysis,
        asset_type, modality, is_sae, sae_id_activo, folio_matricula,
        sale_price_cop, monthly_rent_cop, estimated_value_cop,
        land_area_m2, land_area_ha, built_area_m2,
        department, municipality, sector_vereda, vereda, address,
        latitude, longitude, is_confidential_coords, altitude_msl,
        matricula_inmobiliaria, cedula_catastral, topography, access_roads,
        water_sources, public_services, current_use, potential_uses,
        existing_infrastructure, environmental_notes, legal_status, document_status,
        commercial_conditions, editorial_status, is_demo_data, images,
        featured_image, video_url, virtual_tour_url, documents_available,
        availability, is_featured, is_investment_opportunity, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
        $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, NOW()
      )
      ON CONFLICT (code) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        short_description = EXCLUDED.short_description,
        description = EXCLUDED.description,
        opportunity_analysis = EXCLUDED.opportunity_analysis,
        asset_type = EXCLUDED.asset_type,
        modality = EXCLUDED.modality,
        is_sae = EXCLUDED.is_sae,
        sae_id_activo = EXCLUDED.sae_id_activo,
        folio_matricula = EXCLUDED.folio_matricula,
        sale_price_cop = EXCLUDED.sale_price_cop,
        monthly_rent_cop = EXCLUDED.monthly_rent_cop,
        estimated_value_cop = EXCLUDED.estimated_value_cop,
        land_area_m2 = EXCLUDED.land_area_m2,
        land_area_ha = EXCLUDED.land_area_ha,
        built_area_m2 = EXCLUDED.built_area_m2,
        department = EXCLUDED.department,
        municipality = EXCLUDED.municipality,
        sector_vereda = EXCLUDED.sector_vereda,
        vereda = EXCLUDED.vereda,
        address = EXCLUDED.address,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        is_confidential_coords = EXCLUDED.is_confidential_coords,
        altitude_msl = EXCLUDED.altitude_msl,
        matricula_inmobiliaria = EXCLUDED.matricula_inmobiliaria,
        cedula_catastral = EXCLUDED.cedula_catastral,
        topography = EXCLUDED.topography,
        access_roads = EXCLUDED.access_roads,
        water_sources = EXCLUDED.water_sources,
        public_services = EXCLUDED.public_services,
        current_use = EXCLUDED.current_use,
        potential_uses = EXCLUDED.potential_uses,
        existing_infrastructure = EXCLUDED.existing_infrastructure,
        environmental_notes = EXCLUDED.environmental_notes,
        legal_status = EXCLUDED.legal_status,
        document_status = EXCLUDED.document_status,
        commercial_conditions = EXCLUDED.commercial_conditions,
        editorial_status = EXCLUDED.editorial_status,
        is_demo_data = EXCLUDED.is_demo_data,
        images = EXCLUDED.images,
        featured_image = EXCLUDED.featured_image,
        video_url = EXCLUDED.video_url,
        virtual_tour_url = EXCLUDED.virtual_tour_url,
        documents_available = EXCLUDED.documents_available,
        availability = EXCLUDED.availability,
        is_featured = EXCLUDED.is_featured,
        is_investment_opportunity = EXCLUDED.is_investment_opportunity,
        updated_at = NOW()
      RETURNING id, code;
    `;

    const values = [
      rawProp.code,
      rawProp.slug || rawProp.code.toLowerCase(),
      rawProp.title,
      rawProp.shortDescription || '',
      rawProp.description || '',
      rawProp.opportunityAnalysis || '',
      rawProp.assetType,
      modality,
      rawProp.isSae ?? false,
      rawProp.saeIdActivo || null,
      rawProp.folioMatricula || null,
      salePriceCop,
      monthlyRentCop,
      estimatedValueCop,
      landAreaM2,
      landAreaHa,
      builtAreaM2,
      rawProp.department,
      rawProp.municipality,
      rawProp.sectorVereda || null,
      rawProp.vereda || null,
      rawProp.address || null,
      lat,
      lng,
      rawProp.isConfidentialCoords ?? false,
      rawProp.altitudeMsl || null,
      rawProp.matriculaInmobiliaria || '',
      rawProp.cedulaCatastral || '',
      rawProp.topography || '',
      rawProp.accessRoads || '',
      rawProp.waterSources || '',
      rawProp.publicServices || [],
      rawProp.currentUse || '',
      rawProp.potentialUses || [],
      rawProp.existingInfrastructure || [],
      rawProp.environmentalNotes || '',
      rawProp.legalStatus || 'Saneado',
      rawProp.documentStatus || '',
      rawProp.commercialConditions || '',
      rawProp.editorialStatus || 'published',
      rawProp.isDemoData ?? false,
      rawProp.images || [],
      rawProp.featuredImage || (rawProp.images?.[0] ?? ''),
      rawProp.videoUrl || null,
      rawProp.virtualTourUrl || null,
      JSON.stringify(rawProp.documentsAvailable || []),
      rawProp.availability || 'Disponible',
      rawProp.isFeatured ?? false,
      rawProp.isInvestmentOpportunity ?? false,
    ];

    const res = await client.query(query, values);
    propertyIdMap.set(rawProp.code, res.rows[0].id);
    console.log(`  -> Upserted Property: ${rawProp.code} | ${rawProp.title}`);
  }

  console.log(`\n[2/2] Upserting ${INITIAL_LEADS.length} CRM Leads...`);
  
  // Clear existing leads for clean idempotent re-seed
  await client.query('TRUNCATE crm_leads RESTART IDENTITY CASCADE;');

  for (const rawLead of INITIAL_LEADS) {
    const linkedPropId = rawLead.propertyCode ? (propertyIdMap.get(rawLead.propertyCode) || null) : null;
    const stage: CRMStage = STAGE_MAP[rawLead.stage as string] || 'Nuevo';

    const query = `
      INSERT INTO crm_leads (
        client_name, company_name, phone, email,
        property_of_interest_id, property_code, property_of_interest_title,
        potential_value, stage, priority, next_activity, assigned_agent,
        tags, notes, activities, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW()
      );
    `;

    const values = [
      rawLead.clientName,
      rawLead.companyName || null,
      rawLead.phone,
      rawLead.email,
      linkedPropId,
      rawLead.propertyCode || null,
      rawLead.propertyOfInterestTitle || null,
      rawLead.potentialValue || null,
      stage,
      rawLead.priority || 'Media',
      rawLead.nextActivity || null,
      rawLead.assignedAgent || null,
      rawLead.tags || [],
      JSON.stringify(rawLead.notes || []),
      JSON.stringify(rawLead.activities || []),
    ];

    await client.query(query, values);
    console.log(`  -> Seeded Lead: ${rawLead.clientName} (${stage})`);
  }

  const propCountRes = await client.query('SELECT COUNT(*) FROM properties');
  const leadCountRes = await client.query('SELECT COUNT(*) FROM crm_leads');

  console.log('==================================================');
  console.log(' SEEDING COMPLETED SUCCESSFULLY!');
  console.log(` Total Properties in DB: ${propCountRes.rows[0].count}`);
  console.log(` Total Leads in DB: ${leadCountRes.rows[0].count}`);
  console.log('==================================================');

  await client.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
