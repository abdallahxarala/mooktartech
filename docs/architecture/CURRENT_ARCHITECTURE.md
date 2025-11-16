# Architecture actuelle - Xarala Solutions

**Date** : 30 janvier 2025  
**Version** : 1.0 (Pre-multi-tenant)  
**Statut** : 🟢 Stable

---

## 📐 Vue d'ensemble

L'application Xarala Solutions est construite sur **Next.js 14** avec App Router et utilise une architecture modulaire basée sur :
- **Zustand** pour le state management
- **Supabase** pour le backend (configuré mais non activé)
- **localStorage** pour la persistance actuelle
- **next-intl** pour l'internationalisation

---

## 🏗️ Schéma de l'architecture actuelle

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PAGES (Next.js App Router)              │  │
│  │  /fr/page.tsx (homepage)                             │  │
│  │  /fr/products/[slug]/page.tsx                        │  │
│  │  /fr/cart/page.tsx                                   │  │
│  │  /fr/checkout/page.tsx                               │  │
│  │  /fr/nfc-editor/page.tsx ✨                          │  │
│  │  /fr/admin/**/page.tsx                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            ZUSTAND STORES (9 stores)                 │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ products-store.ts  → localStorage            │   │  │
│  │  │ cart-store.ts      → localStorage            │   │  │
│  │  │ content-store.ts   → localStorage            │   │  │
│  │  │ nfc-editor-store.ts → localStorage           │   │  │
│  │  │ auth.ts             → localStorage           │   │  │
│  │  │ payment-store.ts    → localStorage           │   │  │
│  │  │ card-editor-store.ts → localStorage          │   │  │
│  │  │ card-designer-store.ts → localStorage        │   │  │
│  │  │ unified.ts          → localStorage           │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           COMPONENTS (301 composants)                │  │
│  │  nfc-wizard/ (14)                                    │  │
│  │  products/ (72)                                      │  │
│  │  card-editor/ (33)                                   │  │
│  │  auth/ (7)                                           │  │
│  │  admin/ (10)                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                      SERVER (Next.js API)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API ROUTES (12 endpoints)               │  │
│  │  /api/orders          → Log console                  │  │
│  │  /api/payment/init    → Simulation mobile            │  │
│  │  /api/payment/status  → Simulation                   │  │
│  │  /api/contact         → SMTP (optionnel)             │  │
│  │  /api/cards/**        → Supabase 🟡                  │  │
│  │  /api/upload-image    → Cloudinary/local             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               SUPABASE (Configuré)                   │  │
│  │  • PostgreSQL : Migrations SQL prêtes               │  │
│  │  • Auth : NextAuth intégré                          │  │
│  │  • Storage : Configuré (non utilisé)                │  │
│  │  • RLS : Policies définies                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ❌ ACTUELLEMENT : Non activé (simulation localStorage)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Stores Zustand - Détail complet

### **Inventaire des stores (12 fichiers)**

| Store | Fichier | Storage | Statut |
|-------|---------|---------|---------|
| Products | `products-store.ts` | `xarala-products-storage` | ✅ Opérationnel |
| Cart | `cart-store.ts` | `cart-storage` | ✅ Opérationnel |
| Content | `content-store.ts` | `content-storage` | ✅ Opérationnel |
| NFC Editor | `nfc-editor-store.ts` | `nfc-editor-storage` | ✅ Opérationnel |
| Auth | `auth.ts` | `auth-storage` | ✅ Opérationnel |
| Payment | `payment-store.ts` | `payment-storage` | ✅ Opérationnel |
| Card Editor | `card-editor-store.ts` | `card-editor-storage` | ✅ Opérationnel |
| Card Designer | `card-designer-store.ts` | `card-designer-storage` | ✅ Opérationnel |
| Unified | `unified.ts` | `unified-storage` | ✅ Opérationnel |
| App | `app-store.ts` | `xarala-app-store` | ✅ Opérationnel |
| Cart (alias) | `cart.ts` | `cart-storage` | ✅ Alias |

### **1. products-store.ts** ✨ E-commerce

**Responsabilités** :
- Catalogue produits (30+)
- CRUD produits
- Filtres, recherche, tri
- Stock management

**Persist Strategy** :
- **Storage** : `xarala-products-storage`
- **Partialize** : `{ products }` uniquement
- **Backend** : ❌ localStorage uniquement

**API actuelle** :
- Load : localStorage → PRODUCTS fallback
- Add : Set state (pas d'API)
- Update : Set state (pas d'API)
- Delete : Set state (pas d'API)

**⚠️ Multi-tenant impact** :
- Nécessite `tenant_id` dans chaque produit
- Isolation par tenant
- Produits partagés vs tenant-specific

### **2. cart-store.ts** 🛒 E-commerce

**Responsabilités** :
- Panier items
- Quantités
- Totaux
- Getter helpers

**Persist Strategy** :
- **Storage** : `cart-storage`
- **Partialize** : Tout le state

**⚠️ Multi-tenant impact** :
- Cart est utilisateur-spécifique
- Peut être partagé entre tenants si user multi-tenant
- Isoler par `user_id` + `tenant_id`

### **3. content-store.ts** 📝 CMS

**Responsabilités** :
- Team members
- Company values
- Stats
- Timeline
- Certifications
- Contact info

**Persist Strategy** :
- **Storage** : `content-storage`
- **Default data** : Embedded

**⚠️ Multi-tenant impact** :
- **CRITIQUE** : Content doit être tenant-specific
- Headers, footers, about : par tenant
- Team members : par tenant
- Contact info : par tenant

### **4. nfc-editor-store.ts** ✨ SaaS NFC

**Responsabilités** :
- Profils NFC utilisateurs
- Wizard state
- Social links, custom fields
- Leads capture
- Analytics

**Persist Strategy** :
- **Storage** : `nfc-editor-storage`
- **Partialize** : `{ profiles, leads, analytics }`

**⚠️ Multi-tenant impact** :
- Profils : `user_id` + `tenant_id`
- Leads : isolés par tenant
- Analytics : par tenant
- **SNAPSHOT** : Tenant dans slug

### **5. auth.ts** 🔐 Authentication

**Responsabilités** :
- User state
- Roles (buyer/creator)
- IsAuthenticated
- Logout

**Persist Strategy** :
- **Storage** : `auth-storage`
- **Backend** : ⚠️ Incomplet

**⚠️ Multi-tenant impact** :
- User peut appartenir à plusieurs tenants
- Roles par tenant
- Sessions par tenant
- **CRITIQUE** : Modifier ExtendedUser

### **6. payment-store.ts** 💳 Payments

**Responsabilités** :
- Historique paiements
- Current payment
- Status tracking

**⚠️ Multi-tenant impact** :
- Isoler par tenant
- Webhooks tenant-specific
- Config par tenant (Wave vs Orange)

### **7-9. Autres stores**

- **card-editor-store** : Éditeur cartes PVC
- **card-designer-store** : Designer avancé
- **unified.ts** : Store global unifié
- **app-store.ts** : État app (duplicate products ?)

---

## 🔌 API Routes - Analyse détaillée

### **Structure actuelle**

```
app/api/
├── orders/
│   └── route.ts               ✅ POST (simulation)
├── payment/
│   ├── init/route.ts          ✅ POST (simulation Wave/Orange/Free)
│   ├── status/route.ts        ✅ GET (simulation)
│   └── webhook/
│       ├── wave/route.ts      ✅ POST (logs)
│       └── orange/route.ts    ✅ POST (logs)
├── contact/
│   └── route.ts               ✅ POST (SMTP optionnel)
├── cards/
│   ├── route.ts               ✅ GET, POST (Supabase)
│   ├── [id]/route.ts          ✅ GET, PATCH, DELETE (Supabase)
│   └── [id]/analytics/
│       └── route.ts           ✅ GET (Supabase)
├── upload-image/
│   └── route.ts               ✅ POST (Cloudinary local)
└── webhooks/
    └── route.ts               ✅ POST (logs)
```

### **E-commerce routes**

#### **`/api/orders/route.ts`**

**Méthodes** : POST  
**Fonction** : Créer commande  
**Backend** : ❌ Log console uniquement  
**Retour** : `{ orderId, success }`

**Code actuel** :
```typescript
const orderId = `XAR-${Date.now()}-${random()}`
console.log('📦 NEW ORDER:', { orderId, ...data })
return { success: true, orderId }
```

**⚠️ Multi-tenant modifications** :
```typescript
// À ajouter
const tenantId = getTenantFromRequest(request)
const userId = session?.user?.id

// Stockage
await supabase.from('orders').insert({
  tenant_id: tenantId,
  user_id: userId,
  order_number: orderId,
  ...orderData
})
```

#### **`/api/payment/init/route.ts`**

**Méthodes** : POST  
**Fonction** : Initier paiement mobile  
**Backend** : ❌ Simulation Wave/Orange/Free  
**Retour** : `{ checkoutUrl, paymentId }`

**⚠️ Multi-tenant modifications** :
```typescript
// Tenant config
const tenant = await getTenant(request)
const provider = tenant.payment[method] // Wave/Orange/Free config

// API réelle
const response = await initiatePayment(provider, { ... })
```

### **CMS routes**

#### **`/api/contact/route.ts`**

**Méthodes** : POST  
**Fonction** : Envoyer message  
**Backend** : SMTP si configuré, sinon log  

**⚠️ Multi-tenant modifications** :
```typescript
const tenant = await getTenant(request)
const toEmail = tenant.contact.email

await transporter.sendMail({
  to: toEmail, // Email tenant
  ...
})
```

### **Cards routes (avec Supabase)** 🟡

#### **`/api/cards/route.ts`**

**Méthodes** : GET, POST  
**Backend** : ✅ Supabase  
**Auth** : ✅ Session requise  

**Code actuel** :
```typescript
// GET: session.user.id filtré
// POST: user_id: session.user.id

const { data: cards } = await supabase
  .from('virtual_cards')
  .select('*')
  .eq('user_id', session.user.id) // ✅ Déjà isolé
```

**✅ Ok pour multi-tenant** :
- Déjà filtré par `user_id`
- RLS policies actives
- Pas de modification nécessaire

---

## 💾 Gestion des données actuelle

### **Persist Strategy**

| Store | Mécanisme | Backend | Migration |
|-------|-----------|---------|-----------|
| Products | localStorage | ❌ Non | Supabase table |
| Cart | localStorage | ❌ Non | Supabase + localStorage |
| Content | localStorage | ❌ Non | Supabase table |
| NFC Editor | localStorage | ❌ Non | Supabase table |
| Auth | localStorage | ⚠️ Partiel | Supabase auth |
| Payment | localStorage | ❌ Non | Supabase table |
| Cards | Supabase | ✅ Oui | Déjà OK |

### **Problèmes actuels**

#### **1. Pas de backend centralisé**
```
localStorage → Différent sur chaque device
Pas de sync multi-appareils
Pas de backup automatique
Limite 5-10MB
```

#### **2. Pas de tenant isolation**
```
Tous les users voient mêmes produits
Content partagé globalement
Analytics mélangés
```

#### **3. Auth incomplet**
```
localStorage seulement
Pas de sessions sécurisées
Pas de JWT validation
Pas de SSO
```

---

## 🔐 Points d'authentification existants

### **Supabase Auth (configuré)**

**Fichiers** :
```
lib/supabase/client.ts        ✅ Browser client
lib/supabase/server.ts        ✅ Server client
lib/supabase/middleware.ts    ✅ Middleware helper
```

**Hook custom** :
```
lib/hooks/use-auth.ts         ✅ Hook React
lib/store/auth.ts             ✅ Zustand store
```

**Middleware** :
```
middleware.ts                 ✅ Route protection
- Protected routes
- Admin routes
- API auth
- Redirects
```

### **Tables DB (migrations SQL)**

```sql
-- users (base)
- id, email, full_name, role

-- buyer_profiles (Ajouté)
- id, total_orders, total_spent, reward_points

-- creator_profiles (Ajouté)
- id, total_designs, public_profile_url

-- buyer_favorites
- user_id, product_id

-- creator_designs
- user_id, design_data, is_public

-- user_activity
- user_id, activity_type, metadata
```

### **Functions & Triggers**

```sql
-- activate_buyer_role(user_uuid)
-- activate_creator_role(user_uuid)
-- update_updated_at_column()
```

### **RLS Policies**

✅ Déjà configurées :
- Users can read own data
- Users can update own data
- Public designs/templates readable
- Admin-only routes

---

## 🧩 Composants architecturaux

### **Routing structure**

```
app/
├── [locale]/                 # I18n routing
│   ├── page.tsx              # Homepage
│   ├── products/             # Catalog
│   ├── cart/                 # Cart
│   ├── checkout/             # Checkout
│   ├── nfc-editor/           # ✨ SaaS NFC
│   ├── admin/                # Admin dashboards
│   └── auth/                 # Auth pages
├── (sites)/                  # ⚠️ Tenant grouping (partiel)
│   ├── xarala/               # Default tenant
│   ├── site2/                # Placeholder
│   └── site3/                # Placeholder
└── api/                      # API routes
    ├── orders/               # E-commerce
    ├── payment/              # Payments
    ├── cards/                # Cards (Supabase)
    └── webhooks/             # Webhooks
```

### **Tenant routing actuel**

**Partiellement implémenté** :
```
app/(sites)/xarala/[locale]/page.tsx   ✅
app/(sites)/site2/[locale]/page.tsx    ⚠️ Placeholder
app/(sites)/site3/[locale]/page.tsx    ⚠️ Placeholder
```

**Config** :
```
lib/config/tenants.ts          ✅ TENANTS object
lib/contexts/tenant-context.tsx ✅ React Context
```

**Pas implémenté** :
- ❌ Middleware tenant detection
- ❌ Subdomain routing
- ❌ Store isolation par tenant
- ❌ API tenant filtering

---

## 🔍 Analyse des dépendances

### **Backend**

```json
{
  "@supabase/supabase-js": "^2.39.8",    ✅ Configuré
  "@supabase/ssr": "^0.7.0",             ✅ SSR ready
  "@supabase/auth-helpers-nextjs": "^0.10.0" ⚠️ Legacy
}
```

### **State management**

```json
{
  "zustand": "^4.5.7",                   ✅ Actif
  "zustand/middleware/persist"           ✅ localStorage
}
```

**LocalStorage keys actuels** :
```
- xarala-products-storage
- cart-storage
- content-storage
- nfc-editor-storage
- auth-storage
- payment-storage
- card-editor-storage
- card-designer-storage
- unified-storage
- xarala-app-store
```

### **Images & Storage**

```json
{
  "cloudinary": "^2.8.0",                ⚠️ Configuré
  "next-cloudinary": "^6.16.3",          ⚠️ Configuré
  "browser-image-compression": "^2.0.2"  ✅ Actif (Base64)
}
```

---

## 🎯 Points d'intégration multi-tenant identifiés

### **Niveau 1 : Configuration**

**Files** :
- ✅ `lib/config/tenants.ts` - Déjà créé
- ✅ `lib/contexts/tenant-context.tsx` - Déjà créé
- ❌ `lib/hooks/use-tenant.ts` - À créer

### **Niveau 2 : Middleware**

**File** :
- ⚠️ `middleware.ts` - À modifier
- ❌ `lib/middleware/tenant-middleware.ts` - À créer

### **Niveau 3 : Stores**

**12 stores à modifier** :
- ✅ `auth.ts` - `tenant_id` ajout
- ✅ `products-store.ts` - Filtrage tenant
- ✅ `cart-store.ts` - Isolation tenant
- ✅ `content-store.ts` - CRITIQUE tenant
- ✅ `nfc-editor-store.ts` - Profils tenant
- ✅ `payment-store.ts` - Config tenant

### **Niveau 4 : API Routes**

**12 routes à modifier** :
- ✅ `/api/orders` - Tenant filtering
- ✅ `/api/payment/**` - Config tenant
- ✅ `/api/contact` - Email tenant
- ✅ `/api/cards` - Déjà isolé
- ✅ `/api/upload-image` - Storage tenant

### **Niveau 5 : Pages**

**Pages publiques** :
- ✅ Homepage : Tenant theme
- ✅ Products : Tenant catalog
- ✅ About : Tenant content
- ✅ Contact : Tenant info

**Pages auth** :
- ✅ Dashboard : Tenant-specific
- ✅ NFC editor : Tenant isolation
- ✅ Admin : Tenant admin

---

## 📊 Matrice d'impact multi-tenant

### **Impact HIGH** 🔴

| Composant | Raison | Éffort |
|-----------|--------|--------|
| content-store.ts | CMS global → tenant-specific | 🟡 Moyen |
| Products DB | Catalogue partagé | 🔴 Élevé |
| Upload images | Storage isolation | 🟡 Moyen |
| Middleware | Tenant detection | 🔴 Élevé |

### **Impact MEDIUM** 🟡

| Composant | Raison | Éffort |
|-----------|--------|--------|
| cart-store | Peut rester user-specific | 🟢 Faible |
| auth.ts | Multi-tenant users | 🟡 Moyen |
| nfc-editor-store | Déjà slug-based | 🟢 Faible |
| API contact | Email routing | 🟢 Faible |

### **Impact LOW** 🟢

| Composant | Raison | Éffort |
|-----------|--------|--------|
| card-editor-store | User-specific | 🟢 Faible |
| payment-store | Transaction tracking | 🟡 Moyen |

---

## ⚠️ Risques identifiés

### **Risque 1 : Data leakage entre tenants**

**Scénario** : User A (tenant X) voit produits de tenant Y

**Mitigation** :
- Always filter par `tenant_id`
- RLS policies strictes
- Middleware validation

### **Risque 2 : localStorage collision**

**Scénario** : Switch tenant → données mélangées

**Mitigation** :
- Préfixer storage keys avec tenant_id
- Clear on tenant switch
- Isolate state per tenant

### **Risque 3 : Auth multi-tenant**

**Scénario** : User appartient à 2 tenants

**Mitigation** :
- Junction table `user_tenants`
- Tenant selection UI
- Session tenant-specific

### **Risque 4 : Performance**

**Scénario** : 100 tenants → Requêtes lentes

**Mitigation** :
- Indexes DB
- Query optimization
- Caching tenant-specific
- CDN assets per tenant

---

## ✅ Points positifs actuels

### **Structure solide**
- ✅ Architecture modulaire
- ✅ Separations of concerns
- ✅ Type safety (TypeScript strict)
- ✅ Composants réutilisables

### **Infrastructure prête**
- ✅ Supabase configuré
- ✅ Migrations SQL prêtes
- ✅ RLS policies définies
- ✅ Tenant config structuré

### **Backwards compatible**
- ✅ Store persist existant
- ✅ Api routes fonctionnelles
- ✅ No breaking changes needed

---

## 📈 Évaluation de l'effort

### **Migration multi-tenant estimée**

| Phase | Fichiers | Temps | Complexité |
|-------|----------|-------|------------|
| 1. Infrastructure | 5 fichiers | 2h | 🟢 Faible |
| 2. Middleware | 3 fichiers | 4h | 🟡 Moyen |
| 3. Stores | 12 fichiers | 8h | 🔴 Élevé |
| 4. API Routes | 12 fichiers | 6h | 🟡 Moyen |
| 5. Pages | 20 fichiers | 4h | 🟢 Faible |
| 6. Tests | - | 6h | 🟡 Moyen |
| **TOTAL** | **~60 fichiers** | **30h** | **🟡 Moyen** |

---

**Ce document capture l'état exact actuel pour migration multi-tenant.**

