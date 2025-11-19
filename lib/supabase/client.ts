// lib/supabase/client.ts

'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

/**
 * Create Supabase client for client-side usage
 * 
 * This is a client-side helper function for browser components.
 * Use this in:
 * - Client Components ('use client')
 * - React hooks
 * - Browser-side utilities
 * 
 * DO NOT use this in:
 * - Server Components (app/* without 'use client')
 * - Route Handlers (app/api/*)
 * - Server Actions
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

/**
 * Alias pour compatibilité avec le code existant
 * Utilise createSupabaseBrowserClient en interne
 */
export function createClient() {
  return createSupabaseBrowserClient();
}