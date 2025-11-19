# 📋 Plan de Migration Xarala vers Multitenant

**Date** : 2025-02-02  
**Objectif** : Migrer toutes les routes Xarala vers la structure multitenant `/org/[slug]/`

---

## 📊 État Actuel

### Routes Xarala Existantes (Niveau Racine)
- ✅ `/app/[locale]/admin/` - Dashboard admin
- ✅ `/app/[locale]/card-editor/` - Éditeur de cartes
- ✅ `/app/[locale]/nfc-editor/` - Éditeur NFC
- ✅ `/app/[locale]/products/` - Shop (déjà partiellement migré)
- ✅ `/app/[locale]/dashboard/` - Dashboard utilisateur

### Structure Multitenant Existante
- ✅ `/app/[locale]/org/[slug]/page.tsx` - Homepage
- ✅ `/app/[locale]/org/[slug]/shop/` - Shop (déjà migré)
- ✅ `/app/[locale]/org/[slug]/cart/` - Panier

---

## 🎯 Routes à Migrer

### 1. Admin Dashboard
**Source** : `app/[locale]/admin/page.tsx`  
**Destination** : `app/[locale]/org/[slug]/admin/page.tsx`

**Modifications nécessaires** :
- Ajouter `params: { locale: string; slug: string }`
- Récupérer `organization` depuis `slug`
- Filtrer tous les produits par `organization_id`
- Mettre à jour les liens internes

### 2. Card Editor
**Source** : `app/[locale]/card-editor/page.tsx`  
**Destination** : `app/[locale]/org/[slug]/card-editor/page.tsx`

**Modifications nécessaires** :
- Adapter pour accepter `slug` dans les params
- Mettre à jour les liens de retour vers `/org/[slug]`
- Filtrer les données par `organization_id` si nécessaire

### 3. NFC Editor
**Source** : `app/[locale]/nfc-editor/page.tsx`  
**Destination** : `app/[locale]/org/[slug]/nfc-editor/page.tsx`

**Modifications nécessaires** :
- Adapter pour accepter `slug` dans les params
- Mettre à jour le lien de retour vers `/org/[slug]`

### 4. Products (Shop)
**Statut** : ✅ Déjà migré vers `/org/[slug]/shop/`

### 5. Dashboard Utilisateur
**Source** : `app/[locale]/dashboard/page.tsx`  
**Destination** : `app/[locale]/org/[slug]/dashboard/page.tsx`

**Modifications nécessaires** :
- Adapter pour le multitenant
- Filtrer les données par `organization_id`

---

## 📝 Étapes de Migration

### Étape 1 : Créer les dossiers de destination
```bash
mkdir -p app/[locale]/org/[slug]/admin
mkdir -p app/[locale]/org/[slug]/card-editor
mkdir -p app/[locale]/org/[slug]/nfc-editor
mkdir -p app/[locale]/org/[slug]/dashboard
```

### Étape 2 : Copier et adapter les fichiers

Pour chaque page :
1. Copier le fichier source
2. Ajouter `slug` aux params
3. Récupérer `organization` depuis `slug`
4. Ajouter filtres `organization_id` aux requêtes Supabase
5. Mettre à jour les liens internes

### Étape 3 : Mettre à jour les liens dans les composants

Rechercher et remplacer :
- `/fr/admin` → `/${locale}/org/${slug}/admin`
- `/fr/card-editor` → `/${locale}/org/${slug}/card-editor`
- `/fr/nfc-editor` → `/${locale}/org/${slug}/nfc-editor`
- `/fr/products` → `/${locale}/org/${slug}/shop`

### Étape 4 : Adapter les API Routes

Déplacer et adapter :
- `app/api/admin/` → `app/api/org/[slug]/admin/`
- `app/api/cards/` → `app/api/org/[slug]/cards/`
- `app/api/nfc/` → `app/api/org/[slug]/nfc/`

### Étape 5 : Tests

Tester toutes les routes sur :
- `http://localhost:3000/fr/org/xarala-solutions/admin`
- `http://localhost:3000/fr/org/xarala-solutions/card-editor`
- `http://localhost:3000/fr/org/xarala-solutions/nfc-editor`
- `http://localhost:3000/fr/org/xarala-solutions/dashboard`

---

## 🔍 Pattern Standard pour Migration

### Avant (Mono-tenant)
```typescript
export default async function Page({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const { data: products } = await supabase
    .from('products')
    .select('*')
  
  return <div>...</div>
}
```

### Après (Multitenant)
```typescript
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function Page({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string }
}) {
  const supabase = await createSupabaseServerClient()
  
  // Récupérer l'organization
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('slug', slug)
    .single()
  
  if (orgError || !organization) {
    notFound()
  }
  
  const orgId = organization.id
  
  // Filtrer par organization_id
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('organization_id', orgId) // ← CRITIQUE
  
  return <div>...</div>
}
```

---

## ✅ Checklist de Migration

- [ ] Admin Dashboard migré
- [ ] Card Editor migré
- [ ] NFC Editor migré
- [ ] Dashboard utilisateur migré
- [ ] Tous les liens internes mis à jour
- [ ] API routes adaptées
- [ ] Tests effectués sur xarala-solutions
- [ ] Isolation multitenant vérifiée
- [ ] Pas de régression sur autres tenants

---

## 🚨 Notes Importantes

1. **Ne PAS supprimer les anciennes routes** tant que tout n'est pas testé
2. **Garder les anciennes routes** pour redirection si nécessaire
3. **Tester sur les 3 tenants** : Mooktar, Xarala, Foire Dakar
4. **Vérifier l'isolation** : chaque tenant ne doit voir que ses données

---

## 📚 Références

- Pattern multitenant : `app/[locale]/org/[slug]/page.tsx`
- Shop migré : `app/[locale]/org/[slug]/shop/page.tsx`
- Documentation multitenant : `docs/MULTITENANT_PRODUCTS_MIGRATION.md`

