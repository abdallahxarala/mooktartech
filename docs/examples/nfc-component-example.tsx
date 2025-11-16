/**
 * Exemple de composant NFC utilisant createSupabaseBrowserClient
 * 
 * Ce fichier montre comment utiliser le client Supabase côté client
 * dans les composants NFC (Wizard, Preview 3D, etc.)
 */

'use client';

import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

interface NFCProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar_url?: string;
  created_at: string;
}

export function NFCProfileLoader() {
  const [profile, setProfile] = useState<NFCProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // ✅ Utiliser createSupabaseBrowserClient pour les composants client
        const supabase = createSupabaseBrowserClient();

        const { data, error } = await supabase
          .from('nfc_profiles')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!profile) {
    return <div>Aucun profil trouvé</div>;
  }

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
      <p>{profile.phone}</p>
      <p>{profile.company}</p>
    </div>
  );
}

/**
 * Exemple avec sauvegarde
 */
export function NFCProfileEditor() {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // ✅ Toujours utiliser createSupabaseBrowserClient dans les composants client
      const supabase = createSupabaseBrowserClient();

      const { error } = await supabase
        .from('nfc_profiles')
        .insert({
          name,
          email: '',
          phone: '',
          company: ''
        });

      if (error) {
        console.error('Erreur:', error);
        return;
      }

      console.log('Profil sauvegardé !');
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom"
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );
}

/**
 * ❌ MAUVAIS EXEMPLE - Ne jamais faire ça dans un composant client
 */
export function BadExample() {
  // ❌ NE JAMAIS utiliser createSupabaseServerClient dans un composant client
  // import { createSupabaseServerClient } from '@/lib/supabase/server'
  // const supabase = createSupabaseServerClient() // ❌ ERREUR !
  
  // ✅ TOUJOURS utiliser createSupabaseBrowserClient dans les composants client
  const supabase = createSupabaseBrowserClient(); // ✅ CORRECT
  
  return <div>Exemple</div>;
}

