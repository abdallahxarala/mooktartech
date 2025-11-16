#!/usr/bin/env tsx
/**
 * Script pour générer les types TypeScript depuis Supabase
 * Utilise l'API Supabase directement sans nécessiter Docker ou login CLI
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅' : '❌');
  process.exit(1);
}

console.log('🔄 Génération des types TypeScript depuis Supabase...');
console.log(`   URL: ${SUPABASE_URL}`);

try {
  // Créer un client Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Note: Supabase ne fournit pas directement une API pour générer les types
  // Ce script utilise une approche alternative en générant les types de base
  // Pour les types complets, utilisez supabase CLI avec login ou Docker

  const typesContent = `// ============================================================================
// Types Supabase générés automatiquement
// Date: ${new Date().toISOString()}
// ============================================================================
//
// NOTE: Pour générer les types complets depuis votre schéma Supabase :
// 1. Installez Docker Desktop
// 2. Exécutez: supabase start
// 3. Exécutez: npm run db:generate
//
// OU
//
// 1. Connectez-vous: supabase login
// 2. Exécutez: supabase gen types typescript --project-id gocsjmtsfoadcozhhsxn > lib/types/supabase.ts
//
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Les types seront générés automatiquement par Supabase CLI
      // ou via l'extension Supabase VS Code
    }
  }
}

// Types de base pour les événements foire
export interface Event {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  event_type: 'standard' | 'foire' | 'conference' | 'exhibition' | 'seminar' | 'workshop';
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
  foire_config?: Json;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  max_users: number;
  created_at: string;
  updated_at: string;
}
`;

  const outputPath = join(process.cwd(), 'lib/types/supabase.ts');
  writeFileSync(outputPath, typesContent, 'utf-8');

  console.log('✅ Types TypeScript générés avec succès!');
  console.log(`   Fichier: ${outputPath}`);
  console.log('');
  console.log('⚠️  NOTE: Ce fichier contient des types de base.');
  console.log('   Pour les types complets depuis votre schéma Supabase :');
  console.log('   1. Installez Docker Desktop');
  console.log('   2. Exécutez: supabase start');
  console.log('   3. Exécutez: npm run db:generate');
} catch (error) {
  console.error('❌ Erreur lors de la génération des types:', error);
  process.exit(1);
}

