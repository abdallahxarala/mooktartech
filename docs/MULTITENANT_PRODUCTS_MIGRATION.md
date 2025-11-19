# 🔄 Migration Produits Multitenant : Copie Imprimantes vers Xarala

**Date** : Février 2025  
**Contexte** : Après correction de l'isolation multitenant, Xarala Solutions n'affiche plus de produits car tous appartiennent à Mooktar Tech.

---

## 📋 Problème

- **Avant** : Page Xarala affichait des imprimantes (HiTi, Entrust, Datacard)
- **Après correction isolation** : Les produits ont disparu car ils appartiennent à Mooktar Tech
- **Cause** : Les 27 produits dans la base appartiennent à Mooktar Tech (`0e973c3f-f507-4071-bb72-a01b92430186`)
- **Solution** : Copier les produits "Imprimantes PVC" de Mooktar vers Xarala

---

## 🎯 Objectif

Copier les produits Imprimantes PVC de Mooktar Tech vers Xarala Solutions pour que chaque tenant ait ses propres données, tout en maintenant l'isolation multitenant.

---

## 📝 Scripts SQL Disponibles

### 1. Identifier les produits Imprimantes PVC

**Fichier** : `supabase/scripts/01_identify_printer_products.sql`

**Usage** : Exécuter dans Supabase SQL Editor pour voir tous les produits Imprimantes PVC de Mooktar Tech.

**Résultat attendu** : Liste de toutes les imprimantes (HiTi, Entrust, Datacard, etc.)

---

### 2. Copier les produits vers Xarala

**Fichier** : `supabase/scripts/02_copy_printer_products_to_xarala.sql`

**Usage** : Exécuter dans Supabase SQL Editor pour copier TOUTES les imprimantes vers Xarala.

**⚠️ IMPORTANT** : 
- Ne supprime PAS les produits de Mooktar
- Les COPIER seulement vers Xarala
- Script idempotent (peut être exécuté plusieurs fois sans erreur)

**Colonnes copiées** :
- `name`, `description`, `price`, `price_fcfa`
- `stock`, `category`, `brand`, `featured`
- `short_description`, `tags`, `image_url`
- `b2b_price_fcfa`, `weight_kg`
- `b2b_available`, `b2c_available`, `min_order_quantity`
- `sku`, `slug` (avec suffixe `-xarala`)

---

### 3. Vérifier la copie

**Fichier** : `supabase/scripts/03_verify_products_copy.sql`

**Usage** : Exécuter après la copie pour vérifier que les produits ont été correctement copiés.

**Vérifications** :
- Nombre de produits par organisation
- Détail des produits Imprimantes pour chaque organisation
- Produits featured pour Xarala
- Statistiques globales

**Résultat attendu** :
```
organization         | products_count | categories
Xarala Solutions     | 5-10           | Imprimantes PVC
Mooktar Tech         | 27             | Laptops, Smartphones, etc.
```

---

### 4. Créer des produits spécifiques (si nécessaire)

**Fichier** : `supabase/scripts/04_create_specific_xarala_products.sql`

**Usage** : Si certains produits manquent après la copie, créer des produits spécifiques pour Xarala.

**Produits créés** :
- HiTi CS-200e (1 250 000 FCFA)
- Entrust Sigma DSE (750 000 FCFA)
- Datacard CD800 (1 650 000 FCFA)

---

## 🚀 Instructions d'Exécution

### Étape 1 : Identifier les produits

1. Ouvrir Supabase Dashboard → SQL Editor
2. Ouvrir `supabase/scripts/01_identify_printer_products.sql`
3. Copier le contenu
4. Coller dans SQL Editor
5. Exécuter (Run)
6. Vérifier la liste des produits Imprimantes PVC

---

### Étape 2 : Copier les produits

1. Ouvrir `supabase/scripts/02_copy_printer_products_to_xarala.sql`
2. Copier le contenu
3. Coller dans SQL Editor
4. Exécuter (Run)
5. Vérifier le message de confirmation

---

### Étape 3 : Vérifier la copie

1. Ouvrir `supabase/scripts/03_verify_products_copy.sql`
2. Copier le contenu
3. Coller dans SQL Editor
4. Exécuter (Run)
5. Vérifier que Xarala a maintenant des produits

---

### Étape 4 : Tester la page Xarala

```bash
http://localhost:3000/fr/org/xarala-solutions
```

**Vérifications** :
- ✅ Section "Nos imprimantes les plus vendues" visible
- ✅ HiTi CS-200e affiché (1 250 000 FCFA)
- ✅ Entrust Sigma DSE affiché (750 000 FCFA)
- ✅ Datacard CD800 affiché (1 650 000 FCFA)
- ✅ Boutons "Ajouter au panier" fonctionnels
- ✅ Panier accessible

---

## ✅ Résultat Attendu

- ✅ Page Xarala affiche à nouveau les imprimantes
- ✅ Panier fonctionnel
- ✅ Dashboard admin accessible
- ✅ Isolation multitenant maintenue :
  - Mooktar voit ses 27 produits
  - Xarala voit ses imprimantes (copiées)
  - Foire Dakar voit ses événements

---

## 🔒 Règle Importante

**NE JAMAIS supprimer les produits de Mooktar**. Les COPIER vers Xarala pour que chaque tenant ait ses propres données.

---

## 📊 État Actuel des Organisations

| Organisation | ID | Produits | Événements | Exposants |
|--------------|----|----------|------------|-----------|
| Xarala Solutions | `08aca8c3-584d-4d83-98d0-90476ec40f3d` | 0 → **5-10** (après copie) | 6 | 1 |
| Foire Dakar 2025 | `6559a4ed-0ac4-4157-980e-756369fc683c` | 0 | 1 | 2 |
| Mooktar Tech | `0e973c3f-f507-4071-bb72-a01b92430186` | 27 | 0 | 0 |

---

## 🔍 Vérification Post-Migration

Après exécution des scripts, vérifier dans Supabase :

```sql
-- Vérifier les produits par organisation
SELECT 
  o.name,
  COUNT(p.id) as products_count,
  string_agg(DISTINCT p.brand, ', ') as brands
FROM organizations o
LEFT JOIN products p ON p.organization_id = o.id
WHERE o.slug IN ('xarala-solutions', 'mooktartech-com')
GROUP BY o.id, o.name;
```

---

## 📝 Notes

- Les scripts sont **idempotents** (peuvent être exécutés plusieurs fois)
- Les produits copiés ont un `slug` avec suffixe `-xarala` pour éviter les conflits
- Les dates `created_at` et `updated_at` sont mises à jour lors de la copie
- L'isolation multitenant est maintenue : chaque organisation voit uniquement ses propres produits

