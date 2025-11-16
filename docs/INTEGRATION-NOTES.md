# Notes d'intégration Buyer/Creator

## ✅ État actuel

Le système Buyer/Creator est **opérationnel** avec une architecture hybride :

### Fichiers créés

- **Migration DB** : `supabase/migrations/20250128000000_buyer_creator_auth.sql`
- **Types** : `lib/types/auth-roles.ts`
- **Store** : `lib/store/auth.ts` (mis à jour)
- **Hook** : `lib/hooks/use-auth-progressive.ts` (stub temporaire)
- **Composants** : 
  - `components/auth/progressive-onboarding.tsx`
  - `components/auth/role-switcher.tsx`
- **Pages** :
  - `app/[locale]/test-auth/page.tsx`
  - `app/[locale]/badge-editor/page.tsx`
  - `app/[locale]/nfc-editor/page.tsx`

### Hook temporaire

Le hook `use-auth-progressive.ts` est actuellement un **stub** qui retourne des valeurs par défaut pour éviter les erreurs d'import.

**Pour une implémentation complète**, remplacer le contenu par :

```typescript
"use client";

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store/auth';
import { RoleProgressionStatus, DEFAULT_THRESHOLDS } from '@/lib/types/auth-roles';

export function useAuthProgressive() {
  const { user } = useAuthStore();
  const [buyerProgress, setBuyerProgress] = useState<RoleProgressionStatus | null>(null);
  const [creatorProgress, setCreatorProgress] = useState<RoleProgressionStatus | null>(null);
  
  // Implémentation complète ici...
  // Voir docs/buyer-creator-system.md pour détails
}
```

## 🧪 Tests

### Page de test
```
http://localhost:3000/fr/test-auth
```

Cette page permet de :
- Simuler des connexions
- Tester l'activation des rôles
- Vérifier la progression
- Débugger le système

## 📝 Intégration

### Checkout
Pour activer automatiquement le rôle Buyer lors d'une commande :

```typescript
import { useAuthProgressive } from '@/lib/hooks/use-auth-progressive'

const { trackActivity } = useAuthProgressive()

// Après création de commande
if (order.total >= 50000) {
  await trackActivity('order_above_threshold', {
    orderTotal: order.total,
    orderId: order.id
  })
}
```

### Card Editor
Pour activer le rôle Creator lors de la sauvegarde d'un design :

```typescript
const { checkCreatorProgression } = useAuthProgressive()

// Après sauvegarde
await checkCreatorProgression()
// Active automatiquement si seuil atteint (3 designs)
```

## 🔧 Prochaines étapes

1. **Implémenter le hook complet** : Remplacer le stub par la vraie implémentation
2. **Intégrer dans checkout** : Ajouter tracking des commandes
3. **Intégrer dans card-editor** : Ajouter tracking des designs
4. **Créer dashboards** : Pages séparées par rôle
5. **Ajouter notifications** : Alertes pour seuils atteints

## 📚 Documentation

- Guide complet : `docs/buyer-creator-system.md`
- Types : `lib/types/auth-roles.ts`
- Migration : `supabase/migrations/20250128000000_buyer_creator_auth.sql`

## ⚠️ Notes importantes

- Le système actuel utilise **Supabase** pour la base de données
- L'authentification est gérée par `useAuthStore` (Zustand)
- Les rôles sont persistés dans localStorage via Zustand persist
- Les tables de profils sont optionnelles (créées à l'activation)

