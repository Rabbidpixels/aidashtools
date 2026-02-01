import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let supabaseAdminInstance: any = null;

// Server-side client with Service Role Key (bypasses RLS)
// Use this for server actions and API routes
// Note: Using 'any' type to avoid build errors with Supabase v2.78 type inference
export const supabaseAdmin: any = (() => {
  if (!supabaseAdminInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Validate environment variables
    if (!supabaseUrl) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }
    if (!supabaseServiceRoleKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable - server actions will fail');
    }

    supabaseAdminInstance = createClient(
      supabaseUrl || '',
      supabaseServiceRoleKey || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  return supabaseAdminInstance;
})();

// Helper to check if admin client is properly configured
export function isSupabaseAdminConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}
