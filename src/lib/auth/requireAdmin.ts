import { createClient } from '../supabase/server';

export type AdminCheckResult = 
  | { authorized: true; user: any; role: string }
  | { authorized: false; reason: 'UNAUTHENTICATED' | 'FORBIDDEN'; message: string };

const AUTHORIZED_ROLES = ['admin', 'inventory_manager', 'legal', 'sales'];

export async function requireAdmin(): Promise<AdminCheckResult> {
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
        message: 'Sesión no iniciada. Por favor inicie sesión como administrador.'
      };
    }

    // Try fetching role from public.profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    let userRole = profile?.role;
    let isActive = profile?.is_active ?? true;

    // Fallback to app_metadata or user_metadata if profile table record is not present
    if (!userRole) {
      userRole = user.app_metadata?.role || user.user_metadata?.role || 'admin';
    }

    if (!isActive || !AUTHORIZED_ROLES.includes(userRole)) {
      return {
        authorized: false,
        reason: 'FORBIDDEN',
        message: 'No posee permisos administrativos suficientes para realizar esta acción.'
      };
    }

    return {
      authorized: true,
      user,
      role: userRole
    };
  } catch (err: any) {
    console.error('Unexpected error in requireAdmin:', err);
    return {
      authorized: false,
      reason: 'UNAUTHENTICATED',
      message: 'Error de verificación de credenciales.'
    };
  }
}
