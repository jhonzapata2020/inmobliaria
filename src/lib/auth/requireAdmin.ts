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

    // Query public.profiles as single source of truth
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .maybeSingle();

    // Reject explicitly if query errors, profile does not exist, or is inactive
    if (profileError || !profile || profile.is_active !== true) {
      return {
        authorized: false,
        reason: 'FORBIDDEN',
        message: 'Perfil de usuario inexistente, inactivo o no registrado.'
      };
    }

    const userRole = profile.role;

    // Check if role belongs to allowed domain roles
    if (!allowedRoles.includes(userRole)) {
      return {
        authorized: false,
        reason: 'FORBIDDEN',
        message: 'No posee permisos suficientes para realizar esta acción.'
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
