# 🔧 Correction : Ajout de `organization_id` à la table `tickets`

**Date** : 2025-02-02  
**Problème** : Colonne `organization_id` manquante dans la table `tickets`  
**Erreur** : `Could not find the 'organization_id' column of 'tickets' in the schema cache`

---

## 📋 Résumé

La table `tickets` a été créée avec `organization_id` dans la migration initiale, mais la colonne n'existe pas dans Supabase. Cela peut arriver si :
- La migration n'a pas été exécutée
- La table a été créée manuellement sans cette colonne
- La migration a échoué partiellement

---

## ✅ Solution

### Migration SQL

**Fichier** : `supabase/migrations/20250202000006_add_organization_id_to_tickets.sql`

**Actions** :
1. ✅ Ajouter la colonne `organization_id` (nullable temporairement)
2. ✅ Remplir `organization_id` pour les tickets existants depuis `events.organization_id`
3. ✅ Rendre la colonne NOT NULL (si pas de valeurs NULL)
4. ✅ Ajouter la contrainte FK vers `organizations`
5. ✅ Créer l'index pour performance
6. ✅ Vérification

---

## 🔍 Code Application

### État Actuel

Le code utilise déjà `organization_id` correctement :

```typescript
// app/[locale]/org/[slug]/foires/[eventSlug]/tickets/page.tsx (ligne 191)
const { data: createdTicket, error: ticketError } = await supabase
  .from('tickets')
  .insert({
    event_id: event.id,
    organization_id: event.organization_id, // ✅ Déjà présent
    buyer_name: buyerName,
    // ... autres champs
  })
```

**Aucune modification nécessaire dans le code** ✅

---

## 🔧 Correction Audit SQL

**Fichier** : `supabase/scripts/audit_final_production.sql`

**Problème** : Référence de colonne incorrecte dans la section "Statut des exposants"

**Avant** :
```sql
SELECT 
  COALESCE(approval_status, status, 'non_defini') as approval_status,
  payment_status,
  COUNT(*) as count
FROM exhibitors e
-- ...
GROUP BY approval_status, status, payment_status
```

**Après** :
```sql
SELECT 
  COALESCE(e.approval_status, e.status, 'non_defini') as approval_status,
  e.payment_status,
  COUNT(*) as count
FROM exhibitors e
-- ...
GROUP BY e.approval_status, e.status, e.payment_status
```

**Statut** : ✅ Corrigé

---

## 📊 Migration SQL Complète

```sql
-- 1. Ajouter la colonne organization_id (nullable temporairement)
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS organization_id UUID;

-- 2. Remplir organization_id pour les tickets existants
UPDATE tickets t
SET organization_id = e.organization_id
FROM events e
WHERE t.event_id = e.id
  AND t.organization_id IS NULL;

-- 3. Rendre la colonne NOT NULL (si pas de valeurs NULL)
ALTER TABLE tickets 
ALTER COLUMN organization_id SET NOT NULL;

-- 4. Ajouter la contrainte de clé étrangère
ALTER TABLE tickets
ADD CONSTRAINT fk_tickets_organization
FOREIGN KEY (organization_id) REFERENCES organizations(id)
ON DELETE CASCADE;

-- 5. Créer l'index pour performance
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id 
ON tickets(organization_id);
```

---

## ✅ Checklist de Déploiement

### Étape 1 : Migration Supabase

- [ ] Exécuter `supabase/migrations/20250202000006_add_organization_id_to_tickets.sql` dans Supabase SQL Editor
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Vérifier que la colonne est créée
- [ ] Vérifier que les tickets existants ont `organization_id` rempli
- [ ] Vérifier que la contrainte FK est créée
- [ ] Vérifier que l'index est créé

### Étape 2 : Vérification

- [ ] Vérifier la structure de la table :
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tickets'
  AND column_name = 'organization_id';
```

- [ ] Vérifier les tickets existants :
```sql
SELECT 
  COUNT(*) as total,
  COUNT(organization_id) as with_org_id,
  COUNT(*) - COUNT(organization_id) as without_org_id
FROM tickets;
```

### Étape 3 : Tests

- [ ] Tester la création d'un ticket via l'interface
- [ ] Vérifier que `organization_id` est bien rempli
- [ ] Vérifier qu'il n'y a pas d'erreur

---

## 🎯 Résultat Attendu

Après la migration :

✅ **Colonne `organization_id` créée**  
✅ **Tous les tickets existants ont `organization_id` rempli**  
✅ **Colonne NOT NULL**  
✅ **Contrainte FK créée**  
✅ **Index créé**  
✅ **Création de tickets fonctionne**  
✅ **Isolation multitenant assurée**  

---

## 📝 Notes Techniques

### Pourquoi `organization_id` dans `tickets` ?

Même si `tickets` a déjà `event_id` qui référence `events` (qui a `organization_id`), avoir `organization_id` directement dans `tickets` permet :

1. ✅ **Performance** : Pas besoin de JOIN pour filtrer par organisation
2. ✅ **Sécurité** : RLS policies plus simples
3. ✅ **Cohérence** : Même pattern que les autres tables
4. ✅ **Isolation** : Filtrage direct sans JOIN

### Migration Sécurisée

La migration utilise `DO $$ BEGIN ... END $$` pour :
- ✅ Vérifier si la colonne existe avant de l'ajouter
- ✅ Vérifier si la contrainte existe avant de l'ajouter
- ✅ Gérer les cas où des tickets existent déjà
- ✅ Afficher des messages informatifs

---

**Dernière mise à jour** : 2025-02-02  
**Statut** : ✅ Migration créée - Prêt pour exécution

