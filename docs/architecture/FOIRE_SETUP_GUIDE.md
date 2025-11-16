# 🎪 Guide de Setup - Foire Dakar 2025

Guide complet pour créer l'organisation et l'événement Foire Dakar 2025 dans le système Xarala Solutions.

---

## 📋 Fichiers Créés

### Migrations SQL
1. **`supabase/migrations/20250130000000_extend_events_for_foire.sql`**
   - Étend la table `events` avec `event_type` et `foire_config`
   - Ajoute des indexes pour les performances
   - Met à jour les événements existants

2. **`supabase/migrations/20250130000001_seed_foire_dakar_2025.sql`**
   - Crée l'organisation "Foire Internationale de Dakar 2025"
   - Crée l'événement foire associé
   - Configuration complète avec pavillons, zones, horaires

### Services TypeScript
3. **`lib/services/organization.service.ts`**
   - `createOrganization()` - Créer une organisation
   - `getOrganizationBySlug()` - Récupérer par slug
   - `updateOrganization()` - Mettre à jour
   - `createFoireDakar2025Organization()` - Utilitaire seed

4. **`lib/services/foire.service.ts`**
   - `createFoire()` - Créer une foire
   - `getFoireBySlug()` - Récupérer par slug
   - `getFoiresByOrganization()` - Liste des foires d'une org
   - `createFoireDakar2025()` - Utilitaire seed

### Types TypeScript
5. **`lib/types/foire.ts`**
   - Types pour les foires
   - Interface `FoireConfig`
   - Types `EventType`, `EventStatus`
   - Interfaces pour les paramètres de création

### Scripts
6. **`scripts/seed-foire-dakar-2025.ts`**
   - Script Node.js pour créer l'org et la foire
   - Utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS
   - Idempotent (peut être exécuté plusieurs fois)

---

## 🚀 Installation & Utilisation

### Option 1 : Via Migrations SQL (Recommandé)

```bash
# 1. Appliquer les migrations
npm run db:push
# ou
supabase migration up

# 2. Générer les types TypeScript
npm run db:generate
```

Les migrations créent automatiquement :
- ✅ Colonnes `event_type` et `foire_config` dans `events`
- ✅ Organisation "Foire Internationale de Dakar 2025"
- ✅ Événement foire avec configuration complète

### Option 2 : Via Script TypeScript

```bash
# 1. S'assurer que les migrations sont appliquées
npm run db:push

# 2. Configurer les variables d'environnement
# Dans .env.local:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# SUPABASE_SERVICE_ROLE_KEY=your_service_key

# 3. Exécuter le script seed
npm run seed:foire
```

---

## 📊 Structure de Données

### Organisation Créée

```typescript
{
  name: "Foire Internationale de Dakar 2025",
  slug: "foire-dakar-2025",
  plan: "pro",
  max_users: 50
}
```

### Événement Foire Créé

```typescript
{
  organization_id: "<org-uuid>",
  name: "Foire Internationale de Dakar 2025",
  slug: "foire-dakar-2025",
  event_type: "foire",
  start_date: "2025-12-01T08:00:00+00:00",
  end_date: "2025-12-15T18:00:00+00:00",
  location: "CICES Dakar",
  location_address: "Boulevard du Général de Gaulle, Dakar, Sénégal",
  status: "published",
  foire_config: {
    lieu: "CICES Dakar",
    zones: ["A", "B", "C"],
    pavillons: {
      A: { nom: "Pavillon International", capacite: 200, superficie: 5000 },
      B: { nom: "Pavillon Local", capacite: 150, superficie: 4000 },
      C: { nom: "Pavillon Innovation", capacite: 100, superficie: 3000 }
    },
    superficie_totale: 15000,
    horaires: { ouverture: "08:00", fermeture: "18:00", jours: [...] },
    contact: { email: "contact@foire-dakar-2025.sn", telephone: "+221 XX XXX XX XX" }
  }
}
```

---

## 🔧 Utilisation des Services

### Créer une Organisation

```typescript
import { createOrganization } from '@/lib/services/organization.service'

const result = await createOrganization({
  name: 'Ma Foire',
  slug: 'ma-foire-2025',
  plan: 'pro',
  max_users: 50
})

if (result.error) {
  console.error(result.error)
} else {
  console.log('Organisation créée:', result.organization)
}
```

### Créer une Foire

```typescript
import { createFoire } from '@/lib/services/foire.service'

const result = await createFoire({
  organization_id: orgId,
  name: 'Ma Foire 2025',
  slug: 'ma-foire-2025',
  start_date: '2025-12-01T08:00:00+00:00',
  end_date: '2025-12-15T18:00:00+00:00',
  location: 'Lieu de la foire',
  foire_config: {
    zones: ['A', 'B'],
    pavillons: { /* ... */ }
  }
})
```

### Récupérer une Foire

```typescript
import { getFoireBySlug } from '@/lib/services/foire.service'

const { foire, error } = await getFoireBySlug('foire-dakar-2025')
if (foire) {
  console.log('Foire:', foire.name)
  console.log('Config:', foire.foire_config)
}
```

---

## 🗺️ Routes Disponibles

Après création, les routes suivantes seront disponibles :

- **Liste des foires:** `/fr/org/foire-dakar-2025/foires`
- **Détails foire:** `/fr/org/foire-dakar-2025/foires/foire-dakar-2025`
- **Stands:** `/fr/org/foire-dakar-2025/foires/foire-dakar-2025/stands`
- **Réservations:** `/fr/org/foire-dakar-2025/foires/foire-dakar-2025/reservations`

---

## ✅ Vérification

### Vérifier que l'organisation existe

```sql
SELECT * FROM organizations WHERE slug = 'foire-dakar-2025';
```

### Vérifier que l'événement existe

```sql
SELECT * FROM events WHERE slug = 'foire-dakar-2025' AND event_type = 'foire';
```

### Vérifier la configuration

```sql
SELECT 
  name,
  event_type,
  foire_config->>'lieu' as lieu,
  foire_config->'pavillons' as pavillons
FROM events 
WHERE slug = 'foire-dakar-2025';
```

---

## 🔄 Mise à Jour des Types

Après avoir appliqué les migrations, régénérer les types TypeScript :

```bash
npm run db:generate
```

Cela mettra à jour `lib/types/database.types.ts` avec les nouvelles colonnes `event_type` et `foire_config`.

---

## 📝 Notes Importantes

1. **RLS Policies:** Les policies existantes pour `events` fonctionnent automatiquement avec les foires car elles utilisent `organization_id`.

2. **Idempotence:** Les migrations et le script seed sont idempotents - vous pouvez les exécuter plusieurs fois sans erreur.

3. **Service Role Key:** Le script seed utilise `SUPABASE_SERVICE_ROLE_KEY` pour bypasser RLS. Ne jamais exposer cette clé côté client.

4. **Permissions:** Pour créer des foires via les services, l'utilisateur doit être membre de l'organisation avec rôle `owner` ou `admin`.

---

## 🐛 Dépannage

### Erreur: "Organization not found"
- Vérifier que la migration seed a bien été exécutée
- Vérifier que le slug est correct: `foire-dakar-2025`

### Erreur: "Event slug already exists"
- Normal si vous réexécutez le script seed
- Le script utilise `upsert` donc il met à jour l'existant

### Erreur: "Missing environment variables"
- Vérifier que `.env.local` contient `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

---

## 📚 Prochaines Étapes

1. ✅ Migrations appliquées
2. ✅ Organisation et foire créées
3. ⏭️ Créer les routes `/org/[slug]/foires/`
4. ⏭️ Créer les composants UI pour les foires
5. ⏭️ Créer les tables `foire_stands` et `foire_stand_reservations`

---

**Créé le:** 2025-01-30  
**Version:** 1.0

