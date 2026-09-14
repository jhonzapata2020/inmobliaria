'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '../../lib/supabase/server';
import { mapDbToLead } from '../../lib/supabase/mappers';
import { Lead, CRMStage } from '../../types/crm';
import { requireAdmin, CRM_ROLES } from '../../lib/auth/requireAdmin';
import { ActionResponse } from '../../types/action-response';

export async function getLeadsAction(): Promise<ActionResponse<Lead[]>> {
  try {
    const auth = await requireAdmin(CRM_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    return { success: true, data: (data || []).map(mapDbToLead) };
  } catch (err: unknown) {
    console.error('Unexpected error in getLeadsAction:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al obtener los clientes prospecto';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

export async function updateLeadStageAction(leadId: string, newStage: CRMStage): Promise<ActionResponse<void>> {
  try {
    const auth = await requireAdmin(CRM_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('crm_leads')
      .update({ 
        stage: newStage,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (error) {
      console.error('Error updating lead stage:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    revalidatePath('/admin/crm');
    return { success: true, data: undefined };
  } catch (err: unknown) {
    console.error('Unexpected error in updateLeadStageAction:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al actualizar la etapa del cliente';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

export async function createLeadAction(leadData: Partial<Lead>): Promise<ActionResponse<Lead>> {
  try {
    const auth = await requireAdmin(CRM_ROLES);
    if (!auth.authorized) {
      return {
        success: false,
        error: auth.reason === 'UNAUTHENTICATED' ? 'UNAUTHORIZED' : 'FORBIDDEN',
        message: auth.message,
      };
    }

    const supabase = createAdminClient();
    const payload = {
      client_name: leadData.clientName || 'Cliente Prospecto',
      company_name: leadData.companyName || null,
      phone: leadData.phone || '',
      email: leadData.email || '',
      property_of_interest_id: leadData.propertyOfInterestId || null,
      property_code: leadData.propertyCode || null,
      property_of_interest_title: leadData.propertyOfInterestTitle || null,
      potential_value: leadData.potentialValue || null,
      stage: leadData.stage || 'Nuevo',
      priority: leadData.priority || 'Media',
      next_activity: leadData.nextActivity || null,
      assigned_agent: leadData.assignedAgent || 'Ing. Carlos Mendoza',
      tags: leadData.tags || [],
      notes: leadData.notes || [],
      activities: leadData.activities || [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('crm_leads')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    revalidatePath('/admin/crm');
    return { success: true, data: mapDbToLead(data) };
  } catch (err: unknown) {
    console.error('Unexpected error in createLeadAction:', err);
    const message = err instanceof Error ? err.message : 'Error inesperado al registrar el cliente prospecto';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

export interface PropertyConsignmentInput {
  clientName: string;
  phone: string;
  email?: string;
  municipality: string;
  extensionArea?: string;
  expectedPriceCop?: number;
  comments?: string;
}

export async function submitConsignmentLeadAction(
  input: PropertyConsignmentInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const supabase = createAdminClient();

    const noteEntry = {
      id: `note-${Date.now()}`,
      author: 'Portal Público - Consignación Propietario',
      date: new Date().toISOString().split('T')[0],
      text: `Radicación de predio en ${input.municipality}. Extensión: ${input.extensionArea || 'No especificada'}. Expectativa: ${input.expectedPriceCop ? '$' + input.expectedPriceCop.toLocaleString('es-CO') + ' COP' : 'A convenir'}. ${input.comments || ''}`.trim()
    };

    const payload = {
      client_name: input.clientName,
      company_name: 'Propietario Consignante',
      phone: input.phone,
      email: input.email || '',
      property_of_interest_title: `Consignación de predio en ${input.municipality} (${input.extensionArea || 'Área por confirmar'})`,
      potential_value: input.expectedPriceCop || null,
      stage: 'Nuevo',
      priority: 'Alta',
      assigned_agent: 'Mesa Comercial Urabá',
      tags: ['Consignación Directa', 'Propietario', input.municipality],
      notes: [noteEntry],
      activities: [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('crm_leads')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting consignment lead:', error);
      return { success: false, error: 'DATABASE_ERROR', message: error.message };
    }

    revalidatePath('/admin/crm');
    return { success: true, data: { id: data.id } };
  } catch (err: unknown) {
    console.error('Unexpected error in submitConsignmentLeadAction:', err);
    const message = err instanceof Error ? err.message : 'Error al registrar la consignación.';
    return { success: false, error: 'DATABASE_ERROR', message };
  }
}

