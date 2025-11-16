# 📊 ANALYSE COMPLÈTE D'ARCHITECTURE - INTÉGRATION PLATEFORME FOIRE

**Date:** 2025-01-30  
**Projet:** Xarala Solutions  
**Objectif:** Intégrer une plateforme de gestion de foire dans le système multitenant existant

---

## 1. RÉSUMÉ EXÉCUTIF

### Stack Principale
- **Framework:** Next.js 14.2.33 (App Router)
- **Langage:** TypeScript 5.3.3
- **Base de données:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth avec @supabase/ssr
- **State Management:** Zustand 4.5.7
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS)
- **i18n:** next-intl 3.9.4 (fr, en, wo)
- **Build Tool:** Next.js Turbopack (par défaut)
- **Package Manager:** npm

### Pattern Multitenant Utilisé
✅ **Organizations-based multitenancy** via table `organizations` avec:
- Identification par **slug** dans l'URL: `/org/[slug]/...`
- Isolation via `organization_id` dans les tables métier
- RLS (Row Level Security) basé sur `organization_members`
- Context récupéré via `middleware/orgContext.ts`

### Points Forts à Réutiliser
1. ✅ Architecture multitenant déjà en place et fonctionnelle
2. ✅ Système d'événements existant (`events`, `event_attendees`, `event_zones`)
3. ✅ Module exposants complet (`exhibitors`, `exhibitor_products`)
4. ✅ RLS policies bien structurées
5. ✅ Composants UI réutilisables (shadcn/ui)
6. ✅ Système d'authentification robuste
7. ✅ Internationalisation complète

### Gaps à Combler
1. ⚠️ Pas de table dédiée "foires" (utiliser `events` avec type='foire' ?)
2. ⚠️ Pas de gestion spécifique des stands/pavillons pour foires
3. ⚠️ Pas de système de réservation de stands
4. ⚠️ Pas de gestion de tarification par stand
5. ⚠️ Pas de module de planning/agenda pour foires
6. ⚠️ Pas de système de badges spécifique foire (existe déjà pour events)

---

## 2. ANALYSE DÉTAILLÉE PAR SECTION

### PARTIE 1 : ARCHITECTURE GÉNÉRALE

#### ✅ Stack Technique Détectée

**Framework Frontend:**
- Next.js 14.2.33 avec **App Router** (pas Pages Router)
- React 18.2.0
- TypeScript 5.3.3 (strict mode activé)

**Router:**
- App Router Next.js (`app/[locale]/...`)
- Routes dynamiques: `[locale]`, `[slug]`, `[eventId]`, `[id]`
- Internationalisation intégrée dans le routing

**Build Tool:**
- Next.js Turbopack (par défaut depuis Next.js 14)
- Configuration: `next.config.mjs`

**Package Manager:**
- npm (détecté via `package-lock.json`)

#### ✅ Structure des Dossiers

```
project/
├── app/                          # Routes Next.js App Router
│   ├── [locale]/                 # Routes localisées (fr, en, wo)
│   │   ├── org/[slug]/           # Routes tenant-specific
│   │   │   └── events/[eventId]/ # Routes événements
│   │   ├── auth/                 # Authentification
│   │   ├── dashboard/            # Dashboard utilisateur
│   │   └── ...
│   ├── api/                      # API Routes
│   │   ├── products/
│   │   ├── orders/
│   │   ├── payments/
│   │   └── ...
│   └── layout.tsx                # Layout racine
├── components/                    # Composants React
│   ├── ui/                       # Composants shadcn/ui (64 fichiers)
│   ├── auth/                     # Composants auth
│   ├── events/                   # Composants événements
│   ├── exhibitors/               # Composants exposants
│   └── ...
├── lib/                          # Logique métier
│   ├── supabase/                 # Clients Supabase
│   │   ├── server.ts             # Client serveur
│   │   ├── client.ts             # Client browser
│   │   ├── queries/              # Requêtes métier
│   │   └── middleware.ts          # Utilitaires middleware
│   ├── hooks/                    # Hooks React (30 fichiers)
│   ├── store/                    # Stores Zustand (14 fichiers)
│   ├── types/                    # Types TypeScript
│   ├── utils/                    # Utilitaires
│   └── services/                 # Services externes
├── supabase/
│   └── migrations/               # Migrations SQL (15 fichiers)
├── middleware.ts                 # Middleware Next.js
└── middleware/
    └── orgContext.ts             # Context organisation
```

**Où sont les pages/routes ?**
- `app/[locale]/` - Toutes les pages localisées
- `app/api/` - Routes API

**Où est le code API ?**
- `app/api/` - Route handlers Next.js
- `lib/supabase/queries/` - Fonctions de requête réutilisables

**Où sont les composants UI ?**
- `components/ui/` - Composants de base (shadcn/ui)
- `components/[module]/` - Composants métier par module

**Où est la logique métier ?**
- `lib/hooks/` - Hooks React
- `lib/store/` - State management Zustand
- `lib/supabase/queries/` - Requêtes Supabase
- `lib/services/` - Services externes

**Où sont les types TypeScript ?**
- `lib/types/` - Types métier
- `lib/types/database.types.ts` - Types générés Supabase

**Y a-t-il un dossier /lib ou /utils ?**
- ✅ `lib/` existe avec sous-dossiers organisés
- ✅ `lib/utils/` existe (23 fichiers)

#### ✅ Architecture Multitenant

**Comment les tenants sont-ils identifiés ?**
- Via **slug** dans l'URL: `/org/[slug]/events/[eventId]/...`
- Exemple: `/fr/org/xarala-solutions/events/foire-dakar-2025`

**Y a-t-il un middleware de détection tenant ?**
- ✅ Oui: `middleware/orgContext.ts`
- Fonction: `getOrganizationContext(slug: string)`
- Vérifie l'appartenance via `organization_members`

**Comment le context tenant est-il passé ?**
```typescript
// middleware/orgContext.ts
export async function getOrganizationContext(slug: string): Promise<OrganizationContext | null> {
  // Récupère l'organisation par slug
  // Vérifie que l'utilisateur est membre via organization_members
  // Retourne: { organization, membership, limits }
}
```

**Exemple de code montrant l'isolation tenant actuelle:**
```typescript
// Les tables ont organization_id
events.organization_id → organizations.id
exhibitors.organization_id → organizations.id

// RLS policies vérifient l'appartenance
create policy "Organization members can view events"
  on public.events for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = events.organization_id
        and organization_members.user_id = auth.uid()
    )
  );
```

#### ✅ Organisation du Code

**Pattern utilisé:**
- **Feature-based** avec éléments de **layer-based**
- Modules organisés par fonctionnalité (events, exhibitors, products)
- Séparation claire frontend/backend

**Conventions de nommage:**
- Composants: PascalCase (`CardDesignerPro.tsx`)
- Hooks: camelCase avec préfixe `use` (`use-auth.ts`)
- Stores: camelCase (`auth.ts`, `cart-store.ts`)
- Routes API: kebab-case (`app/api/products/route.ts`)

**Structure des modules:**
- Chaque module a ses composants dans `components/[module]/`
- Queries dans `lib/supabase/queries/[module].ts`
- Types dans `lib/types/[module].ts`

**Séparation frontend/backend:**
- Frontend: `app/[locale]/`, `components/`
- Backend: `app/api/`, `lib/supabase/`
- Shared: `lib/types/`, `lib/utils/`

---

### PARTIE 2 : BASE DE DONNÉES & BACKEND

#### ✅ Supabase Configuration

**Fichiers de configuration:**
- `lib/supabase/server.ts` - Client serveur
- `lib/supabase/client.ts` - Client browser
- `lib/supabase/index.ts` - Exports

**Client Supabase:**
- ✅ Server-side: `createSupabaseServerClient()` dans `lib/supabase/server.ts`
- ✅ Client-side: `createSupabaseBrowserClient()` dans `lib/supabase/client.ts`
- Utilise `@supabase/ssr` pour la gestion des cookies

**Fichier types auto-générés:**
- ✅ `lib/types/database.types.ts` - Types générés depuis Supabase
- Commande: `npm run db:generate`

**Migrations existantes:**
- `supabase/migrations/` - 15 fichiers SQL
- Principales migrations:
  - `00_init_xarala.sql` - Schéma initial
  - `20251109130000_multi_tenant.sql` - Système multitenant
  - `20251109140000_events_module.sql` - Module événements
  - `20241112120000_exhibitors_module.sql` - Module exposants

#### ✅ Schéma Database Actuel

**Table `organizations` (tenants):**
```sql
create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  logo_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  max_users int default 1,
  created_at timestamptz not null default now()
);
```

**Table `organization_members` (liaison user-tenant):**
```sql
create table public.organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
```

**Table `users` (profiles):**
```sql
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone_number text,
  company_name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin', 'moderator')),
  is_active boolean default true,
  last_login_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Table `events` (événements):**
```sql
create table public.events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references public.organizations(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  location text,
  status text not null default 'draft' check (
    status in ('draft', 'published', 'ongoing', 'completed', 'cancelled')
  ),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**Table `exhibitors` (exposants):**
```sql
create table exhibitors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade not null,
  organization_id uuid references organizations(id) on delete cascade not null,
  company_name text not null,
  slug text not null,
  -- ... autres champs
  status text default 'pending' check (status in ('pending', 'approved', 'active', 'rejected', 'cancelled')),
  payment_status text default 'unpaid',
  -- ...
);
```

**Pattern tenant_id:**
- ✅ Présent dans `events.organization_id`
- ✅ Présent dans `exhibitors.organization_id`
- ✅ Présent dans `nfc_cards.organization_id`
- ✅ Présent dans `organization_templates.organization_id`

#### ✅ Row Level Security (RLS)

**Policies RLS existantes:**

Exemple pour `events`:
```sql
create policy "Organization members can view events"
  on public.events for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_members.organization_id = events.organization_id
        and organization_members.user_id = auth.uid()
    )
    or status = 'published'
  );
```

**Fonctions PostgreSQL définies:**
- Pas de fonction `get_user_tenant_id()` trouvée
- Utilisation directe de `auth.uid()` dans les policies

**Pattern de sécurité utilisé:**
- RLS activé sur toutes les tables sensibles
- Vérification via `organization_members` pour l'isolation tenant
- Policies séparées pour SELECT, INSERT, UPDATE, DELETE

#### ✅ Supabase Features Utilisées

**Auth:**
- ✅ Supabase Auth configuré
- Providers: Email/Password (probablement, à vérifier)
- Session management via cookies (`@supabase/ssr`)

**Storage:**
- ✅ Supabase Storage utilisé
- Bucket: `xarala-assets` (d'après env.example)
- Migration: `20250130020000_storage_policies.sql`

**Realtime:**
- ⚠️ Pas de souscriptions actives détectées dans le code analysé

**Edge Functions:**
- ❌ Pas d'Edge Functions détectées

**Triggers:**
- ⚠️ Pas de triggers PostgreSQL détectés dans les migrations analysées

---

### PARTIE 3 : AUTHENTIFICATION & AUTORISATION

#### ✅ Système d'Authentification

**Provider auth:**
- ✅ Supabase Auth (pas NextAuth)
- Configuration dans `lib/supabase/server.ts` et `client.ts`

**Fichier de configuration auth:**
- `lib/supabase/server.ts` - Client serveur
- `lib/supabase/client.ts` - Client browser
- `lib/hooks/use-auth.ts` - Hook React

**Méthodes de login supportées:**
- Email/Password (confirmé par le code)
- Magic link (probable, standard Supabase)

**Session management:**
- Cookies via `@supabase/ssr`
- Store Zustand: `lib/store/auth.ts` (persisté dans localStorage)

#### ✅ Gestion des Rôles

**Système de rôles existant:**
- **User roles:** `user`, `admin`, `moderator` (table `users`)
- **Organization roles:** `owner`, `admin`, `member` (table `organization_members`)

**Comment les rôles sont stockés:**
- Dans la DB: `users.role` et `organization_members.role`
- Dans le store Zustand: `useAuthStore`

**Middleware de vérification permissions:**
- ✅ `middleware.ts` vérifie les routes admin
- ✅ `lib/supabase/middleware.ts` - Fonction `checkAdminPermissions()`

**Composants de protection de routes:**
- Middleware Next.js dans `middleware.ts`
- Vérification dans les Server Components

#### ✅ Guards & Middleware

**Middleware Next.js (`middleware.ts`):**
- Gère i18n (next-intl)
- Vérifie auth pour routes protégées
- Vérifie rôle admin pour routes `/admin`
- Routes protégées: `/dashboard`, `/admin`, `/profile`, `/settings`, `/orders`, `/analytics`, `/contacts`, `/payments`

**HOCs ou composants de protection:**
- Pas de HOC détecté, utilisation du middleware Next.js

**Hooks de vérification auth:**
- ✅ `lib/hooks/use-auth.ts` - Hook principal
- ✅ `lib/store/auth.ts` - Store Zustand pour l'état auth

---

### PARTIE 4 : COMPOSANTS UI RÉUTILISABLES

#### ✅ UI Library & Design System

**shadcn/ui utilisé:**
- ✅ Oui, 64 composants dans `components/ui/`
- Composants principaux: Button, Input, Form, Dialog, Table, Card, Select, etc.

**Tailwind CSS:**
- ✅ Configuration: `tailwind.config.ts`
- Couleurs personnalisées: Orange (#F97316) comme primary, Gris comme secondary
- Design System Xarala avec variables CSS

**Autres librairies UI:**
- Radix UI (via shadcn/ui)
- Framer Motion pour animations
- Lucide React pour icônes

**Système de thème:**
- ✅ Dark mode supporté via `next-themes`
- Variables CSS dans `app/globals.css`
- ThemeProvider dans `components/theme-provider.tsx`

#### ✅ Composants Formulaires

**Composants de formulaires existants:**
- ✅ `Input` (`components/ui/input.tsx`)
- ✅ `Textarea` (`components/ui/textarea.tsx`)
- ✅ `Select` (`components/ui/select.tsx`)
- ✅ `Checkbox` (`components/ui/checkbox.tsx`)
- ✅ `Radio` (`components/ui/radio-group.tsx`)
- ✅ `Form` (`components/ui/form.tsx`) - Wrapper react-hook-form

**Utilisation de react-hook-form:**
- ✅ Oui, intégré dans `components/ui/form.tsx`
- Version: 7.51.0

**Validation:**
- ✅ Zod 3.22.4 utilisé
- Intégration via `@hookform/resolvers`

**Composants de formulaire composites:**
- Pas de composants composites détectés dans l'analyse

#### ✅ Composants Layout

**Layout principal:**
- `app/layout.tsx` - Layout racine
- `app/[locale]/layout.tsx` - Layout localisé
- `components/layouts/main-layout.tsx` - Layout avec header/footer

**Sidebar, Header, Footer:**
- Header: `components/header.tsx`
- Footer: `components/footer.tsx`
- Navigation: `components/navigation/`

**Dashboard layout:**
- Pas de layout dashboard spécifique détecté

#### ✅ Composants Métier Réutilisables

**Tables de données:**
- ✅ `components/ui/table.tsx` - Composant Table de base
- Pas de TanStack Table détecté

**Modals/Dialogs:**
- ✅ `components/ui/dialog.tsx` - Dialog Radix UI
- ✅ `components/ui/alert-dialog.tsx` - Alert Dialog

**Cards produit/item:**
- ✅ `components/ui/product-card.tsx`
- ✅ `components/ui/card.tsx` - Card de base

**Upload de fichiers:**
- ✅ `components/ui/image-upload.tsx`
- ✅ `components/ui/image-cropper.tsx`
- Utilise `react-dropzone`

**Affichage images:**
- ✅ `components/product-image.tsx`
- ✅ `components/ui/contextual-image.tsx`

**Pagination:**
- ✅ `components/ui/pagination.tsx`

**Recherche/filtres:**
- Pas de composant générique détecté

**Date pickers:**
- ✅ `components/ui/calendar.tsx`

**Notifications/Toasts:**
- ✅ `components/ui/toast.tsx` - shadcn/ui Toast
- ✅ `react-hot-toast` également utilisé
- ✅ `sonner` pour notifications modernes

#### ✅ Hooks Personnalisés

**Hooks existants (`lib/hooks/`):**
- ✅ `use-auth.ts` - Authentification
- ✅ `use-auth-progressive.ts` - Auth progressive
- ✅ `use-cart.ts` - Gestion panier
- ✅ `use-contacts.ts` - Gestion contacts
- ✅ `use-payment.ts` - Gestion paiements
- ✅ `use-products.ts` - Gestion produits
- ✅ `use-supabase-query.ts` - Requêtes Supabase
- ✅ `use-translations.ts` - Traductions
- ✅ `use-locale.ts` - Locale actuelle
- ✅ `use-toast.ts` - Notifications toast
- ✅ `use-local-storage.ts` - LocalStorage
- ✅ `use-offline-storage.ts` - Stockage offline
- ✅ Et 18 autres hooks utilitaires

---

### PARTIE 5 : API & SERVICES

#### ✅ Structure API Routes

**Convention de nommage:**
- Routes dans `app/api/[module]/route.ts`
- Routes dynamiques: `app/api/[module]/[id]/route.ts`
- Exemple: `app/api/products/route.ts`, `app/api/products/[slug]/route.ts`

**Middleware commun:**
- Middleware Next.js dans `middleware.ts`
- Vérification auth pour routes protégées

**Error handling pattern:**
```typescript
try {
  // ...
  return NextResponse.json({ success: true, data: ... })
} catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { success: false, error: '...' },
    { status: 500 }
  )
}
```

**Response formatting standard:**
```typescript
{
  success: boolean,
  data?: any,
  error?: string
}
```

**Validation des requêtes:**
- Utilisation de Zod pour validation
- Validation dans les route handlers

#### ✅ Services Métier

**Services existants (`lib/services/`):**
- `cloudinary.ts` - Service Cloudinary
- `image-generator.ts` - Génération d'images

**Pattern utilisé:**
- Fonctions exportées (pas de classes)
- Gestion erreurs avec try/catch

**Logging:**
- `console.error()` pour les erreurs
- Pas de système de logging structuré détecté

#### ✅ Intégrations Externes

**APIs tierces intégrées:**
- ✅ Stripe (paiements)
- ✅ Orange Money WebPay
- ✅ Wave Money
- ✅ Cloudinary (images)
- ✅ Resend (emails)
- ✅ Twilio (SMS)
- ✅ Replicate (IA)

**Services de paiement:**
- Stripe, Orange Money, Wave Money

**Services email/SMS:**
- Resend (email)
- Twilio (SMS)

**Storage externe:**
- Supabase Storage
- Cloudinary

---

### PARTIE 6 : STATE MANAGEMENT

#### ✅ Solution de State Management

**Zustand utilisé:**
- ✅ Version 4.5.7
- Stores dans `lib/store/` (14 fichiers)

**Stores existants:**
- `auth.ts` - Authentification
- `cart-store.ts` - Panier
- `products-store.ts` - Produits
- `payment-store.ts` - Paiements
- `card-editor-store.ts` - Éditeur de cartes
- `badge-designer-store.ts` - Designer de badges
- Et 8 autres stores

**Pattern de mise à jour state:**
- Actions dans les stores Zustand
- Utilisation de `set()` pour les mises à jour

**Persistence state:**
- ✅ `zustand/middleware` avec `persist`
- Exemple: `auth.ts` persiste dans localStorage (`auth-storage`)

#### ✅ Server State

**TanStack Query (React Query):**
- ❌ Pas utilisé

**SWR:**
- ❌ Pas utilisé

**Configuration cache:**
- Pas de cache côté client détecté
- Utilisation directe de Supabase queries

**Hooks de mutations:**
- Hooks personnalisés dans `lib/hooks/`
- Exemple: `use-products.ts`, `use-contacts.ts`

---

### PARTIE 7 : STYLES & ASSETS

#### ✅ Configuration Tailwind

**tailwind.config.ts:**
- ✅ Configuration complète avec couleurs personnalisées
- Couleurs Xarala: Orange (#F97316) primary, Gris secondary
- Animations personnalisées (blob, float, glow, shimmer, etc.)
- Plugins: `tailwindcss-animate`

**Couleurs personnalisées:**
- Primary: Orange (#F97316) avec palette complète (50-950)
- Secondary: Gris (#374151) avec palette complète
- Couleurs Sénégal: green (#00853f), yellow (#fcd116), red (#ce1126)

**Plugins installés:**
- `tailwindcss-animate`

#### ✅ Global Styles

**globals.css:**
- ✅ `app/globals.css` avec variables CSS
- Variables shadcn/ui pour thème
- Animations personnalisées
- Utilities glassmorphism

**Variables CSS définies:**
- Variables shadcn/ui (--background, --foreground, etc.)
- Variables de thème

**Fonts utilisées:**
- Inter (Google Fonts)
- JetBrains Mono pour monospace

#### ✅ Assets Management

**Dossier public:**
- `public/images/` - Images
- `public/logos/` - Logos
- `public/products/` - Images produits
- `public/favicons/` - Favicons

**Comment les images sont gérées:**
- Next.js Image component utilisé
- Cloudinary pour optimisation
- Supabase Storage pour upload

**Optimisation images:**
- ✅ Next.js Image avec `next.config.mjs`
- Configuration: `remotePatterns` pour domaines externes

---

### PARTIE 8 : INTERNATIONALISATION

#### ✅ i18n Setup

**next-intl utilisé:**
- ✅ Version 3.9.4
- Configuration: `i18n.config.ts`

**Langues supportées:**
- `fr` (Français) - langue par défaut
- `en` (English)
- `wo` (Wolof)

**Fichiers de traductions:**
- `messages/fr.json`
- `messages/en.json`
- `messages/wo.json`

**Comment switch entre langues:**
- Via URL: `/fr/...`, `/en/...`, `/wo/...`
- Composant: `components/language-switcher.tsx`
- Middleware redirige automatiquement

---

### PARTIE 9 : TESTS & QUALITÉ

#### ✅ Tests

**Framework de test:**
- ✅ Jest configuré (`jest.config.js`)
- ✅ Playwright pour E2E (`playwright.config.ts`)

**Exemples de tests:**
- `__tests__/api/leads/` - Tests API
- `__tests__/e2e/checkout-flow.spec.ts` - Test E2E

**Coverage:**
- Commande: `npm run test:coverage`

#### ✅ Linting & Formatting

**ESLint:**
- ✅ Configuré (`eslint-config-next`)
- Commande: `npm run lint`

**Prettier:**
- ⚠️ Pas de fichier `.prettierrc` détecté

**Husky hooks:**
- ⚠️ Pas de Husky détecté

---

### PARTIE 10 : DÉPLOIEMENT & ENV

#### ✅ Variables d'Environnement

**env.example:**
- ✅ Fichier complet avec toutes les variables
- Variables Supabase: URL, ANON_KEY, SERVICE_ROLE_KEY
- Variables Auth: SITE_URL, AUTH_REDIRECT_URL
- Variables Paiements: Stripe, Orange Money, Wave
- Variables Email: Resend, SMTP
- Variables Storage: Supabase Storage, Cloudinary
- Variables i18n: DEFAULT_LOCALE, SUPPORTED_LOCALES

#### ✅ Configuration Build

**next.config.mjs:**
```javascript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl({
  reactStrictMode: true,
  images: { domains: [...], remotePatterns: [...] }
});
```

**Scripts package.json:**
- `dev`, `build`, `start` - Standard Next.js
- `lint`, `type-check` - Qualité code
- `test`, `test:e2e` - Tests
- `db:generate`, `db:push`, `db:migrate` - Base de données

**Configuration CI/CD:**
- ⚠️ Pas de fichiers CI/CD détectés

---

## 3. MATRICE DE RÉUTILISATION

| Composant Existant | Réutilisable pour Foire | Modifications Nécessaires | Priorité |
|-------------------|------------------------|---------------------------|----------|
| `organizations` table | ✅ Oui | Aucune | 🔴 Critique |
| `events` table | ✅ Oui | Ajouter champ `type` ('foire' vs 'event') | 🟡 Moyenne |
| `exhibitors` table | ✅ Oui | Aucune | 🔴 Critique |
| `event_attendees` table | ✅ Oui | Aucune | 🟢 Faible |
| `event_zones` table | ✅ Oui | Renommer en `foire_pavillons` ou ajouter type | 🟡 Moyenne |
| RLS policies | ✅ Oui | Adapter pour nouvelles tables foire | 🔴 Critique |
| `middleware/orgContext.ts` | ✅ Oui | Aucune | 🔴 Critique |
| Routes `/org/[slug]/events/` | ✅ Oui | Ajouter `/org/[slug]/foires/` | 🟡 Moyenne |
| Composants `exhibitors/` | ✅ Oui | Aucune | 🟢 Faible |
| Composants `events/` | ✅ Oui | Adapter pour foires | 🟡 Moyenne |
| `use-auth` hook | ✅ Oui | Aucune | 🟢 Faible |
| Composants UI (shadcn) | ✅ Oui | Aucune | 🟢 Faible |
| Système de paiements | ✅ Oui | Adapter pour réservation stands | 🟡 Moyenne |
| Système de badges | ✅ Oui | Aucune | 🟢 Faible |

---

## 4. PLAN D'INTÉGRATION RECOMMANDÉ

### Phase 1 : Base de Données (2-3h)

**Créer migration:**
```sql
-- supabase/migrations/20250130_foire_module.sql

-- Table foires (extension de events)
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'event' 
  CHECK (event_type IN ('event', 'foire', 'conference', 'exhibition'));

-- Table stands/pavillons
CREATE TABLE IF NOT EXISTS public.foire_stands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  foire_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  pavillon TEXT,
  area_sqm DECIMAL(10,2),
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied', 'maintenance')),
  exhibitor_id UUID REFERENCES exhibitors(id) ON DELETE SET NULL,
  reserved_at TIMESTAMPTZ,
  reserved_until TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(foire_id, number)
);

-- Table réservations stands
CREATE TABLE IF NOT EXISTS public.foire_stand_reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stand_id UUID REFERENCES foire_stands(id) ON DELETE CASCADE NOT NULL,
  exhibitor_id UUID REFERENCES exhibitors(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_reference TEXT,
  reserved_from TIMESTAMPTZ NOT NULL,
  reserved_until TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_foire_stands_foire ON foire_stands(foire_id);
CREATE INDEX idx_foire_stands_organization ON foire_stands(organization_id);
CREATE INDEX idx_foire_stands_status ON foire_stands(status);
CREATE INDEX idx_foire_stand_reservations_stand ON foire_stand_reservations(stand_id);
CREATE INDEX idx_foire_stand_reservations_exhibitor ON foire_stand_reservations(exhibitor_id);

-- RLS Policies
ALTER TABLE foire_stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE foire_stand_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view stands"
  ON foire_stands FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = foire_stands.organization_id
        AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization admins can manage stands"
  ON foire_stands FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = foire_stands.organization_id
        AND organization_members.user_id = auth.uid()
        AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Exhibitors can view their reservations"
  ON foire_stand_reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exhibitors
      WHERE exhibitors.id = foire_stand_reservations.exhibitor_id
        AND exhibitors.organization_id IN (
          SELECT organization_id FROM organization_members
          WHERE user_id = auth.uid()
        )
    )
  );
```

### Phase 2 : Routes & Pages (3-4h)

**Créer routes:**
```
app/[locale]/org/[slug]/foires/
  ├── page.tsx                    # Liste des foires
  ├── [foireId]/
  │   ├── page.tsx                # Détails foire
  │   ├── stands/
  │   │   ├── page.tsx            # Liste stands disponibles
  │   │   └── [standId]/
  │   │       └── page.tsx        # Détails stand + réservation
  │   ├── reservations/
  │   │   └── page.tsx            # Liste réservations
  │   └── layout.tsx              # Layout foire (tabs)
```

### Phase 3 : Composants (4-5h)

**Créer composants:**
```
components/foires/
  ├── FoireList.tsx               # Liste foires
  ├── FoireCard.tsx               # Carte foire
  ├── StandMap.tsx                # Carte des stands (visuel)
  ├── StandList.tsx               # Liste stands
  ├── StandCard.tsx               # Carte stand
  ├── StandReservationForm.tsx    # Formulaire réservation
  ├── ReservationsList.tsx        # Liste réservations
  └── FoireDashboard.tsx          # Dashboard foire
```

### Phase 4 : API Routes (2-3h)

**Créer routes API:**
```
app/api/foires/
  ├── route.ts                    # GET liste, POST créer
  ├── [foireId]/
  │   ├── route.ts                # GET/PATCH/DELETE foire
  │   ├── stands/
  │   │   ├── route.ts            # GET liste stands
  │   │   └── [standId]/
  │   │       └── route.ts        # GET/PATCH stand
  │   └── reservations/
  │       ├── route.ts            # GET liste, POST créer
  │       └── [reservationId]/
  │           └── route.ts        # GET/PATCH/DELETE réservation
```

### Phase 5 : Queries & Hooks (2-3h)

**Créer queries:**
```
lib/supabase/queries/
  └── foires.ts                   # Fonctions: getFoires, getFoireById, getStands, etc.
```

**Créer hooks:**
```
lib/hooks/
  ├── use-foires.ts               # Hook foires
  ├── use-stands.ts               # Hook stands
  └── use-stand-reservations.ts   # Hook réservations
```

### Phase 6 : Types (1h)

**Créer types:**
```
lib/types/
  └── foire.ts                    # Types: Foire, Stand, StandReservation
```

### Phase 7 : Store Zustand (1h)

**Créer store:**
```
lib/store/
  └── foire-store.ts              # Store pour état foire/stands
```

---

## 5. EXEMPLES DE CODE

### Exemple 1 : Créer une route tenant-specific

```typescript
// app/[locale]/org/[slug]/foires/page.tsx
import { getOrganizationContext } from '@/middleware/orgContext'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function FoiresPage({
  params
}: {
  params: { locale: string; slug: string }
}) {
  const orgContext = await getOrganizationContext(params.slug)
  
  if (!orgContext) {
    redirect(`/${params.locale}/orgs`)
  }

  const supabase = createSupabaseServerClient()
  
  const { data: foires } = await supabase
    .from('events')
    .select('*')
    .eq('organization_id', orgContext.organization.id)
    .eq('event_type', 'foire')
    .order('start_date', { ascending: false })

  return (
    <div>
      <h1>Foires de {orgContext.organization.name}</h1>
      {/* Liste des foires */}
    </div>
  )
}
```

### Exemple 2 : Ajouter une nouvelle table avec RLS

```typescript
// Migration SQL (voir Phase 1 ci-dessus)
// Les policies RLS sont déjà définies dans la migration

// Utilisation dans le code:
const supabase = createSupabaseServerClient()
const { data: stands } = await supabase
  .from('foire_stands')
  .select('*')
  .eq('foire_id', foireId)
  .eq('status', 'available')
// RLS garantit que l'utilisateur ne voit que les stands de son organisation
```

### Exemple 3 : Créer un composant suivant les patterns existants

```typescript
// components/foires/StandCard.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Ruler, DollarSign } from 'lucide-react'
import type { Stand } from '@/lib/types/foire'

interface StandCardProps {
  stand: Stand
  onReserve?: (standId: string) => void
}

export function StandCard({ stand, onReserve }: StandCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Stand {stand.number}</CardTitle>
          <Badge variant={stand.status === 'available' ? 'default' : 'secondary'}>
            {stand.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stand.pavillon && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {stand.pavillon}
            </div>
          )}
          {stand.area_sqm && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Ruler className="w-4 h-4" />
              {stand.area_sqm} m²
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="w-4 h-4" />
            {stand.price.toLocaleString()} {stand.currency}
          </div>
        </div>
        {stand.status === 'available' && onReserve && (
          <Button 
            className="w-full mt-4" 
            onClick={() => onReserve(stand.id)}
          >
            Réserver
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

### Exemple 4 : Ajouter une nouvelle API route

```typescript
// app/api/foires/[foireId]/stands/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getOrganizationContext } from '@/middleware/orgContext'

export async function GET(
  request: NextRequest,
  { params }: { params: { foireId: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Récupérer l'event pour obtenir organization_id
    const { data: event } = await supabase
      .from('events')
      .select('organization_id')
      .eq('id', params.foireId)
      .single()

    if (!event) {
      return NextResponse.json(
        { error: 'Foire non trouvée' },
        { status: 404 }
      )
    }

    // RLS garantit l'accès
    const { data: stands, error } = await supabase
      .from('foire_stands')
      .select('*')
      .eq('foire_id', params.foireId)
      .order('number', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: stands
    })
  } catch (error) {
    console.error('Error fetching stands:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stands' },
      { status: 500 }
    )
  }
}
```

### Exemple 5 : Utiliser les hooks d'auth existants

```typescript
// components/foires/FoireDashboard.tsx
'use client'

import { useAuth } from '@/lib/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'

export function FoireDashboard() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>
  }

  const handleCreateFoire = async () => {
    // Logique création foire
    toast({
      title: 'Foire créée',
      description: 'Votre foire a été créée avec succès'
    })
  }

  return (
    <div>
      <h1>Bienvenue {user?.full_name}</h1>
      <Button onClick={handleCreateFoire}>Créer une foire</Button>
    </div>
  )
}
```

---

## 6. CHECKLIST PRÉPARATION

### Base de Données
- [ ] Créer migration `20250130_foire_module.sql`
- [ ] Ajouter colonne `event_type` à `events`
- [ ] Créer table `foire_stands`
- [ ] Créer table `foire_stand_reservations`
- [ ] Créer indexes nécessaires
- [ ] Créer RLS policies
- [ ] Tester les policies RLS
- [ ] Générer types: `npm run db:generate`

### Routes & Pages
- [ ] Créer `app/[locale]/org/[slug]/foires/page.tsx`
- [ ] Créer `app/[locale]/org/[slug]/foires/[foireId]/page.tsx`
- [ ] Créer `app/[locale]/org/[slug]/foires/[foireId]/stands/page.tsx`
- [ ] Créer `app/[locale]/org/[slug]/foires/[foireId]/stands/[standId]/page.tsx`
- [ ] Créer `app/[locale]/org/[slug]/foires/[foireId]/reservations/page.tsx`
- [ ] Créer `app/[locale]/org/[slug]/foires/[foireId]/layout.tsx`

### Composants
- [ ] Créer `components/foires/FoireList.tsx`
- [ ] Créer `components/foires/FoireCard.tsx`
- [ ] Créer `components/foires/StandMap.tsx`
- [ ] Créer `components/foires/StandList.tsx`
- [ ] Créer `components/foires/StandCard.tsx`
- [ ] Créer `components/foires/StandReservationForm.tsx`
- [ ] Créer `components/foires/ReservationsList.tsx`
- [ ] Créer `components/foires/FoireDashboard.tsx`

### API Routes
- [ ] Créer `app/api/foires/route.ts`
- [ ] Créer `app/api/foires/[foireId]/route.ts`
- [ ] Créer `app/api/foires/[foireId]/stands/route.ts`
- [ ] Créer `app/api/foires/[foireId]/stands/[standId]/route.ts`
- [ ] Créer `app/api/foires/[foireId]/reservations/route.ts`
- [ ] Créer `app/api/foires/[foireId]/reservations/[reservationId]/route.ts`

### Queries & Hooks
- [ ] Créer `lib/supabase/queries/foires.ts`
- [ ] Créer `lib/hooks/use-foires.ts`
- [ ] Créer `lib/hooks/use-stands.ts`
- [ ] Créer `lib/hooks/use-stand-reservations.ts`

### Types & Store
- [ ] Créer `lib/types/foire.ts`
- [ ] Créer `lib/store/foire-store.ts`
- [ ] Mettre à jour `lib/types/database.types.ts` (auto-généré)

### Internationalisation
- [ ] Ajouter traductions dans `messages/fr.json`
- [ ] Ajouter traductions dans `messages/en.json`
- [ ] Ajouter traductions dans `messages/wo.json`
- [ ] Ajouter routes dans `i18n.config.ts`

### Tests
- [ ] Créer tests pour queries foires
- [ ] Créer tests pour API routes
- [ ] Créer tests E2E pour flux réservation

---

## 7. RÉPONSES AUX QUESTIONS

### 1. Quelle est la meilleure façon d'ajouter le tenant "foire-dakar-2025" sans casser l'existant ?

**Réponse:** Utiliser le système existant `organizations` + `events`:
- Créer une organisation avec slug `foire-dakar-2025` (ou utiliser une org existante)
- Créer un event avec `event_type = 'foire'` et `slug = 'foire-dakar-2025'`
- Route: `/fr/org/[org-slug]/foires/foire-dakar-2025`
- **Avantage:** Réutilise toute l'infrastructure existante (RLS, membres, permissions)
- **Pas de breaking changes:** Ajout de colonnes optionnelles uniquement

### 2. Les routes de la foire devraient-elles être dans `@app/foire` ou `@app/[tenant]/foire` ?

**Réponse:** `@app/[locale]/org/[slug]/foires/` (tenant-specific)
- **Raison:** Cohérence avec l'existant (`/org/[slug]/events/`)
- Isolation tenant garantie par RLS
- Permissions par organisation
- **Pattern:** `/org/[slug]/foires/[foireId]/stands/`

### 3. Puis-je réutiliser le système d'auth actuel tel quel ou dois-je l'adapter ?

**Réponse:** ✅ **Réutilisable tel quel**
- Le système auth existant fonctionne déjà avec les organisations
- `useAuth()` hook fonctionne pour tous les modules
- Middleware vérifie déjà l'appartenance à l'organisation
- **Aucune modification nécessaire**

### 4. Quel est le meilleur endroit pour créer les nouveaux composants Foire ?

**Réponse:** `components/foires/`
- **Raison:** Cohérence avec `components/events/`, `components/exhibitors/`
- Pattern feature-based respecté
- Facilite la maintenance et la découverte

### 5. Y a-t-il des conflits potentiels entre l'existant et les nouvelles fonctionnalités Foire ?

**Réponse:** ⚠️ **Conflits mineurs à gérer:**
1. **Nom de table:** `events` vs besoin de distinguer foires
   - **Solution:** Ajouter `event_type` column (non-breaking)
2. **Routes:** `/events/` vs `/foires/`
   - **Solution:** Routes séparées, même table sous-jacente
3. **Composants:** `components/events/` vs `components/foires/`
   - **Solution:** Composants séparés, réutilisation possible

**Pas de conflits majeurs:** L'architecture multitenant isole déjà tout par organisation.

### 6. Quelle est la charge de travail estimée pour l'intégration (heures) ?

**Réponse:** **15-20 heures** réparties ainsi:
- Phase 1 (DB): 2-3h
- Phase 2 (Routes): 3-4h
- Phase 3 (Composants): 4-5h
- Phase 4 (API): 2-3h
- Phase 5 (Queries/Hooks): 2-3h
- Phase 6 (Types): 1h
- Phase 7 (Store): 1h
- Tests & Debug: 2-3h

**Total:** ~18 heures pour une implémentation complète et testée.

---

## 8. RECOMMANDATIONS FINALES

### ✅ À FAIRE
1. **Réutiliser au maximum:** Le système multitenant existant est solide
2. **Suivre les patterns:** Utiliser les mêmes conventions que `events` et `exhibitors`
3. **Tester RLS:** Vérifier que les policies fonctionnent correctement
4. **Documenter:** Ajouter des commentaires dans le code

### ⚠️ À ÉVITER
1. **Ne pas créer de nouvelles tables tenant:** Utiliser `organizations` existante
2. **Ne pas dupliquer la logique:** Réutiliser `orgContext.ts`
3. **Ne pas bypasser RLS:** Toujours utiliser les clients Supabase configurés

### 💡 OPTIMISATIONS FUTURES
1. Ajouter un système de cartographie visuelle des stands
2. Intégrer un calendrier pour la réservation
3. Ajouter des notifications email/SMS pour les réservations
4. Créer un dashboard analytics pour les foires

---

**Document généré le:** 2025-01-30  
**Version:** 1.0  
**Auteur:** Analyse automatique de l'architecture Xarala Solutions

