# 📚 Guide de Référence Rapide - Supabase

**Date** : Février 2025  
**Version** : 1.0

---

## 🎯 Règles d'Or

### ✅ Server Components
```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function MyPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.from('table').select('*')
  return <div>...</div>
}
```

**Caractéristiques** :
- ✅ Pas de `'use client'`
- ✅ Fonction `async`
- ✅ `await createSupabaseServerClient()`
- ✅ Utilisable dans `app/[locale]/**/*.tsx` (sans `'use client'`)

---

### ✅ Client Components
```typescript
'use client'

import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createSupabaseBrowserClient()
  // ...
}
```

**Caractéristiques** :
- ✅ `'use client'` en première ligne
- ✅ `createSupabaseBrowserClient()` (pas de `await`)
- ✅ Utilisable dans les hooks React, effets, handlers

---

### ✅ API Routes
```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  // ...
}
```

**Caractéristiques** :
- ✅ Dans `app/api/**/*.ts`
- ✅ Fonction `async`
- ✅ `await createSupabaseServerClient()`

---

### ✅ Services
```typescript
// Si appelé depuis Server Component ou API Route
import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function myService() {
  const supabase = await createSupabaseServerClient()
  // ...
}

// Si appelé uniquement depuis Client Component
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export async function myService() {
  const supabase = createSupabaseBrowserClient()
  // ...
}
```

---

## ❌ Erreurs Courantes

### ❌ Mélanger les clients
```typescript
// ❌ MAUVAIS
'use client'
import { createSupabaseServerClient } from '@/lib/supabase/server' // ❌

// ✅ BON
'use client'
import { createSupabaseBrowserClient } from '@/lib/supabase/client' // ✅
```

### ❌ Oublier `await` dans Server Components
```typescript
// ❌ MAUVAIS
const supabase = createSupabaseServerClient() // ❌ Manque await

// ✅ BON
const supabase = await createSupabaseServerClient() // ✅
```

### ❌ Utiliser `await` dans Client Components
```typescript
// ❌ MAUVAIS
const supabase = await createSupabaseBrowserClient() // ❌ Pas besoin d'await

// ✅ BON
const supabase = createSupabaseBrowserClient() // ✅
```

---

## 🔍 Comment Identifier le Contexte

### Server Component
- ✅ Fichier dans `app/[locale]/**/*.tsx`
- ✅ Pas de `'use client'`
- ✅ Peut être `async`
- ✅ Peut utiliser `await` directement

### Client Component
- ✅ Fichier avec `'use client'` en première ligne
- ✅ Utilise des hooks React (`useState`, `useEffect`, etc.)
- ✅ Gère des interactions utilisateur

### API Route
- ✅ Fichier dans `app/api/**/*.ts`
- ✅ Exporte `GET`, `POST`, `PUT`, `DELETE`, etc.
- ✅ Reçoit `Request` ou `NextRequest`

---

## 📋 Checklist de Vérification

Avant de créer un nouveau fichier utilisant Supabase :

- [ ] J'ai identifié le contexte (Server/Client/API) ?
- [ ] J'utilise le bon import ?
- [ ] J'utilise `await` si nécessaire ?
- [ ] Je n'ai pas mélangé les clients ?
- [ ] J'ai testé que ça compile ?

---

## 🛠️ Utilitaires Disponibles

### `lib/supabase/server.ts`
```typescript
export async function createClient()
export async function createSupabaseServerClient() // Alias
```

### `lib/supabase/client.ts`
```typescript
export function createSupabaseBrowserClient()
```

### `lib/supabase/index.ts`
```typescript
// Exporte uniquement le client browser (pour éviter les problèmes de bundling)
export { createSupabaseBrowserClient }
export type { Database }
```

---

## 📚 Documentation Complète

- **Audit Complet** : `docs/SUPABASE_AUDIT_REPORT.md`
- **Corrections Appliquées** : `docs/SUPABASE_CORRECTIONS_SUMMARY.md`
- **Fix TypeScript Errors** : `docs/FIX_SUPABASE_TYPESCRIPT_ERRORS.md`

---

## 🆘 En Cas de Problème

1. **Erreur "Property 'from' does not exist"**
   - ✅ Vérifier que vous utilisez `await createSupabaseServerClient()` dans Server Components
   - ✅ Vérifier que `lib/supabase/server.ts` utilise `return await createClient()`

2. **Erreur "Cannot use 'use client' in Server Component"**
   - ✅ Vérifier que vous n'importez pas un Client Component dans un Server Component
   - ✅ Utiliser un Server Component ou créer un wrapper Client Component

3. **Erreur "cookies() can only be used in Server Components"**
   - ✅ Vérifier que vous utilisez `createSupabaseServerClient()` et non `createSupabaseBrowserClient()`
   - ✅ Vérifier que vous êtes dans un Server Component ou API Route

---

**Dernière mise à jour** : Février 2025  
**Statut** : ✅ 98% Conforme - Configuration validée

