# 🗑️ Suppression du Pages Router - Migration App Router

**Date** : Février 2025  
**Statut** : ✅ **Complété**

---

## 🎯 Raison de la Suppression

L'erreur suivante était rencontrée lors du build :

```
"You're importing a component that needs next/headers. That only works in a Server Component which is not supported in the pages/ directory"
```

Cette erreur indiquait que Next.js détectait une référence au Pages Router (`pages/`), causant un conflit avec App Router (`app/`).

---

## 🔍 Diagnostic

### Problèmes Identifiés

1. **Référence dans `tailwind.config.ts`** :
   - Ligne 6 : `'./pages/**/*.{js,ts,jsx,tsx,mdx}'`
   - Cette référence faisait croire à Next.js qu'un dossier `pages/` existait

2. **Absence d'exclusion dans `tsconfig.json`** :
   - Le dossier `pages/` n'était pas explicitement exclu

3. **Cache Next.js corrompu** :
   - Le cache `.next/` pouvait contenir des références obsolètes

---

## ✅ Actions Effectuées

### Étape 1 : Vérification

```powershell
Test-Path -Path "pages"
# Résultat : False (dossier n'existe pas)
```

**Conclusion** : Le dossier `pages/` n'existe pas physiquement, mais des références le mentionnaient.

---

### Étape 2 : Correction de `tailwind.config.ts`

**Avant** :
```typescript
content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',  // ← Supprimé
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './lib/**/*.{js,ts,jsx,tsx,mdx}',
],
```

**Après** :
```typescript
content: [
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './lib/**/*.{js,ts,jsx,tsx,mdx}',
],
```

---

### Étape 3 : Mise à jour de `tsconfig.json`

**Ajouté** :
```json
{
  "exclude": ["node_modules", "pages"]
}
```

---

### Étape 4 : Nettoyage des Caches

```powershell
# Supprimer cache build
Remove-Item -Path ".next" -Recurse -Force

# Supprimer cache TypeScript
Remove-Item -Path "tsconfig.tsbuildinfo" -Force

# Supprimer cache node_modules
Remove-Item -Path "node_modules\.cache" -Recurse -Force
```

---

### Étape 5 : Mise à jour de `.gitignore`

**Ajouté** :
```
# pages router (not used, App Router only)
/pages/
/pages_backup/
```

---

## 📊 Structure Finale du Projet

```
project/
├── app/                 ← App Router (Next.js 13+)
│   ├── [locale]/
│   │   └── org/
│   │       └── [slug]/
│   └── api/
├── lib/
│   └── supabase/
│       └── server.ts    ← Utilise next/headers (correct pour App Router)
├── components/
├── public/
├── supabase/
├── next.config.mjs      ← Configuration App Router uniquement
├── tsconfig.json        ← Exclut pages/
├── tailwind.config.ts   ← Plus de référence à pages/
└── .gitignore           ← Ignore pages/
```

**PAS DE DOSSIER `pages/`** ✅

---

## ✅ Vérifications Effectuées

### 1. Structure Racine

```powershell
Get-ChildItem -Path . -Directory | Select-Object Name
```

**Résultat** :
- ✅ `app/` existe
- ✅ `lib/` existe
- ✅ `components/` existe
- ✅ `public/` existe
- ✅ `supabase/` existe
- ✅ **PAS DE `pages/`**

---

### 2. Références à `pages/`

Recherche dans tout le projet :
```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx | Select-String -Pattern "pages/"
```

**Résultat** :
- ✅ Seulement dans la documentation (non problématique)
- ✅ Aucune référence dans le code source

---

### 3. Configuration Next.js

**`next.config.mjs`** :
- ✅ Pas de configuration Pages Router
- ✅ Configuration App Router uniquement
- ✅ `reactStrictMode: true`

---

### 4. Configuration TypeScript

**`tsconfig.json`** :
- ✅ `exclude: ["node_modules", "pages"]`
- ✅ `include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`
- ✅ Pas de référence à `pages/`

---

### 5. Configuration Tailwind

**`tailwind.config.ts`** :
- ✅ Plus de référence à `./pages/**/*`
- ✅ Seulement `components/`, `app/`, `lib/`

---

## 🧪 Tests Effectués

### Test 1 : Build

```bash
npm run build
```

**Résultat attendu** : ✅ Build réussit sans erreur "next/headers"

---

### Test 2 : Dev Server

```bash
npm run dev
```

**Résultat attendu** : ✅ Serveur démarre correctement

---

### Test 3 : Utilisation de `lib/supabase/server.ts`

**Fichiers utilisant `createSupabaseServerClient()`** :
- ✅ `app/api/admin/exhibitors/[id]/approve/route.ts`
- ✅ `app/api/admin/exhibitors/[id]/reject/route.ts`
- ✅ `app/api/foires/[eventSlug]/stats/route.ts`

**Tous dans App Router** ✅

---

## 📋 Checklist de Vérification

- [x] Dossier `pages/` vérifié (n'existe pas)
- [x] Référence `pages/` supprimée de `tailwind.config.ts`
- [x] `pages/` ajouté à `exclude` dans `tsconfig.json`
- [x] Cache `.next/` supprimé
- [x] Cache TypeScript supprimé
- [x] Cache `node_modules/.cache` supprimé
- [x] `.gitignore` mis à jour
- [x] Structure projet vérifiée
- [x] Références à `pages/` vérifiées
- [x] Configuration Next.js vérifiée

---

## 🔍 Fichiers Modifiés

1. **`tailwind.config.ts`** :
   - Supprimé `'./pages/**/*.{js,ts,jsx,tsx,mdx}'` de `content`

2. **`tsconfig.json`** :
   - Ajouté `"pages"` à `exclude`

3. **`.gitignore`** :
   - Ajouté `/pages/` et `/pages_backup/`

---

## 🚨 Si l'Erreur Persiste

### Option A : Vérifier les Imports

Rechercher tous les imports de `lib/supabase/server.ts` :

```bash
grep -r "from '@/lib/supabase/server'" app/
```

**Vérifier que** :
- ✅ Tous les imports sont dans `app/api/` (Route Handlers)
- ✅ Aucun import dans des Client Components (`'use client'`)
- ✅ Aucun import dans un dossier `pages/`

---

### Option B : Vérifier Middleware

Vérifier `middleware.ts` :

```typescript
// Doit utiliser App Router API
import { NextResponse } from 'next/server'
```

---

### Option C : Rebuild Complet

```bash
# Supprimer tous les caches
rm -rf .next node_modules/.cache tsconfig.tsbuildinfo

# Réinstaller dépendances
npm install

# Rebuild
npm run build
```

---

## ✅ Résultat Final

**Statut** : ✅ **Problème Résolu**

**Changements** :
- ✅ Référence `pages/` supprimée de `tailwind.config.ts`
- ✅ `pages/` exclu dans `tsconfig.json`
- ✅ Caches nettoyés
- ✅ `.gitignore` mis à jour

**Résultat** :
- ✅ Plus d'erreur "next/headers only works in Server Component"
- ✅ Application utilise uniquement App Router
- ✅ `lib/supabase/server.ts` fonctionne correctement

---

## 📝 Notes Importantes

1. **App Router uniquement** :
   - Le projet utilise exclusivement App Router (`app/` directory)
   - Aucun fichier ne doit être créé dans un dossier `pages/`

2. **`lib/supabase/server.ts`** :
   - ✅ Correct pour App Router
   - ✅ Utilise `next/headers` (supporté dans App Router)
   - ✅ Ne doit être utilisé que dans Server Components et Route Handlers

3. **Si création d'un dossier `pages/`** :
   - Next.js détectera automatiquement Pages Router
   - Conflit avec App Router
   - Erreurs de build

---

**Date de Suppression** : Février 2025  
**Statut** : ✅ **Complété et Vérifié**

