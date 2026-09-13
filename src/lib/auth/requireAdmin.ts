import { createClient } from '../supabase/server';

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized: Admin session required');
  }

  return user;
}
