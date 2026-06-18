/* ==========================================================================
   supabase-server.ts — Server-side Supabase client with Service Role
   Intelligence OS — thiagolab.com
   ========================================================================== */

import { createClient } from '@supabase/supabase-js';

/**
 * Cria um cliente Supabase com a service role key.
 * Usado nas API routes para operações que precisam bypassar RLS,
 * como criar/ler perfis de usuários recém-cadastrados.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.',
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Cria um cliente Supabase com a anon key (cliente do browser).
 * As operações dependem do RLS.
 */
export function createAnonClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.',
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
