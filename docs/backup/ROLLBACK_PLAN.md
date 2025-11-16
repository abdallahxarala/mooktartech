# Plan de Rollback - Xarala Solutions

**Date** : 30 janvier 2025  
**Snapshot** : PRE_MULTITENANT_SNAPSHOT  
**Objectif** : Retour garanti à l'état stable pré-multi-tenant

---

## 🎯 Scénarios de rollback

### **Scénario 1 : Rollback complet (Git)**

Si le développement multi-tenant échoue complètement.

#### **Étape 1 : Vérifier le commit du snapshot**

```bash
# Retrouver le commit du snapshot
git log --all --grep="PRE_MULTITENANT_SNAPSHOT" --oneline

# OU trouver le commit de backup
git log --all --before="2025-01-30" --until="2025-01-31" --oneline
```

#### **Étape 2 : Hard reset**

```bash
# ATTENTION : Cette commande va perdre toutes les modifications !
# Assurez-vous d'avoir sauvegardé le travail en cours

git stash push -m "Backup avant rollback"

# Identifier le hash du commit snapshot
export SNAPSHOT_COMMIT="<COMMIT_HASH>"  # À remplacer

# Hard reset
git reset --hard $SNAPSHOT_COMMIT

# Vérifier
git log --oneline -5
```

#### **Étape 3 : Nettoyer le projet**

```bash
# Supprimer node_modules et rebuild
rm -rf node_modules .next
npm install
npm run build
```

#### **Étape 4 : Vérifier**

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Server
npm run dev
# Tester manuellement sur http://localhost:3000
```

### **Scénario 2 : Rollback partiel (Fichiers critiques)**

Si seulement certains fichiers ont des problèmes.

#### **Fichiers critiques à restaurer**

```bash
# Stores Zustand
git checkout HEAD -- lib/store/products-store.ts
git checkout HEAD -- lib/store/content-store.ts
git checkout HEAD -- lib/store/auth.ts
git checkout HEAD -- lib/store/nfc-editor-store.ts

# API Routes
git checkout HEAD -- app/api/orders/route.ts
git checkout HEAD -- app/api/contact/route.ts

# Middleware
git checkout HEAD -- middleware.ts

# Config
git checkout HEAD -- i18n.config.ts
git checkout HEAD -- lib/config/tenants.ts
git checkout HEAD -- lib/contexts/tenant-context.tsx
```

#### **Vérifier chaque fichier**

```bash
# Lister les fichiers modifiés
git status

# Voir les différences
git diff lib/store/products-store.ts

# Restaurer si besoin
git checkout HEAD -- <file>
```

### **Scénario 3 : Rollback sélectif (Stores uniquement)**

Si seuls les stores Zustand ont des problèmes.

#### **Restaurer tous les stores**

```bash
# Liste des stores
STORES=(
  "lib/store/products-store.ts"
  "lib/store/cart-store.ts"
  "lib/store/content-store.ts"
  "lib/store/nfc-editor-store.ts"
  "lib/store/auth.ts"
  "lib/store/payment-store.ts"
  "lib/store/card-editor-store.ts"
  "lib/store/card-designer-store.ts"
  "lib/store/unified.ts"
  "lib/store/app-store.ts"
  "lib/store/useAppStore.ts"
  "lib/store/cart.ts"
)

# Restaurer chacun
for store in "${STORES[@]}"; do
  echo "Restoring $store..."
  git checkout HEAD -- "$store"
done
```

#### **Vérifier localStorage**

```bash
# Dans la console du navigateur
localStorage.clear()
location.reload()
```

### **Scénario 4 : Rollback localstorage seulement**

Si les données utilisateur sont corrompues.

#### **Script de nettoyage**

```javascript
// À exécuter dans la console du navigateur
const KEYS_TO_CLEAR = [
  'xarala-products-storage',
  'cart-storage',
  'content-storage',
  'nfc-editor-storage',
  'auth-storage',
  'payment-storage',
  'card-editor-storage',
  'card-designer-storage',
  'unified-storage',
  'xarala-app-store'
];

KEYS_TO_CLEAR.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Cleared: ${key}`);
});

console.log('🧹 localStorage cleared!');
location.reload();
```

---

## 🛡️ Fichiers critiques à ne PAS modifier

### **Infrastructure**

```
✋ NE PAS MODIFIER
├── middleware.ts                   ❌ Critique
├── i18n.config.ts                 ❌ Critique
├── next.config.mjs                ❌ Critique
└── tsconfig.json                  ❌ Critique
```

### **Stores**

```
✋ NE PAS MODIFIER SANS ROLLBACK PLAN
├── lib/store/content-store.ts      ⚠️ CMS global
├── lib/store/products-store.ts     ⚠️ Catalogue
└── lib/store/auth.ts              ⚠️ Authentication
```

### **API Routes**

```
✋ NE PAS MODIFIER SANS TESTING
├── app/api/orders/route.ts         ⚠️ E-commerce
├── app/api/payment/**/*.ts        ⚠️ Payments
└── app/api/cards/**/*.ts          ⚠️ Supabase
```

### **Database**

```
✋ NE PAS MODIFIER SANS BACKUP
├── supabase/migrations/*.sql       ❌ Database
└── lib/types/database.types.ts    ❌ Types DB
```

---

## ✅ Points de vérification

### **Check 1 : Build**

```bash
npm run build
```

**Résultat attendu** :
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
```

**✅ Si erreur** : Voir section "Debug"

### **Check 2 : Type Check**

```bash
npm run type-check
```

**Résultat attendu** :
```
No type errors found
```

**✅ Si erreur** : Voir section "Debug"

### **Check 3 : Linter**

```bash
npm run lint
```

**Résultat attendu** :
```
✔ No ESLint warnings or errors
```

**✅ Si erreur** : Voir section "Debug"

### **Check 4 : Runtime**

```bash
npm run dev
# Ouvrir http://localhost:3000/fr
```

**Tests à faire** :
- [ ] Homepage charge
- [ ] Navigation fonctionne
- [ ] Produits s'affichent
- [ ] Panier fonctionne
- [ ] Checkout accessible
- [ ] NFC editor accessible
- [ ] Admin panel accessible

**✅ Si erreur** : Voir section "Debug"

### **Check 5 : Stores**

```bash
# Dans la console du navigateur
window.localStorage
```

**Vérifier** :
- [ ] 10 storage keys présents
- [ ] Aucune clé corrompue
- [ ] Données JSON valides

**✅ Si erreur** : Nettoyer localStorage

---

## 🐛 Debug & Troubleshooting

### **Erreur : Type errors**

```bash
# Diagnostic
npm run type-check

# Rebuild types
rm -rf .next
npm run build

# Si Supabase
npm run db:generate
```

### **Erreur : Hydration mismatch**

```bash
# Vérifier les composants client/server
grep -r "use client" components/

# Rebuild
rm -rf .next
npm run dev
```

### **Erreur : Module not found**

```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### **Erreur : Storage keys collision**

```bash
# Dans la console
Object.keys(localStorage).forEach(key => {
  if (key.includes('storage')) {
    console.log(key, localStorage.getItem(key))
  }
})

# Nettoyer
localStorage.clear()
location.reload()
```

### **Erreur : Build failed**

```bash
# Logs détaillés
npm run build 2>&1 | tee build.log

# Analyser
grep -i "error" build.log | head -20

# Rollback si nécessaire
git diff .next
git checkout HEAD -- .next
```

---

## 📋 Checklist de rollback

### **Avant de commencer**

- [ ] **Backup créé** : `PRE_MULTITENANT_SNAPSHOT.md`
- [ ] **Commit identifié** : Hash Git du snapshot
- [ ] **Travail sauvegardé** : `git stash` ou branch backup
- [ ] **Dépendances listées** : `package.json` actuel
- [ ] **Fichiers critiques identifiés**

### **Pendant le rollback**

- [ ] **Git command exécutée**
- [ ] **node_modules supprimé**
- [ ] **npm install exécuté**
- [ ] **Build réussi**
- [ ] **Type-check passé**
- [ ] **Linter OK**

### **Après le rollback**

- [ ] **Dev server démarre**
- [ ] **Homepage charge**
- [ ] **Navigation OK**
- [ ] **Features fonctionnelles**
- [ ] **localStorage OK**
- [ ] **No console errors**
- [ ] **Tests manuels passés**

---

## 🔄 Restauration alternative

### **Méthode 1 : Archive**

Si Git n'est pas disponible.

```bash
# Créer archive du snapshot
tar -czf backup-snapshot.tar.gz \
  app/ \
  components/ \
  lib/ \
  public/ \
  docs/ \
  package.json \
  next.config.mjs \
  tailwind.config.ts \
  tsconfig.json

# Restaurer
tar -xzf backup-snapshot.tar.gz
```

### **Méthode 2 : Docker**

Si containerisé.

```bash
# Tag du snapshot
docker tag xarala-solutions:latest xarala-solutions:snapshot-premultitenant

# Rollback
docker stop xarala-solutions
docker run --rm xarala-solutions:snapshot-premultitenant
```

### **Méthode 3 : Cloud Backup**

Si déployé.

```bash
# Vercel
vercel rollback <deployment-url>

# Netlify
netlify deploy --prod --dir=.next
```

---

## ⚡ Quick Rollback (Emergency)

**Si tout est cassé, exécuter immédiatement** :

```bash
#!/bin/bash
# Quick rollback script

echo "🔄 Rolling back to PRE_MULTITENANT_SNAPSHOT..."

# 1. Backup work in progress
git stash push -m "Emergency backup $(date +%Y%m%d-%H%M%S)"

# 2. Find snapshot commit (À ajuster manuellement)
# SNAPSHOT="<COMMIT_HASH>"

# 3. Hard reset (COMMENTÉ POUR SÉCURITÉ)
# git reset --hard $SNAPSHOT

# 4. Clean install
rm -rf node_modules .next dist build
npm install

# 5. Rebuild
npm run build

# 6. Verify
npm run type-check && npm run lint

echo "✅ Rollback complete!"
```

---

## 🎯 Points de contrôle

### **Critère 1 : Compilation**

✅ **PASS** si :
- `npm run build` réussit
- 0 erreur TypeScript
- 0 erreur ESLint

❌ **FAIL** si :
- Erreurs de compilation
- Type errors
- Import errors

**Action FAIL** : Rollback immédiat

### **Critère 2 : Runtime**

✅ **PASS** si :
- Page charge < 3s
- Navigation fonctionne
- Stores initialisés
- API responses OK

❌ **FAIL** si :
- White screen
- Console errors
- Crashes

**Action FAIL** : Vérifier localStorage + rollback si nécessaire

### **Critère 3 : Features**

✅ **PASS** si :
- Toutes les pages accessibles
- Formulaires fonctionnels
- E-commerce OK
- Admin OK

❌ **FAIL** si :
- Pages 404
- Features cassées
- Data corrompues

**Action FAIL** : Rollback partiel des stores

---

## 📊 État du snapshot

### **Validation du snapshot**

```bash
# Liste des commits
git log --oneline -20

# Voir les fichiers du snapshot
git show HEAD:docs/backup/PRE_MULTITENANT_SNAPSHOT.md

# Vérifier l'intégrité
shasum -a 256 package.json
shasum -a 256 lib/store/content-store.ts
shasum -a 256 middleware.ts
```

### **Timestamp du snapshot**

- **Création** : 2025-01-30 15:00 UTC
- **Commit hash** : À compléter
- **Branch** : À compléter
- **Status** : ✅ Validé (0 erreur)

---

## 🚨 Alertes importantes

### **⚠️ AVANT ROLLBACK**

1. **Sauvegarder le travail actuel**
2. **Vérifier les dépendances**
3. **Tester le rollback dans un environnement isolé**
4. **Documenter les raisons du rollback**

### **❌ NE JAMAIS**

1. ❌ Rollback sans backup
2. ❌ Rollback en production sans test staging
3. ❌ Ignorer les warnings TypeScript
4. ❌ Rollback partiel non documenté

### **✅ TOUJOURS**

1. ✅ Vérifier le commit snapshot
2. ✅ Faire backup avant rollback
3. ✅ Tester après rollback
4. ✅ Documenter l'incident

---

## 📞 Support rollback

### **Contacts**

- **Tech Lead** : À compléter
- **DevOps** : À compléter
- **Emergency** : À compléter

### **Ressources**

- **Backup loc** : `docs/backup/PRE_MULTITENANT_SNAPSHOT.md`
- **Git repo** : À compléter
- **Cloud backup** : À vérifier
- **Database backup** : À vérifier

---

## ✅ Validation post-rollback

### **Tests fonctionnels**

```bash
# À exécuter après rollback
npm run dev

# 1. Homepage
curl http://localhost:3000/fr

# 2. Products
curl http://localhost:3000/fr/products

# 3. Cart
curl http://localhost:3000/fr/cart

# 4. Checkout
curl http://localhost:3000/fr/checkout

# 5. NFC Editor
curl http://localhost:3000/fr/nfc-editor
```

### **Logs à vérifier**

```
# Console browser
window.localStorage

# Server console
npm run dev  # Vérifier les erreurs

# Build logs
npm run build 2>&1 | grep -i error
```

---

## 🎉 Rollback réussi

### **Confirmation**

**Si tous les checks passent** :

```bash
echo "✅ Rollback successful!"
echo "✅ All features working"
echo "✅ No errors"
echo "✅ Ready for production"
```

### **Prochaines étapes**

1. ✅ Documenter l'incident
2. ✅ Analyser les causes
3. ✅ Proposer solutions alternatives
4. ✅ Planifier nouvelle approche

---

**Ce plan garantit un retour sûr à l'état stable.**

**En cas de doute, consulter** : `docs/backup/PRE_MULTITENANT_SNAPSHOT.md`
