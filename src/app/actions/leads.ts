'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '../../lib/supabase/server';
import { mapDbToLead } from '../../lib/supabase/mappers';
import { Lead, CRMStage } from '../../types/crm';
import { requireAdmin } from '../../lib/auth/requireAdmin';

export async function getLeadsAction(): Promise<Lead[]> {
  try {
    await requireAdmin();
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return (data || []).map(mapDbToLead);
  } catch (err) {
    console.error('Unexpected error in getLeadsAction:', err);
    return [];
  }
}

export async function updateLeadStageAction(leadId: string, newStage: CRMStage): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
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
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/crm');
    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in updateLeadStageAction:', err);
    return { success: false, error: err?.message || 'Error inesperado al actualizar la etapa del cliente' };
  }
}

export async function createLeadAction(leadData: Partial<Lead>): Promise<{ success: boolean; data?: Lead; error?: string }> {
  try {
    await requireAdmin();
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
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/crm');
    return { success: true, data: mapDbToLead(data) };
  } catch (err: any) {
    console.error('Unexpected error in createLeadAction:', err);
    return { success: false, error: err?.message || 'Error inesperado al registrar el cliente prospecto' };
  }
}
