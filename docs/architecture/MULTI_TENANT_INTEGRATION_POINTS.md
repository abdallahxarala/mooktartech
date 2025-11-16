# Points d'intégration multi-tenant - Xarala Solutions

**Date** : 30 janvier 2025  
**Version** : 1.0  
**Objectif** : Identifier tous les points de modification pour migration multi-tenant

---

## 🎯 Vue d'ensemble

Ce document liste **tous les fichiers** qui devront être modifiés pour implémenter correctement le multi-tenant avec isolation complète des données.

---

## 📋 Fichiers à modifier

### **Tier 1 : Infrastructure (CRITIQUE)**

#### **Middleware & Routing**

| Fichier | Modifications | Complexité | Pr exemple |
|---------|---------------|------------|------------|
| `middleware.ts` | Détecter tenant par subdomain/domain, injecter dans request headers | 🔴 Élevé | `request.headers.set('x-tenant-id', tenantId)` |
| `lib/middleware/tenant-middleware.ts` | **CRÉER** : Middleware wrapper tenant-aware | 🔴 Élevé | Nouveau fichier |
| `i18n.config.ts` | Ajouter config locale par tenant | 🟡 Moyen | `tenant.locales` |

#### **Context & Hooks**

| Fichier | Modifications | Priorité |
|---------|---------------|----------|
| `lib/contexts/tenant-context.tsx` | ✅ Déjà créé - Vérifier | 🟢 Ready |
| `lib/hooks/use-tenant.ts` | **CRÉER** : Hook React pour accéder tenant | 🔴 Critique |
| `lib/hooks/use-auth.ts` | Ajouter tenant_id à user | 🔴 Critique |

---

### **Tier 2 : Stores Zustand (ISOLATION)**

#### **CRITIQUE - Storage keys à préfixer**

| Store | Modifications | Impact | Code example |
|-------|---------------|--------|--------------|
| `lib/store/products-store.ts` | Filter par `tenant_id`, prefix storage | 🔴 Élevé | `name: '${tenantId}-products'` |
| `lib/store/content-store.ts` | **CRITIQUE** : Content par tenant | 🔴 Élevé | Store isolé par tenant |
| `lib/store/auth.ts` | Ajouter `currentTenant`, multi-tenants | 🔴 Élevé | `user.tenants[]` |
| `lib/store/nfc-editor-store.ts` | Isoler profiles par tenant | 🟡 Moyen | `profile.tenant_id` |
| `lib/store/payment-store.ts` | Tenant-specific config | 🟡 Moyen | `tenant.payment.*` |
| `lib/store/cart-store.ts` | Peut rester user-specific | 🟢 Faible | Aucun changement |

#### **Modifications patterns**

**Avant** :
```typescript
export const useProductsStore = create()(
  persist((set, get) => ({...}), {
    name: 'xarala-products-storage' // ❌ Global
  })
)
```

**Après** :
```typescript
export const useProductsStore = create()(
  persist((set, get) => ({...}), {
    name: (tenantId) => `${tenantId}-products-storage` // ✅ Tenant-specific
  })
)
```

---

### **Tier 3 : API Routes (FILTERING)**

#### **Routes à modifier**

| Route | Modifications | Code example |
|-------|---------------|--------------|
| `app/api/orders/route.ts` | Ajouter `tenant_id`, filter queries | `.eq('tenant_id', tenantId)` |
| `app/api/payment/init/route.ts` | Config tenant-specific | `tenant.payment[method]` |
| `app/api/payment/status/route.ts` | Filter par tenant | `.eq('tenant_id', tenantId)` |
| `app/api/contact/route.ts` | Email tenant | `tenant.contact.email` |
| `app/api/upload-image/route.ts` | Storage isolation | `tenant/images/...` |
| `app/api/webhooks/**/route.ts` | Routeur tenant | Tenant detection |

#### **Routes OK (déjà isolées)**

- ✅ `app/api/cards/**` - Déjà filtré par user_id
- ✅ Supabase RLS policies actives

---

### **Tier 4 : Pages (UI)**

#### **Pages publiques**

| Page | Modifications | Priorité |
|------|---------------|----------|
| `app/[locale]/page.tsx` | Charger content/theme tenant | 🔴 Critique |
| `app/[locale]/products/page.tsx` | Filter produits par tenant | 🔴 Critique |
| `app/[locale]/about/page.tsx` | Content dynamique tenant | 🔴 Critique |
| `app/[locale]/contact/page.tsx` | Info contact tenant | 🟡 Moyen |

#### **Pages admin**

| Page | Modifications | Priorité |
|------|---------------|----------|
| `app/[locale]/admin/**/page.tsx` | Tenant admin dashboard | 🔴 Critique |
| `app/[locale]/nfc-editor/page.tsx` | Header tenant theme | 🟢 Faible |
| `app/[locale]/dashboard/page.tsx` | Stats tenant-specific | 🟡 Moyen |

#### **Composants**

| Composant | Modifications |
|-----------|---------------|
| `components/layout/header.tsx` | Logo/colors tenant |
| `components/layout/footer.tsx` | Contact info tenant |
| `components/hero-carousel.tsx` | Content tenant-specific |

---

### **Tier 5 : Database**

#### **Nouvelles migrations à créer**

| Migration | Objectif | Fichier |
|-----------|----------|---------|
| Add tenant_id to products | `products.tenant_id` | `YYYYMMDD_add_tenants.sql` |
| Create tenants table | `tenants` table | `YYYYMMDD_create_tenants.sql` |
| Create user_tenants junction | Many-to-many | `YYYYMMDD_user_tenants.sql` |
| Add tenant_id to orders | Orders isolation | `YYYYMMDD_orders_tenant.sql` |
| RLS policies update | Tenant-aware | `YYYYMMDD_rls_tenants.sql` |

#### **Modifications SQL**

**Exemple** :
```sql
-- Add tenant_id to existing tables
ALTER TABLE products ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE orders ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Create junction table
CREATE TABLE user_tenants (
  user_id UUID REFERENCES users(id),
  tenant_id UUID REFERENCES tenants(id),
  role TEXT, -- 'owner', 'admin', 'member', 'viewer'
  PRIMARY KEY (user_id, tenant_id)
);

-- Update RLS
CREATE POLICY "Users see own tenant products"
  ON products FOR SELECT
  USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

---

## 🆕 Nouveaux fichiers à créer

### **Infrastructure**

| Fichier | Responsabilité |
|---------|----------------|
| `lib/middleware/tenant-middleware.ts` | Middleware helper |
| `lib/hooks/use-tenant.ts` | React hook tenant |
| `lib/utils/tenant-helpers.ts` | Utilitaires tenant |
| `lib/services/tenant-service.ts` | API calls tenant |

### **Database**

| Fichier | Responsabilité |
|---------|----------------|
| `supabase/migrations/YYYYMMDD_tenants.sql` | Tables tenants |
| `supabase/migrations/YYYYMMDD_rls_tenants.sql` | Policies multi-tenant |

### **Config**

| Fichier | Responsabilité |
|---------|----------------|
| `lib/config/tenant-defaults.ts` | Default values |
| `lib/types/tenant.ts` | Types TypeScript |

### **Components**

| Fichier | Responsabilité |
|---------|----------------|
| `components/tenant/tenant-switcher.tsx` | UI switch tenant |
| `components/tenant/tenant-header.tsx` | Header tenant theme |

---

## 📦 Dépendances à ajouter

### **Nouvelles dépendances**

```json
{
  // Aucune nouvelle dépendance majeure nécessaire
  // Utiliser l'existant Supabase
}
```

### **Variables d'environnement**

```env
# Multi-tenant
NEXT_PUBLIC_DEFAULT_TENANT=xarala
NEXT_PUBLIC_TENANT_DETECTION=domain
NEXT_PUBLIC_SUBDOMAIN_ENABLED=true

# Storage per tenant
NEXT_PUBLIC_CLOUDINARY_FOLDER=tenants

# Analytics
NEXT_PUBLIC_ANALYTICS_TENANT_TRACKING=true
```

---

## 🔄 Ordre de migration recommandé

### **Phase 1 : Foundation (1 jour)**

**Jour 1 - Infrastructure**
- ✅ Créer `lib/hooks/use-tenant.ts`
- ✅ Modifier `lib/config/tenants.ts` si besoin
- ✅ Créer migration SQL `tenants` table
- ✅ Créer `lib/utils/tenant-helpers.ts`

**Validation** :
- Hook returns tenant config
- DB table `tenants` créée
- Helper functions testées

### **Phase 2 : Middleware (1 jour)**

**Jour 2 - Routing**
- ✅ Modifier `middleware.ts` pour tenant detection
- ✅ Créer `lib/middleware/tenant-middleware.ts`
- ✅ Tester subdomain routing
- ✅ Tester domain routing

**Validation** :
- `xarala.localhost:3000` → tenant xarala
- `site2.localhost:3000` → tenant site2
- Headers `x-tenant-id` injectés

### **Phase 3 : Stores (2 jours)**

**Jour 3-4 - State isolation**

**Priorité 1** :
- ✅ `content-store.ts` (CRITIQUE)
- ✅ `auth.ts` (user.tenants)
- ✅ `products-store.ts`

**Priorité 2** :
- ✅ `nfc-editor-store.ts`
- ✅ `payment-store.ts`

**Validation** :
- Content différents par tenant
- Products filtrés correctement
- No data leakage

### **Phase 4 : API Routes (1 jour)**

**Jour 5 - Backend filtering**
- ✅ Modifier `/api/orders`
- ✅ Modifier `/api/payment/init`
- ✅ Modifier `/api/contact`
- ✅ Modifier `/api/upload-image`

**Validation** :
- API return data tenant-specific
- No cross-tenant access

### **Phase 5 : UI Pages (1 jour)**

**Jour 6 - Interface**
- ✅ Modifier homepage (theme)
- ✅ Modifier products page (filter)
- ✅ Modifier about/contact (content)

**Validation** :
- UI adapte per tenant
- No UI bugs

### **Phase 6 : Tests (1 jour)**

**Jour 7 - Quality**
- ✅ Tests E2E multi-tenant
- ✅ Tests data isolation
- ✅ Performance checks

**Validation** :
- 0 errors
- 0 data leaks
- Performance OK

---

## ⚠️ Risques identifiés par fichier

### **content-store.ts** 🔴

**Risque** : Content global → switch tenant → data mélangée  
**Impact** : CRITIQUE  
**Mitigation** :
- Storage key : `content-${tenantId}`
- Clear on tenant switch
- Separate stores per tenant

### **products-store.ts** 🔴

**Risque** : Catalogue partagé  
**Impact** : CRITIQUE  
**Mitigation** :
- Always filter `.eq('tenant_id', tenantId)`
- Storage key : `products-${tenantId}`
- Default products per tenant

### **auth.ts** 🔴

**Risque** : User multi-tenant confusion  
**Impact** : CRITIQUE  
**Mitigation** :
- Junction table `user_tenants`
- Tenant selection modal
- Session per tenant

### **middleware.ts** 🔴

**Risque** : Tenant detection fail  
**Impact** : CRITIQUE  
**Mitigation** :
- Fallback default tenant
- Logging détection
- Health checks

### **API routes** 🟡

**Risque** : Forget tenant filtering  
**Impact** : Moyen  
**Mitigation** :
- Helper `withTenantFilter()`
- Linter rules
- Tests automatiques

---

## ✅ Checklist de migration

### **Pre-migration**

- [ ] Backup snapshot créé ✅
- [ ] Documentation updated
- [ ] Tests baseline passent
- [ ] Team briefed

### **Migration**

- [ ] Phase 1 : Infrastructure
- [ ] Phase 2 : Middleware
- [ ] Phase 3 : Stores
- [ ] Phase 4 : API Routes
- [ ] Phase 5 : Pages
- [ ] Phase 6 : Tests

### **Post-migration**

- [ ] 0 data leaks
- [ ] 0 errors console
- [ ] Performance OK
- [ ] Users test OK
- [ ] Rollback plan ready

---

## 📊 Estimation finale

### **Effort total**

- **Fichiers modifiés** : ~60
- **Fichiers créés** : ~10
- **Temps estimé** : 7 jours
- **Complexité** : 🟡 Moyenne
- **Risque** : 🟡 Moyen (rollback ready)

### **Breaking changes**

| Changement | Impact | Mitigation |
|------------|--------|------------|
| Storage keys | 🔴 HIGH | Migration script localStorage |
| Auth structure | 🔴 HIGH | v1 compatibility |
| API responses | 🟡 MEDIUM | Versioning API |
| DB schema | 🟡 MEDIUM | Migration SQL |

---

## 🎯 Priorités

### **Must-have (MVP)**

1. Tenant detection middleware
2. Content store isolation
3. Products tenant filtering
4. Auth multi-tenant

### **Should-have**

5. API routes filtering
6. Storage isolation
7. Analytics tenant-specific

### **Nice-to-have**

8. Tenant switcher UI
9. Custom domains per tenant
10. Tenant admin dashboard

---

**Ce document guide la migration multi-tenant étape par étape.**

