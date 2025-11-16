// lib/supabase/server.ts

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database.types';

/**
 * Create Supabase client for server-side usage
 * 
 * This is a synchronous helper function (not a server action).
 * Use this in:
 * - Server Components (app/* without 'use client')
 * - Route Handlers (app/api/*)
 * - Server Actions
 * 
 * DO NOT use this in:
 * - Client Components ('use client')
 * - Pages directory
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );
}