# 🔧 Correction de lib/supabase/server.ts pour Next.js 14

## Problème identifié

L'erreur `"You're importing a component that needs next/headers. That only works in a Server Component"` se produit car :

1. `createSupabaseServerClient()` utilise maintenant `await cookies()` (Next.js 14+)
2. La fonction est maintenant `async` mais était appelée sans `await` dans plusieurs fichiers
3. `next/headers` ne peut être utilisé que dans des Server Components ou API Routes

## Corrections effectuées

### 1. Fichier `lib/supabase/server.ts`
- ✅ Fonction `createClient()` créée avec `await cookies()`
- ✅ Alias `createSupabaseServerClient()` maintenu pour compatibilité
- ✅ Gestion d'erreurs avec try/catch

### 2. Fichiers corrigés (ajout de `await`)

#### Server Components
- ✅ `app/[locale]/org/[slug]/page.tsx` (2 occurrences)

#### API Routes
- ✅ `app/api/foires/[eventSlug]/invoices/[exhibitorId]/route.ts`
- ✅ `app/api/payments/webhook/wave/route.ts`
- ✅ `app/api/orders/create/route.ts`
- ✅ `app/api/leads/route.ts` (2 occurrences)
- ✅ `app/api/payments/initiate/route.ts`

#### Services
- ✅ `lib/services/pdf/invoice-generator.ts` (fonction helper `getSupabaseServerClient()`)

## Fichiers restants corrigés ✅

Tous les fichiers suivants dans `lib/` ont été corrigés avec l'ajout de `await` :

- ✅ `lib/supabase/index.ts` (1 occurrence)
- ✅ `lib/supabase/queries/products.ts` (8 occurrences)
- ✅ `lib/services/visitor.service.ts` (3 occurrences)
- ✅ `lib/services/exhibitor-product.service.ts` (6 occurrences)
- ✅ `lib/services/exhibitor.service.ts` (4 occurrences)
- ✅ `lib/services/foire.service.ts` (3 occurrences)
- ✅ `lib/services/organization.service.ts` (3 occurrences)
- ✅ `lib/email/transactional.ts` (2 occurrences)

**Total** : 33 occurrences corrigées dans 11 fichiers.

#### Fichiers supplémentaires corrigés
- ✅ `lib/supabase/storage.ts` (2 occurrences)
- ✅ `lib/supabase/examples.ts` (1 occurrence)
- ✅ `app/[locale]/org/[slug]/foires/[eventSlug]/catalogue/[exhibitorSlug]/page.tsx` (1 occurrence)
- ✅ `app/[locale]/org/[slug]/shop/page.tsx` (1 occurrence)

**Total final** : 36 occurrences corrigées dans 13 fichiers.

## Vérification

Pour vérifier que tout fonctionne :

```bash
npm run build
```

Si des erreurs persistent, vérifier que :
1. Tous les appels à `createSupabaseServerClient()` utilisent `await`
2. Les fonctions qui appellent cette fonction sont `async`
3. Les fichiers qui importent `lib/supabase/server.ts` sont bien des Server Components ou API Routes

## Migration recommandée

À terme, migrer progressivement vers `createClient()` au lieu de `createSupabaseServerClient()` :

```typescript
// Ancien (fonctionne toujours)
const supabase = await createSupabaseServerClient()

// Nouveau (recommandé)
const supabase = await createClient()
```

