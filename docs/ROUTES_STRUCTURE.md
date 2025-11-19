# 🗺️ Structure des Routes - Multitenant

**Date** : 2025-02-02  
**Version** : v0.2.0-post-migration

---

## 📊 Routes Multitenant (Structure finale)

### Xarala Solutions

```
/fr/org/xarala-solutions
├── / (homepage complète avec services)
├── /admin (dashboard admin)
├── /nfc-editor (éditeur NFC)
├── /badge-editor/pro (badge designer)
├── /shop (boutique produits)
└── /cart (panier)
```

**Sections homepage** :
- ✅ Hero Carousel
- ✅ Logos clients
- ✅ Services (Cartes PVC, NFC, Éditeur)
- ✅ CTA comparative (pack tout-en-un)
- ✅ Produits phares (imprimantes)
- ✅ Garanties
- ✅ Témoignages
- ✅ Processus (Comment ça marche)
- ✅ CTA final
- ✅ FAQ

---

### Mooktar Tech

```
/fr/org/mooktartech-com
└── / (e-commerce avec 27 produits)
```

---

### Foire Dakar 2025

```
/fr/org/foire-dakar-2025
└── /foires/foire-dakar-2025/
    ├── /inscription (formulaire exposants)
    ├── /catalogue (catalogue exposants)
    ├── /tickets (billetterie)
    └── /admin/ (dashboard admin événement)
```

---

## 🔄 Routes Dépréciées (Redirections)

Ces routes redirigent automatiquement vers les nouvelles routes multitenant :

| Ancienne Route | Nouvelle Route | Fichier |
|----------------|----------------|---------|
| `/fr/admin` | `/fr/org/xarala-solutions/admin` | `app/[locale]/admin/page.tsx` |
| `/fr/admin/products` | `/fr/org/xarala-solutions/admin/products` | `app/[locale]/admin/products/page.tsx` |
| `/fr/nfc-editor` | `/fr/org/xarala-solutions/nfc-editor` | `app/[locale]/nfc-editor/page.tsx` |
| `/fr/card-editor` | `/fr/org/xarala-solutions/nfc-editor` | `app/[locale]/card-editor/page.tsx` |
| `/fr/badge-editor/pro` | `/fr/org/xarala-solutions/badge-editor/pro` | `app/[locale]/badge-editor/pro/page.tsx` |
| `/fr/badge-editor` | `/fr/org/xarala-solutions/badge-editor/pro` | `app/[locale]/badge-editor/page.tsx` |

---

## 🗑️ Routes Supprimées

- ❌ `/fr/card-editor` (ancienne version NFC) → Redirigé vers `/nfc-editor`

---

## 📁 Structure des Fichiers

```
app/[locale]/
├── page.tsx (homepage Xarala originale - peut rester pour compatibilité)
├── admin/
│   └── page.tsx → REDIRECT vers /org/xarala-solutions/admin
├── nfc-editor/
│   └── page.tsx → REDIRECT vers /org/xarala-solutions/nfc-editor
├── card-editor/
│   └── page.tsx → REDIRECT vers /org/xarala-solutions/nfc-editor
├── badge-editor/
│   ├── page.tsx → REDIRECT vers /org/xarala-solutions/badge-editor/pro
│   └── pro/
│       └── page.tsx → REDIRECT vers /org/xarala-solutions/badge-editor/pro
└── org/
    └── [slug]/
        ├── page.tsx (homepage multitenant)
        ├── xarala-homepage-client.tsx (composant client homepage Xarala)
        ├── admin/
        │   └── page.tsx ✅
        ├── nfc-editor/
        │   └── page.tsx ✅
        ├── badge-editor/
        │   └── pro/
        │       └── page.tsx ✅
        ├── card-editor/
        │   └── page.tsx → REDIRECT vers /nfc-editor
        ├── shop/
        │   └── page.tsx ✅
        └── cart/
            └── page.tsx ✅
```

---

## ✅ Routes Fonctionnelles

### Xarala Solutions

| Route | Statut | Description |
|-------|--------|-------------|
| `/fr/org/xarala-solutions` | ✅ COMPLET | Homepage avec toutes les sections |
| `/fr/org/xarala-solutions/admin` | ✅ OK | Dashboard admin avec filtres organization_id |
| `/fr/org/xarala-solutions/admin/products` | ✅ OK | Gestion produits avec filtres organization_id |
| `/fr/org/xarala-solutions/nfc-editor` | ✅ OK | Éditeur NFC |
| `/fr/org/xarala-solutions/badge-editor/pro` | ✅ OK | Badge Designer Pro |
| `/fr/org/xarala-solutions/shop` | ✅ OK | Boutique produits |
| `/fr/org/xarala-solutions/cart` | ✅ OK | Panier |

### Mooktar Tech

| Route | Statut | Description |
|-------|--------|-------------|
| `/fr/org/mooktartech-com` | ✅ OK | E-commerce avec 27 produits |

### Foire Dakar 2025

| Route | Statut | Description |
|-------|--------|-------------|
| `/fr/org/foire-dakar-2025/foires/foire-dakar-2025/inscription` | ✅ OK | Formulaire inscription exposants |
| `/fr/org/foire-dakar-2025/foires/foire-dakar-2025/admin/dashboard` | ✅ OK | Dashboard admin événement |

---

## 🔗 Liens Internes

### Pattern Standard

**Dans les Server Components** :
```typescript
<Link href={`/${locale}/org/${slug}/admin`}>
```

**Dans les Client Components** :
```typescript
'use client'
import { useParams } from 'next/navigation'

const params = useParams()
const locale = params.locale as string
const slug = params.slug as string

<Link href={`/${locale}/org/${slug}/admin`}>
```

---

## 📝 Notes Importantes

1. **Isolation Multitenant** : Toutes les routes sous `/org/[slug]/` doivent filtrer par `organization_id`
2. **Redirections** : Les anciennes routes redirigent vers Xarala Solutions par défaut
3. **Homepage** : La homepage multitenant utilise `XaralaHomePageClient` pour Xarala Solutions
4. **Badge Editor** : Seule la route `/badge-editor/pro` est migrée, les autres routes restent à la racine

---

## 🧪 Tests Recommandés

### Xarala Solutions

1. ✅ `/fr/org/xarala-solutions` → Homepage complète (toutes sections)
2. ✅ `/fr/org/xarala-solutions/admin` → Dashboard admin
3. ✅ `/fr/org/xarala-solutions/admin/products` → Gestion produits
4. ✅ `/fr/org/xarala-solutions/nfc-editor` → NFC Editor
5. ✅ `/fr/org/xarala-solutions/badge-editor/pro` → Badge Designer
6. ✅ `/fr/org/xarala-solutions/shop` → Boutique

### Redirections

1. ✅ `/fr/admin` → Redirige vers `/fr/org/xarala-solutions/admin`
2. ✅ `/fr/admin/products` → Redirige vers `/fr/org/xarala-solutions/admin/products`
3. ✅ `/fr/nfc-editor` → Redirige vers `/fr/org/xarala-solutions/nfc-editor`
4. ✅ `/fr/card-editor` → Redirige vers `/fr/org/xarala-solutions/nfc-editor`
5. ✅ `/fr/badge-editor/pro` → Redirige vers `/fr/org/xarala-solutions/badge-editor/pro`

---

## 🔄 Migration Complète

### État Actuel

- ✅ Homepage multitenant complète avec toutes les sections
- ✅ Admin Dashboard migré avec filtres organization_id
- ✅ Admin Products migré avec filtres organization_id
- ✅ ProductForm adapté pour Supabase avec organization_id
- ✅ NFC Editor migré
- ✅ Badge Designer migré
- ✅ Card Editor redirigé
- ✅ Redirections créées pour anciennes routes admin
- ✅ Isolation multitenant implémentée

### ✅ Complété

- [x] Migrer Badge Designer Pro vers multitenant
- [x] Créer redirections pour anciennes routes
- [x] Mettre à jour tous les liens dans les composants globaux (Header, Footer, Navigation, MegaMenu)
- [x] Adapter tous les composants Client pour détecter le contexte multitenant
- [x] Corriger tous les liens hardcodés `/fr/...` vers structure dynamique
- [x] **Migrer routes admin** (`/admin` et `/admin/products`)
- [x] **Adapter ProductForm pour Supabase avec organization_id**
- [x] **Vérifier homepage Xarala (toutes sections présentes)**

### À Faire (Optionnel)

- [ ] Migrer autres routes badge-editor (design, events, import, print, templates)
- [ ] Créer page contact multitenant
- [ ] Adapter API routes pour multitenant
- [ ] Corriger liens `/products` dans composants (actuellement hardcodés)

---

## 📚 Références

- Pattern multitenant : `app/[locale]/org/[slug]/page.tsx`
- Homepage Xarala : `app/[locale]/org/[slug]/xarala-homepage-client.tsx`
- Documentation migration : `docs/XARALA_MIGRATION_PLAN.md`

