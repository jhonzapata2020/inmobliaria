import { createClient } from '../supabase/server';

export type AdminCheckResult = 
  | { authorized: true; user: any; role: string }
  | { authorized: false; reason: 'UNAUTHENTICATED' | 'FORBIDDEN'; message: string };

export const INVENTORY_ROLES = ['admin', 'inventory_manager', 'legal'];
export const CRM_ROLES = ['admin', 'inventory_manager', 'legal', 'sales'];

export async function requireAdmin(allowedRoles: string[] = INVENTORY_ROLES): Promise<AdminCheckResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        authorized: false,
        reason: 'UNAUTHENTICATED',
        message: 'Sesión no iniciada. Por favor inicie sesión como usuario autorizado.'
      };
    }

    // Query public.profiles table for role and is_active
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle();

    let userRole = profile?.role;
    let isActive = profile?.is_active;

    // Server-managed fallback ONLY to app_metadata (never user_metadata)
    if (!userRole) {
      userRole = user.app_metadata?.role;
      if (userRole) {
        isActive = true;
      }
    }

    // Reject explicitly if missing, inactive, or role not in allowedRoles
    if (!userRole || isActive !== true || !allowedRoles.includes(userRole)) {
      return {
        authorized: false,
        reason: 'FORBIDDEN',
        message: 'No posee permisos suficientes o su perfil de usuario no se encuentra activo.'
      };
    }

    return {
      authorized: true,
      user,
      role: userRole
    };
  } catch (err: unknown) {
    console.error('Unexpected error in requireAdmin:', err);
    return {
      authorized: false,
      reason: 'UNAUTHENTICATED',
      message: 'Error inesperado durante la verificación de credenciales.'
    };
  }
}
