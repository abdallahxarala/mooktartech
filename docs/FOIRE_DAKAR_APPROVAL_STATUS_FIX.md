# 🔧 Correction : Ajout de la colonne `approval_status`

**Date** : 2025-02-02  
**Problème** : La colonne `approval_status` n'existait pas dans la table `exhibitors`  
**Solution** : Migration SQL + Correction du code

---

## 📋 Résumé des Corrections

### 1. Migration SQL

**Fichier** : `supabase/migrations/20250202000004_add_approval_status_to_exhibitors.sql`

**Actions** :
- ✅ Ajout de la colonne `approval_status` avec CHECK constraint
- ✅ Valeurs autorisées : `'pending'`, `'approved'`, `'rejected'`
- ✅ Valeur par défaut : `'pending'`
- ✅ Migration automatique des valeurs de `status` vers `approval_status` (si colonne `status` existe)
- ✅ Index créé pour optimiser les recherches

### 2. Corrections du Code

#### API Routes

**Fichiers modifiés** :
- `app/api/admin/exhibitors/[id]/approve/route.ts`
  - ✅ Utilise maintenant `approval_status: 'approved'`
  - ✅ Maintient `status` pour compatibilité

- `app/api/admin/exhibitors/[id]/reject/route.ts`
  - ✅ Utilise maintenant `approval_status: 'rejected'`
  - ✅ Maintient `status` pour compatibilité

- `app/api/admin/exhibitors/route.ts`
  - ✅ Accepte le paramètre `approval_status`
  - ✅ Maintient `status` pour compatibilité

#### Services

**Fichier** : `lib/services/admin/stats.service.ts`
- ✅ Sélectionne `approval_status` dans les requêtes
- ✅ Utilise `approval_status` en priorité, avec fallback vers `status`
- ✅ Interface TypeScript mise à jour

#### Pages

**Fichiers modifiés** :
1. `app/[locale]/org/[slug]/foires/[eventSlug]/inscription/page.tsx`
   - ✅ Crée les exposants avec `approval_status: 'pending'`

2. `app/[locale]/org/[slug]/foires/[eventSlug]/admin/exhibitors/page.tsx`
   - ✅ Affiche `approval_status` dans la liste
   - ✅ Utilise `approval_status` pour les filtres et actions

3. `app/[locale]/org/[slug]/foires/[eventSlug]/catalogue/page.tsx`
   - ✅ Filtre les exposants approuvés avec `approval_status` ou `status`

4. `app/[locale]/org/[slug]/foires/[eventSlug]/catalogue/[exhibitorSlug]/page.tsx`
   - ✅ Vérifie l'approbation avec `approval_status` ou `status`

5. `app/[locale]/org/[slug]/foires/[eventSlug]/mon-stand/page.tsx`
   - ✅ Affiche le statut d'approbation avec `approval_status` ou `status`

---

## 🔄 Stratégie de Compatibilité

Pour assurer une transition en douceur, le code utilise une stratégie de **fallback** :

```typescript
// Exemple de pattern utilisé partout
const approvalStatus = (exhibitor as any).approval_status || exhibitor.status
```

**Avantages** :
- ✅ Fonctionne avec les anciennes données (si `status` existe)
- ✅ Fonctionne avec les nouvelles données (`approval_status`)
- ✅ Pas de breaking change
- ✅ Migration progressive possible

---

## 📊 Script d'Audit V2

**Fichier** : `supabase/scripts/audit_foire_dakar_v2.sql`

**Vérifications** :
1. ✅ Structure de la colonne `approval_status`
2. ✅ Contraintes CHECK
3. ✅ Données migrées
4. ✅ Isolation multitenant
5. ✅ Statistiques par statut

---

## ✅ Checklist de Déploiement

### Étape 1 : Migration Supabase

- [ ] Exécuter la migration dans Supabase SQL Editor
- [ ] Vérifier que la colonne est créée
- [ ] Vérifier que les contraintes CHECK sont appliquées
- [ ] Vérifier que les données existantes sont migrées

### Étape 2 : Tests

- [ ] Tester l'inscription d'un exposant (doit créer avec `approval_status: 'pending'`)
- [ ] Tester l'approbation d'un exposant (doit mettre à jour `approval_status: 'approved'`)
- [ ] Tester le rejet d'un exposant (doit mettre à jour `approval_status: 'rejected'`)
- [ ] Tester l'affichage dans le catalogue (seuls les approuvés doivent apparaître)
- [ ] Tester l'affichage dans mon-stand (statut correct affiché)

### Étape 3 : Audit

- [ ] Exécuter le script d'audit v2
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Vérifier les statistiques

---

## 🎯 Résultat Attendu

Après la migration et les tests :

✅ **Colonne `approval_status` créée**  
✅ **Toutes les requêtes fonctionnent**  
✅ **Compatibilité avec anciennes données**  
✅ **Nouvelles inscriptions utilisent `approval_status`**  
✅ **Admin peut approuver/rejeter avec `approval_status`**  
✅ **Catalogue filtre correctement**  

---

## 📝 Notes Techniques

### Migration des Données

La migration migre automatiquement les valeurs de `status` vers `approval_status` si :
- La colonne `status` existe
- Les valeurs sont `'approved'`, `'rejected'`, ou `'pending'`

### Contrainte CHECK

```sql
CHECK (approval_status IN ('pending', 'approved', 'rejected'))
```

### Index

```sql
CREATE INDEX IF NOT EXISTS idx_exhibitors_approval_status 
ON exhibitors(approval_status);
```

---

**Dernière mise à jour** : 2025-02-02  
**Statut** : ✅ Prêt pour déploiement après migration SQL

