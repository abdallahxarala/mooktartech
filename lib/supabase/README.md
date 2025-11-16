# Configuration Supabase pour Xarala Solutions

Configuration complète de Supabase avec gestion d'erreurs robuste, type safety et hooks personnalisés.

## 🚀 Installation

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

## 📁 Structure

```
lib/supabase/
├── client.ts          # Client côté client avec gestion d'erreurs
├── server.ts          # Client côté serveur avec cookies
├── middleware.ts      # Middleware d'authentification
├── utils.ts           # Utilitaires et helpers
├── examples.ts        # Exemples d'utilisation
├── index.ts           # Export principal
└── README.md          # Documentation
```

## 🔧 Configuration

### Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Initialisation

```typescript
import { initializeSupabase } from '@/lib/supabase'

// Initialiser Supabase
initializeSupabase()
```

## 💻 Utilisation

### Client côté client

```typescript
import { createSupabaseClient } from '@/lib/supabase/client'

const supabase = createSupabaseClient()

// Obtenir les produits
const { data: products, error } = await supabase.products.getAll({
  category: 'cartes-virtuelles',
  search: 'professionnel',
  limit: 10
})

if (error) {
  console.error('Erreur:', error)
  return
}

console.log('Produits:', products)
```

### Client côté serveur

```typescript
import { createSupabaseServerClient } from '@/lib/supabase/server'

const supabase = createSupabaseServerClient()

// Obtenir l'utilisateur actuel
const { data: user, error } = await supabase.auth.getCurrentUser()

if (error || !user) {
  return { error: 'Non authentifié' }
}

// Obtenir le profil utilisateur
const { data: profile } = await supabase.users.getProfile(user.id)
```

### Hooks personnalisés

```typescript
import { useSupabaseQuery, useSupabaseMutation } from '@/lib/supabase'

// Hook pour les requêtes
function useProducts() {
  const supabase = createSupabaseClient()
  
  return useSupabaseQuery(
    () => supabase.products.getAll({ limit: 20 }),
    {
      immediate: true,
      retryCount: 3,
      onSuccess: (data) => console.log('Produits chargés:', data?.length),
      onError: (error) => console.error('Erreur:', error)
    }
  )
}

// Hook pour les mutations
function useCreateCard() {
  const supabase = createSupabaseClient()
  
  return useSupabaseMutation(
    (cardData) => supabase.virtualCards.create(cardData),
    {
      onSuccess: (card) => console.log('Carte créée:', card?.short_id),
      onError: (error) => console.error('Erreur création:', error)
    }
  )
}
```

## 🛡️ Gestion d'erreurs

### Types d'erreurs détectées

- **Erreurs réseau** : Problèmes de connexion
- **Erreurs d'authentification** : Sessions expirées
- **Erreurs RLS** : Permissions insuffisantes
- **Erreurs de contraintes** : Violations de clés uniques/étrangères

### Exemple de gestion d'erreurs

```typescript
import { formatSupabaseError, isNetworkError } from '@/lib/supabase'

try {
  const { data, error } = await supabase.products.getAll()
  
  if (error) {
    if (isNetworkError(error)) {
      // Gérer l'erreur réseau
      showToast('Problème de connexion. Vérifiez votre internet.')
    } else {
      // Gérer les autres erreurs
      showToast(formatSupabaseError(error))
    }
    return
  }
  
  // Utiliser les données
  setProducts(data)
  
} catch (error) {
  console.error('Erreur inattendue:', error)
  showToast('Une erreur inattendue s\'est produite.')
}
```

## 🔄 Retry Logic

### Configuration automatique

```typescript
// Retry automatique avec backoff exponentiel
const { data, loading, error, retry } = useSupabaseQuery(
  () => supabase.products.getAll(),
  {
    retryCount: 3,
    retryDelay: 1000
  }
)

// Retry manuel
if (error) {
  await retry()
}
```

### Retry personnalisé

```typescript
import { withRetry } from '@/lib/supabase'

const result = await withRetry(
  () => supabase.products.getAll(),
  5, // max retries
  2000 // delay en ms
)
```

## 📊 Pagination

### Hook de pagination

```typescript
function useProductsPagination() {
  const supabase = createSupabaseClient()
  
  return useSupabaseListQuery(
    (offset, limit) => supabase.products.getAll({ offset, limit }),
    {
      pageSize: 12,
      immediate: true
    }
  )
}

// Utilisation
const {
  data: products,
  loading,
  error,
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  goToPage
} = useProductsPagination()
```

## 🗄️ Cache

### Cache automatique

```typescript
import { useSupabaseCachedQuery } from '@/lib/supabase'

const { data, loading, error } = useSupabaseCachedQuery(
  () => supabase.products.getAll(),
  'products-cache',
  {
    cacheTime: 5 * 60 * 1000, // 5 minutes
    staleTime: 1 * 60 * 1000  // 1 minute
  }
)
```

### Cache manuel

```typescript
import { supabaseCache } from '@/lib/supabase'

// Mettre en cache
supabaseCache.set('products', products, 5 * 60 * 1000)

// Récupérer du cache
const cachedProducts = supabaseCache.get('products')

// Vérifier si en cache
if (supabaseCache.has('products')) {
  // Utiliser les données en cache
}
```

## 🔍 Recherche avec debounce

```typescript
function useProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createSupabaseClient()
  
  const queryFn = useCallback(async () => {
    if (!searchTerm.trim()) return { data: null, error: null }
    
    return await supabase.products.getAll({
      search: searchTerm,
      limit: 20
    })
  }, [searchTerm, supabase])
  
  const result = useSupabaseDebouncedQuery(queryFn, 300)
  
  return {
    ...result,
    searchTerm,
    setSearchTerm
  }
}
```

## 📱 Temps réel

```typescript
import { useSupabaseRealtimeQuery } from '@/lib/supabase'

function useRealtimeProducts() {
  const supabase = createSupabaseClient()
  
  return useSupabaseRealtimeQuery(
    () => supabase.products.getAll(),
    'products',
    {
      event: 'UPDATE',
      filter: 'is_active=eq.true'
    }
  )
}
```

## 🧪 Tests

### Test de connectivité

```typescript
import { checkSupabaseConnection } from '@/lib/supabase'

const { connected, message } = await checkSupabaseConnection()
console.log(connected ? '✅ Connecté' : '❌ Erreur:', message)
```

### Test des fonctions

```typescript
import { testSupabaseFunctions } from '@/lib/supabase/examples'

const stats = await testSupabaseFunctions()
console.log('Statistiques:', stats)
```

## 📈 Monitoring

### Mesure des performances

```typescript
import { measureQueryTime } from '@/lib/supabase'

const products = await measureQueryTime(
  'getProducts',
  () => supabase.products.getAll()
)
```

### Logs de développement

```typescript
import { logSupabaseQuery } from '@/lib/supabase'

// Les logs sont automatiquement activés en mode développement
const { data } = await supabase.products.getAll()
// Console: [Supabase] SELECT on products
```

## 🔐 Sécurité

### Middleware d'authentification

```typescript
// middleware.ts
import { supabaseMiddleware } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  return await supabaseMiddleware(req)
}
```

### Vérification des permissions

```typescript
import { checkAdminPermissions } from '@/lib/supabase'

const { isAdmin, error } = await checkAdminPermissions(userId)

if (!isAdmin) {
  return { error: 'Permissions insuffisantes' }
}
```

## 🎯 Bonnes pratiques

### 1. Gestion des erreurs

```typescript
// ✅ Bon
const { data, error } = await supabase.products.getAll()
if (error) {
  console.error('Erreur:', formatSupabaseError(error))
  return
}

// ❌ Éviter
const data = await supabase.products.getAll() // Pas de gestion d'erreur
```

### 2. Types stricts

```typescript
// ✅ Bon
const { data: products } = await supabase.products.getAll()
// products est typé comme Product[]

// ❌ Éviter
const data = await supabase.products.getAll() // Pas de typage
```

### 3. Optimisation des requêtes

```typescript
// ✅ Bon - Sélection spécifique
const { data } = await supabase.products.getAll({
  limit: 20,
  offset: 0
})

// ❌ Éviter - Récupération de tout
const { data } = await supabase.supabase
  .from('products')
  .select('*') // Pas de limite
```

### 4. Cache intelligent

```typescript
// ✅ Bon - Cache pour les données statiques
const { data: templates } = useSupabaseCachedQuery(
  () => supabase.cardTemplates.getAll(),
  'templates',
  { cacheTime: 10 * 60 * 1000 } // 10 minutes
)

// ❌ Éviter - Pas de cache pour les données dynamiques
const { data: orders } = useSupabaseCachedQuery(
  () => supabase.orders.getUserOrders(userId),
  'orders',
  { cacheTime: 0 } // Pas de cache
)
```

## 🚀 Déploiement

### Variables d'environnement de production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### Configuration de production

```typescript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Auth Helpers Next.js](https://github.com/supabase/auth-helpers)
- [TypeScript avec Supabase](https://supabase.com/docs/guides/api/generating-types)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)

## 🤝 Contribution

Pour contribuer à la configuration Supabase :

1. Suivez les conventions de code existantes
2. Ajoutez des tests pour les nouvelles fonctionnalités
3. Documentez les changements dans ce README
4. Vérifiez la compatibilité TypeScript

---

**Xarala Solutions** - Configuration Supabase optimisée pour l'e-commerce B2B sénégalais 🇸🇳
