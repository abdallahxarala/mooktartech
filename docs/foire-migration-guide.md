# Guide d'exécution des migrations - Foire Dakar 2025

Ce guide vous explique comment exécuter les migrations SQL pour configurer la plateforme Foire Internationale de Dakar 2025.

## 📋 Prérequis

- Accès au projet Supabase : https://app.supabase.com/project/gocsjmtsfoadcozhhsxn
- Fichier SQL : `supabase/migrations/00_complete_foire_setup.sql`

---

## 🚀 Étape 1 : Copier le contenu SQL

### **Option A** : Via le terminal

```bash
cat supabase/migrations/00_complete_foire_setup.sql
```

Puis copiez tout le contenu (Ctrl+A, Ctrl+C)

### **Option B** : Via votre éditeur

Ouvrez `supabase/migrations/00_complete_foire_setup.sql` et copiez tout (Ctrl+A, Ctrl+C)

---

## 🎯 Étape 2 : Exécuter dans Supabase

1. **Ouvrez l'éditeur SQL** :
   👉 https://app.supabase.com/project/gocsjmtsfoadcozhhsxn/sql/new

2. **Collez** le SQL (Ctrl+V)

3. **Exécutez** :
   - Cliquez "Run" (bouton en bas à droite)
   - OU appuyez sur **Ctrl+Enter**

4. **Attendez** les messages de confirmation (quelques secondes)

---

## ✅ Étape 3 : Vérifier les Messages

Vous devriez voir dans les logs :

```
NOTICE: ✅ Migration 1 réussie: Colonnes event_type et foire_config ajoutées
NOTICE: ✅ Migration 2 réussie: Organisation "Foire Dakar 2025" créée
NOTICE: ✅ Migration 2 réussie: Événement "Foire Internationale de Dakar 2025" créé avec 3 pavillons

NOTICE: ═══════════════════════════════════════════════════════════════
NOTICE: 🎉 CONFIGURATION TERMINÉE AVEC SUCCÈS !
NOTICE: ═══════════════════════════════════════════════════════════════
NOTICE: 
NOTICE: 📋 Organisation
NOTICE:    ID   : [votre-uuid]
NOTICE:    Nom  : Foire Internationale de Dakar 2025
NOTICE: 
NOTICE: 🎪 Événement Foire
NOTICE:    ID         : [votre-uuid]
NOTICE:    Nom        : Foire Internationale de Dakar 2025
NOTICE:    Dates      : 2025-12-01 → 2025-12-15
NOTICE:    Lieu       : CICES Dakar
NOTICE: 
NOTICE: ✅ Prochaines étapes:
NOTICE:    1. Exécutez: npm install openai
NOTICE:    2. Exécutez: npm run db:generate
NOTICE:    3. Exécutez: npm run seed:foire
NOTICE:    4. Créez la landing page
NOTICE: 
NOTICE: ═══════════════════════════════════════════════════════════════
```

---

## 🔍 Vérification manuelle (optionnel)

Si vous voulez vérifier manuellement dans Supabase :

1. **Table Editor** → `organizations`
   - Recherchez `slug = 'foire-dakar-2025'`
   - Vous devriez voir l'organisation créée

2. **Table Editor** → `events`
   - Recherchez `slug = 'foire-dakar-2025'` ET `event_type = 'foire'`
   - Vous devriez voir l'événement avec la configuration complète

3. **SQL Editor** → Exécutez cette requête :

```sql
SELECT 
  o.name as organisation,
  e.name as evenement,
  e.event_type,
  e.foire_config->>'lieu' as lieu,
  e.start_date,
  e.end_date,
  jsonb_array_length(e.foire_config->'pavillons') as nb_pavillons
FROM organizations o
JOIN events e ON e.organization_id = o.id
WHERE o.slug = 'foire-dakar-2025';
```

---

## ⚠️ En cas d'erreur

### Erreur : "column already exists"
- **Cause** : Les colonnes `event_type` ou `foire_config` existent déjà
- **Solution** : C'est normal, la migration utilise `IF NOT EXISTS` donc elle est idempotente

### Erreur : "duplicate key value"
- **Cause** : L'organisation ou l'événement existe déjà
- **Solution** : C'est normal, la migration utilise `ON CONFLICT DO UPDATE` donc elle met à jour les données existantes

### Erreur : "permission denied"
- **Cause** : Vous n'avez pas les droits d'administration
- **Solution** : Vérifiez que vous êtes connecté avec un compte administrateur du projet Supabase

---

## 📝 Prochaines étapes après la migration

Une fois les migrations exécutées avec succès :

1. **Installer les dépendances** :
   ```bash
   npm install openai
   ```

2. **Générer les types TypeScript** :
   ```bash
   npm run db:generate
   ```

3. **Exécuter le script de seed** (si nécessaire) :
   ```bash
   npm run seed:foire
   ```

4. **Créer la landing page** pour la foire

---

## 📚 Ressources

- [Documentation Supabase SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Guide de setup complet](./foire-setup-checklist.md)

