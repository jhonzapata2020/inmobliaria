'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '../../lib/supabase/server';
import { mapDbToProperty } from '../../lib/supabase/mappers';
import { Property, PropertyFilterState } from '../../types/property';
import { requireAdmin, INVENTORY_ROLES } from '../../lib/auth/requireAdmin';
import { ActionResponse } from '../../types/action-response';

export type { ActionResponse };

function sanitizePublicProperty(prop: Property): Property {
  if (prop.isConfidentialCoords) {
    return {
      ...prop,
      latitude: Number(prop.latitude.toFixed(2)),
      longitude: Number(prop.longitude.toFixed(2)),
      matriculaInmobiliaria: 'Bajo solicitud',
      cedulaCatastral: 'Bajo solicitud',
      saeIdActivo: prop.saeIdActivo ? 'Bajo solicitud' : undefined,
      folioMatricula: prop.folioMatricula ? 'Bajo solicitud' : undefined,
    };
  }
  return prop;
}

export async function getPublishedProperties(filters?: PropertyFilterState): Promise<Property[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('properties')
      .select('*')
      .eq('editorial_status', 'published')
      .neq('availability', 'Archivado');

    if (filters) {
      if (filters.modality && filters.modality !== 'all' && filters.modality !== 'Todas') {
        const modalityVal = filters.modality === 'Custodia' ? 'Custodia SAE' : filters.modality;
        query = query.eq('modality', modalityVal);
      }

      if (filters.assetType && filters.assetType !== 'all' && filters.assetType !== 'Todos') {
        query = query.eq('asset_type', filters.assetType);
      }

      if (filters.municipality && filters.municipality !== 'all' && filters.municipality !== 'Todos') {
        query = query.ilike('municipality', `%${filters.municipality}%`);
      }

      if (filters.department && filters.department !== 'all') {
        query = query.ilike('department', `%${filters.department}%`);
      }

      if (filters.isInvestmentOpportunity) {
        query = query.eq('is_investment_opportunity', true);
      }

      if (filters.searchQuery) {
        const q = `%${filters.searchQuery}%`;
        query = query.or(`title.ilike.${q},description.ilike.${q},municipality.ilike.${q},code.ilike.${q}`);
      }

      if (filters.sortBy === 'price-asc') {
        query = query.order('sale_price_cop', { ascending: true, nullsFirst: false });
      } else if (filters.sortBy === 'price-desc') {
        query = query.order('sale_price_cop', { ascending: false, nullsFirst: false });
      } else if (filters.sortBy === 'area-desc') {
        query = query.order('land_area_m2', { ascending: false, nullsFirst: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching published properties:', error);
      return [];
    }

    return (data || []).map((item) => sanitizePublicProperty(mapDbToProperty(item)));
  } catch (err) {
    console.error('Unexpected error in getPublishedProperties:', err);
    return [];
  }
}

export async function getPropertyBySlug(slugOrId: string): Promise<Property | null> {
  try {
    const supabase = await createClient();
    
    // First try by slug
    let { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('editorial_status', 'published')
      .neq('availability', 'Archivado')
      .eq('slug', slugOrId)
      .maybeSingle();

    if (!data) {
      // Try by id or code
      const res = await supabase
        .from('properties')
        .select('*')
        .eq('editorial_status', 'published')
        .neq('availability', 'Archivado')
        .or(`id.eq.${slugOrId},code.eq.${slugOrId}`)
        .maybeSingle();
      data = res.data;
      error = res.error;
    }

    if (error || !data) {
      return null;
    }

    return sanitizePublicProperty(mapDbToProperty(data));
  } catch (err) {
    console.error('Unexpected error in getPropertyBySlug:', err);
    return null;
  }
}

export async function getAdminPropertyBySlug(slugOrId: string): Promise<ActionResponse<Property | null>> {
  try {
    const auth = await requireAdmin(INVENTORY_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();
    let { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slugOrId)
      .maybeSingle();

    if (!data) {
      const res = await supabase
        .from('properties')
        .select('*')
        .or(`id.eq.${slugOrId},code.eq.${slugOrId}`)
        .maybeSingle();
      data = res.data;
      error = res.error;
    }

    if (error) {
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    return { success: true, data: data ? mapDbToProperty(data) : null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error inesperado al obtener la propiedad';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

export async function getAllPropertiesAdmin(): Promise<ActionResponse<Property[]>> {
  try {
    const auth = await requireAdmin(INVENTORY_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin properties:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    return { success: true, data: (data || []).map(mapDbToProperty) };
  } catch (err: unknown) {
    console.error('Unexpected error in getAllPropertiesAdmin:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al obtener propiedades administrativas';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

export async function upsertPropertyAction(formData: Partial<Property>): Promise<ActionResponse<Property>> {
  try {
    const auth = await requireAdmin(INVENTORY_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();

    const code = formData.code || `DAR-${Date.now().toString().slice(-6)}`;
    const slug = formData.slug || code.toLowerCase();

    const rawModality = (formData.modality as string) === 'Custodia' ? 'Custodia SAE' : formData.modality;
    const modality = ['Venta', 'Arriendo', 'Custodia SAE', 'Inversión'].includes(rawModality || '') 
      ? rawModality 
      : 'Venta';

    let landAreaM2 = formData.landAreaM2;
    let landAreaHa = formData.landAreaHa;
    if (!landAreaM2 && landAreaHa) landAreaM2 = landAreaHa * 10000;
    if (!landAreaHa && landAreaM2) landAreaHa = landAreaM2 / 10000;

    const payload: Record<string, unknown> = {
      code,
      slug,
      title: formData.title || 'Propiedad sin título',
      short_description: formData.shortDescription || '',
      description: formData.description || '',
      opportunity_analysis: formData.opportunityAnalysis || '',
      asset_type: formData.assetType || 'Finca',
      modality,
      is_sae: formData.isSae ?? false,
      sae_id_activo: formData.saeIdActivo || null,
      folio_matricula: formData.folioMatricula || null,
      sale_price_cop: formData.salePriceCop || null,
      monthly_rent_cop: formData.monthlyRentCop || null,
      estimated_value_cop: formData.estimatedValueCop || null,
      land_area_m2: landAreaM2 || null,
      land_area_ha: landAreaHa || null,
      built_area_m2: formData.builtAreaM2 || null,
      department: formData.department || 'Antioquia',
      municipality: formData.municipality || 'Turbo',
      sector_vereda: formData.sectorVereda || null,
      vereda: formData.vereda || null,
      address: formData.address || null,
      latitude: formData.latitude ?? 8.5,
      longitude: formData.longitude ?? -76.7,
      is_confidential_coords: formData.isConfidentialCoords ?? false,
      altitude_msl: formData.altitudeMsl || null,
      matricula_inmobiliaria: formData.matriculaInmobiliaria || '',
      cedula_catastral: formData.cedulaCatastral || '',
      topography: formData.topography || '',
      access_roads: formData.accessRoads || '',
      water_sources: formData.waterSources || '',
      public_services: formData.publicServices || [],
      current_use: formData.currentUse || '',
      potential_uses: formData.potentialUses || [],
      existing_infrastructure: formData.existingInfrastructure || [],
      environmental_notes: formData.environmentalNotes || '',
      legal_status: formData.legalStatus || 'Saneado',
      document_status: formData.documentStatus || '',
      commercial_conditions: formData.commercialConditions || '',
      editorial_status: formData.editorialStatus || 'published',
      is_demo_data: formData.isDemoData ?? false,
      images: formData.images || [],
      featured_image: formData.featuredImage || formData.images?.[0] || '',
      video_url: formData.videoUrl || null,
      virtual_tour_url: formData.virtualTourUrl || null,
      documents_available: formData.documentsAvailable || [],
      availability: formData.availability || 'Disponible',
      is_featured: formData.isFeatured ?? false,
      is_investment_opportunity: formData.isInvestmentOpportunity ?? false,
      updated_at: new Date().toISOString(),
    };

    if (formData.id) {
      payload.id = formData.id;
    }

    const { data, error } = await supabase
      .from('properties')
      .upsert(payload, { onConflict: 'code' })
      .select('*')
      .single();

    if (error) {
      console.error('Error upserting property:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    revalidatePath('/propiedades');
    revalidatePath('/admin/inventario');
    revalidatePath('/admin/propiedades');
    if (slug) revalidatePath(`/propiedades/${slug}`);

    return { success: true, data: mapDbToProperty(data) };
  } catch (err: unknown) {
    console.error('Unexpected error in upsertPropertyAction:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al guardar la propiedad';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

export async function deletePropertyAction(id: string): Promise<ActionResponse<void>> {
  try {
    const auth = await requireAdmin(INVENTORY_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    revalidatePath('/propiedades');
    revalidatePath('/admin/inventario');
    revalidatePath('/admin/propiedades');

    return { success: true, data: undefined };
  } catch (err: unknown) {
    console.error('Unexpected error in deletePropertyAction:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al eliminar la propiedad';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}
