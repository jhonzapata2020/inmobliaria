import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env o .env.local
dotenv.config({ path: '.env.local' });
dotenv.config();

// Polyfill para compatibilidad con Node.js < 22 donde globalThis.WebSocket no está presente de forma nativa
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class DummyWebSocket {};
}

/**
 * Interfaz para representar la estructura típica de un lead en automation_leads
 */
export interface AutomationLead {
  id?: string;
  created_at?: string;
  full_name?: string; // Corregido: la tabla en Supabase usa full_name, no name
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  [key: string]: any;
}

/**
 * 1. Validación de Variables de Entorno
 */
function getSupabaseCredentials() {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://ehfejbgzronpllbeyzqj.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "❌ Error de Configuración: La variable de entorno 'SUPABASE_URL' (o 'NEXT_PUBLIC_SUPABASE_URL') no está definida."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "❌ Error de Configuración: La variable de entorno 'SUPABASE_SERVICE_ROLE_KEY' no está definida."
    );
  }

  try {
    new URL(supabaseUrl);
  } catch {
    throw new Error(`❌ Error de Configuración: SUPABASE_URL ('${supabaseUrl}') no es una URL válida.`);
  }

  return { supabaseUrl, serviceRoleKey };
}

/**
 * 2. Inicialización del Cliente Supabase con Service Role Key
 */
export function getSupabaseAdminClient() {
  const { supabaseUrl, serviceRoleKey } = getSupabaseCredentials();

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-client-info': 'automation-leads-backend-service',
      },
    },
  });
}

/**
 * 3. Función Principal: Fetch & Prueba de Conexión a automation_leads
 */
export async function fetchAutomationLeads(limit = 10) {
  const { supabaseUrl } = getSupabaseCredentials();
  const supabase = getSupabaseAdminClient();
  const tableName = 'automation_leads';

  console.log(`📡 Conectando a Supabase (${supabaseUrl})...`);
  console.log(`🔍 Consultado tabla '${tableName}' (Límite: ${limit})...\n`);

  try {
    const startTime = Date.now();

    const { data, error, count, status, statusText } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    const duration = Date.now() - startTime;

    // Manejo de errores devueltos por la API de Supabase / PostgREST
    if (error) {
      console.error(`❌ Error de API Supabase [HTTP ${status} - ${statusText}]:`);
      console.error(`   - Código Error PG: ${error.code}`);
      console.error(`   - Mensaje: ${error.message}`);
      if (error.details) console.error(`   - Detalles: ${error.details}`);
      if (error.hint) console.error(`   - Sugerencia: ${error.hint}`);

      // Diagnóstico específico para errores comunes
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.warn(`\n⚠️ DIAGNÓSTICO: La tabla '${tableName}' no existe en el esquema 'public'.`);
        console.warn(`💡 SOLUCIÓN: Ejecuta el script SQL DDL para crear la tabla 'automation_leads' en el editor SQL de Supabase.`);
      } else if (status === 401 || error.message.toLowerCase().includes('jwt') || error.message.toLowerCase().includes('apikey')) {
        console.warn(`\n⚠️ DIAGNÓSTICO: Error de Autenticación. La SUPABASE_SERVICE_ROLE_KEY es inválida o expiró.`);
      }

      return { success: false, error, data: null };
    }

    console.log(`✅ Consulta exitosa en ${duration}ms!`);
    console.log(`📊 Registros encontrados en el fetch: ${data?.length ?? 0} (Total en tabla: ${count ?? 'N/A'})`);

    if (data && data.length > 0) {
      console.log('\n📋 Muestra de registros devueltos:');
      console.dir(data, { depth: null, colors: true });
    } else {
      console.log('ℹ️ La tabla está vacía o no retornó registros con los criterios solicitados.');
    }

    return { success: true, data, count };

  } catch (err: any) {
    // Manejo de errores fatales de red o fallos inesperados de ejecución
    console.error(`💥 Error Fatal / Red durante la ejecución:`);
    if (err.cause) {
      console.error(`   - Causa Raíz:`, err.cause);
    }
    console.error(`   - Mensaje: ${err.message || err}`);

    if (err.message?.includes('fetch failed') || err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      console.warn(`\n⚠️ DIAGNÓSTICO DE RED: No se pudo establecer conexión con el servidor de Supabase.`);
      console.warn(`💡 Verifique su conexión a internet, Firewall o si la URL de Supabase es correcta.`);
    }

    return { success: false, error: err, data: null };
  }
}

/**
 * 4. Función de Inserción (Helper de Gestión)
 */
export async function createAutomationLead(leadData: AutomationLead) {
  const supabase = getSupabaseAdminClient();
  try {
    const { data, error } = await supabase
      .from('automation_leads')
      .insert([
        {
          created_at: new Date().toISOString(),
          ...leadData,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    console.log(`✅ Lead creado exitosamente ID: ${data.id}`);
    return { success: true, data };
  } catch (err: any) {
    console.error(`💥 Error en inserción: ${err.message}`);
    return { success: false, error: err };
  }
}

// Ejecución autónoma
fetchAutomationLeads(10).then((res) => {
  if (!res.success) {
    process.exit(1);
  }
});
