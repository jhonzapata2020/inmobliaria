'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '../../lib/supabase/server';
import { mapDbToProperty, mapDbToProfile } from '../../lib/supabase/mappers';
import { Property, UserProfile, UserType } from '../../types/property';
import { ActionResponse } from '../../types/action-response';

export interface RegisterPartnerInput {
  email: string;
  password: string;
  fullName: string;
  userType: UserType; // 'owner' | 'broker' | 'broker_group'
  phone?: string;
  companyName?: string;
  municipalityBase?: string;
}

export interface PartnerPropertyInput {
  title: string;
  assetType: string;
  modality?: string;
  department: string;
  municipality: string;
  vereda?: string;
  address?: string;
  landAreaHa?: number;
  landAreaM2?: number;
  potentialUse?: string;
  salePriceCop?: number;
  commissionAgreement?: string;
  netPriceOwnerCop?: number;
  groupCommissionCop?: number;
  fixedFeeCop?: number;
  linderosNotes?: string;
  images?: string[];
  contactNotes: string; // Titular contact info & private notes
}

/**
 * Register a new Partner (Broker or Owner)
 */
export async function registerPartnerAction(input: RegisterPartnerInput): Promise<ActionResponse<UserProfile>> {
  try {
    const supabase = await createClient();

    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          user_type: input.userType,
          phone: input.phone,
          company_name: input.companyName,
        },
      },
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: authError?.message || 'No se pudo crear la cuenta de usuario.',
      };
    }

    const userId = authData.user.id;
    const adminSupabase = createAdminClient();

    // 2. Create or upsert profile entry in public.profiles
    const profilePayload = {
      id: userId,
      email: input.email,
      full_name: input.fullName,
      role: input.userType === 'owner' ? 'owner' : 'broker',
      user_type: input.userType,
      phone: input.phone || null,
      company_name: input.companyName || null,
      municipality_base: input.municipalityBase || null,
      is_verified: false,
      is_active: true,
      updated_at: new Date().toISOString(),
    };

    const { data: profileData, error: profileError } = await adminSupabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select('*')
      .single();

    if (profileError) {
      console.error('Error creating profile for partner:', profileError);
      return {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Cuenta creada, pero ocurrió un problema al inicializar el perfil.',
      };
    }

    return {
      success: true,
      data: mapDbToProfile(profileData),
    };
  } catch (err: unknown) {
    console.error('Unexpected error in registerPartnerAction:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al registrar el socio.';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

/**
 * Fetch active authenticated partner profile
 */
export async function getPartnerProfileAction(): Promise<ActionResponse<UserProfile | null>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'UNAUTHORIZED', message: 'Sesión no iniciada.' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return { success: false, error: 'DATABASE_ERROR', message: profileError.message };
    }

    if (!profile) {
      // Fallback: create default profile from auth metadata
      const userMeta = user.user_metadata || {};
      const fallbackProfile: UserProfile = {
        id: user.id,
        email: user.email,
        fullName: userMeta.full_name || user.email?.split('@')[0],
        role: 'broker',
        userType: (userMeta.user_type as UserType) || 'broker',
        phone: userMeta.phone,
        companyName: userMeta.company_name,
        isVerified: false,
        isActive: true,
      };
      return { success: true, data: fallbackProfile };
    }

    return { success: true, data: mapDbToProfile(profile) };
  } catch (err: unknown) {
    console.error('Unexpected error in getPartnerProfileAction:', err);
    return { success: false, error: 'DATABASE_ERROR', message: 'Error al obtener el perfil.' };
  }
}

/**
 * Get properties submitted by the logged in partner
 */
export async function getPartnerPropertiesAction(): Promise<ActionResponse<Property[]>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: 'UNAUTHORIZED', message: 'Sesión no iniciada.' };
    }

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching partner properties:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    return { success: true, data: (data || []).map(mapDbToProperty) };
  } catch (err: unknown) {
    console.error('Unexpected error in getPartnerPropertiesAction:', err);
    return { success: false, error: 'DATABASE_ERROR', message: 'Error al obtener tus captaciones.' };
  }
}

/**
 * Submit a new property for moderation (editorial_status = 'pending_review')
 */
export async function submitPartnerPropertyAction(
  input: PartnerPropertyInput
): Promise<ActionResponse<Property>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Debes iniciar sesión para registrar una captación.',
      };
    }

    const code = `CAPT-${Date.now().toString().slice(-6)}`;
    const slug = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${code.toLowerCase()}`;

    let landAreaM2 = input.landAreaM2;
    let landAreaHa = input.landAreaHa;
    if (!landAreaM2 && landAreaHa) landAreaM2 = landAreaHa * 10000;
    if (!landAreaHa && landAreaM2) landAreaHa = landAreaM2 / 10000;

    const payload: Record<string, unknown> = {
      code,
      slug,
      title: input.title,
      short_description: `Captación de socio en ${input.municipality}, ${input.department}`,
      description: `Propiedad ingresada desde el Portal de Socios para revisión. Vocación: ${input.potentialUse || 'Por evaluar'}.`,
      asset_type: input.assetType || 'Finca',
      modality: input.modality || 'Venta',
      sale_price_cop: input.salePriceCop || null,
      land_area_m2: landAreaM2 || null,
      land_area_ha: landAreaHa || null,
      department: input.department,
      municipality: input.municipality,
      vereda: input.vereda || null,
      address: input.address || null,
      latitude: 8.5,
      longitude: -76.7,
      is_confidential_coords: true,
      potential_uses: input.potentialUse ? [input.potentialUse] : [],
      legal_status: 'En estudio jurídico',
      editorial_status: 'pending_review',
      availability: 'Disponible',
      images: input.images || [],
      featured_image: input.images?.[0] || '',
      created_by: user.id,
      commission_agreement: input.commissionAgreement || 'split_50_50',
      net_price_owner_cop: input.netPriceOwnerCop || null,
      group_commission_cop: input.groupCommissionCop || null,
      fixed_fee_cop: input.fixedFeeCop || null,
      linderos_notes: input.linderosNotes || null,
      contact_notes: input.contactNotes,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Error submitting partner property:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    revalidatePath('/socios/dashboard');
    revalidatePath('/admin/propiedades');
    revalidatePath('/admin/inventario');

    return { success: true, data: mapDbToProperty(data) };
  } catch (err: unknown) {
    console.error('Unexpected error in submitPartnerPropertyAction:', err);
    const message = err instanceof Error ? err.message : 'Error al enviar la propiedad.';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}
