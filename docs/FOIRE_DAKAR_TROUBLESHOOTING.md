# 🔧 Guide de Dépannage - Foire Dakar 2025

**Date** : 2025-02-02  
**Objectif** : Résoudre les problèmes courants du parcours billetterie

---

## ❌ Problème 1 : Page Confirmation Renvoie 404

### Symptômes
- URL : `/tickets/[ticketId]/confirmation`
- Erreur : Page non trouvée (404)
- Ticket créé mais non payé

### Cause
Le ticket n'est pas encore payé (`payment_status='unpaid'`). La page de confirmation vérifie que le ticket est payé avant de s'afficher.

### Solution A : Payer le Ticket (RECOMMANDÉ)

1. **Accéder à la page de paiement** :
   ```
   http://localhost:3001/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/[TICKET_ID]/payment
   ```

2. **Actions** :
   - Sélectionner une méthode de paiement (ex: Wave)
   - Entrer le numéro de téléphone (si mobile money)
   - Cliquer sur "Payer"

3. **Résultat** :
   - Ticket mis à jour avec `payment_status='paid'`
   - Redirection automatique vers `/confirmation`
   - QR code généré automatiquement ✅

### Solution B : Vérifier l'État du Ticket

```sql
SELECT 
  id,
  payment_status,
  payment_method,
  qr_code,
  created_at
FROM tickets
WHERE id = '[TICKET_ID]';
```

**Si `payment_status='unpaid'`** :
- ✅ Normal : Le ticket doit être payé avant d'accéder à la confirmation
- ✅ Solution : Passer par la page de paiement

**Si `payment_status='paid'` mais 404** :
- ⚠️ Vérifier que le ticket appartient à la bonne organisation
- ⚠️ Vérifier les logs du serveur pour les erreurs

---

## ❌ Problème 2 : QR Code Ne S'Affiche Pas

### Symptômes
- Page confirmation s'affiche
- Message "QR code non disponible"
- Ticket payé mais QR code manquant

### Cause
Le QR code n'a pas été généré automatiquement lors du paiement.

### Solution

1. **Vérifier dans Supabase** :
   ```sql
   SELECT qr_code, qr_code_data
   FROM tickets
   WHERE id = '[TICKET_ID]';
   ```

2. **Si `qr_code` est NULL** :
   - Le QR code sera généré automatiquement à l'accès de la page confirmation
   - Rafraîchir la page
   - Vérifier les logs du serveur

3. **Si le QR code existe mais ne s'affiche pas** :
   - Vérifier la console du navigateur pour les erreurs
   - Vérifier que le package `qrcode` est installé ✅ (v1.5.4)
   - Vérifier que `ticket.qr_code` n'est pas vide

### Génération Manuelle (Si Nécessaire)

```sql
UPDATE tickets
SET 
  qr_code = CONCAT('FOIRE2025-', id, '-foire-dakar-2025'),
  qr_code_data = jsonb_build_object(
    'ticket_id', id,
    'event_slug', 'foire-dakar-2025',
    'ticket_type', ticket_type,
    'buyer_email', buyer_email,
    'quantity', quantity
  )
WHERE id = '[TICKET_ID]'
  AND payment_status = 'paid'
  AND qr_code IS NULL;
```

---

## ❌ Problème 3 : Bouton "Payer" Désactivé

### Symptômes
- Bouton "Payer" grisé
- Impossible de cliquer
- Message d'erreur si clic

### Cause
Numéro de téléphone manquant pour mobile money (Wave, Orange Money, Free Money).

### Solution

**Option 1 : Entrer un numéro de téléphone**
- Entrer un numéro valide (ex: `+221 77 123 45 67`)
- Le bouton s'active automatiquement ✅

**Option 2 : Sélectionner "Espèces"**
- Cliquer sur "Espèces" (cash)
- Le bouton s'active sans téléphone ✅

---

## ❌ Problème 4 : Redirection Ne Fonctionne Pas

### Symptômes
- Après paiement, pas de redirection
- Reste sur la page de paiement
- Erreur dans la console

### Causes Possibles

1. **Erreur lors de la mise à jour du ticket** :
   - Vérifier les logs du serveur
   - Vérifier que le ticket existe
   - Vérifier les permissions RLS

2. **Erreur de routage** :
   - Vérifier que l'ID du ticket est correct
   - Vérifier que les routes existent
   - Vérifier que `router.push()` fonctionne

### Solution

1. **Vérifier les logs du navigateur** :
   - Ouvrir la console (F12)
   - Vérifier les erreurs JavaScript

2. **Vérifier les logs du serveur** :
   - Vérifier les erreurs Supabase
   - Vérifier les erreurs de routage

3. **Redirection manuelle** :
   - Si le paiement a réussi, accéder manuellement à :
   ```
   /fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/[TICKET_ID]/confirmation
   ```

---

## ❌ Problème 5 : Ticket Non Créé

### Symptômes
- Formulaire soumis mais pas de ticket
- Erreur dans la console
- Redirection vers `/payment` échoue

### Causes Possibles

1. **Erreur Supabase** :
   - `organization_id` manquant
   - Contraintes non respectées
   - Permissions RLS

2. **Erreur de validation** :
   - Champs requis manquants
   - Format email invalide
   - Quantité = 0

### Solution

1. **Vérifier les logs** :
   ```javascript
   // Dans la console du navigateur
   console.error('Erreur création ticket:', error)
   ```

2. **Vérifier les données** :
   ```sql
   -- Vérifier que l'événement existe
   SELECT id, name, slug, organization_id
   FROM events
   WHERE slug = 'foire-dakar-2025'
     AND organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c';
   ```

3. **Vérifier les contraintes** :
   ```sql
   -- Vérifier la structure de la table
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'tickets'
   ORDER BY ordinal_position;
   ```

---

## ❌ Problème 6 : Isolation Multitenant

### Symptômes
- Tickets d'autres organisations visibles
- Erreur "Ticket organization mismatch"
- 404 même si le ticket existe

### Cause
Le ticket n'appartient pas à la bonne organisation.

### Solution

1. **Vérifier l'organization_id** :
   ```sql
   SELECT 
     t.id,
     t.organization_id as ticket_org_id,
     e.organization_id as event_org_id,
     o.slug as org_slug
   FROM tickets t
   INNER JOIN events e ON t.event_id = e.id
   INNER JOIN organizations o ON t.organization_id = o.id
   WHERE t.id = '[TICKET_ID]';
   ```

2. **Corriger si nécessaire** :
   ```sql
   UPDATE tickets
   SET organization_id = (
     SELECT organization_id 
     FROM events 
     WHERE id = tickets.event_id
   )
   WHERE organization_id IS NULL
     OR organization_id != (
       SELECT organization_id 
       FROM events 
       WHERE id = tickets.event_id
     );
   ```

---

## 📊 Scripts de Diagnostic

### Script 1 : État Global des Tickets

```sql
-- Voir tous les tickets avec leur statut
SELECT 
  'Tickets Créés' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'

UNION ALL

SELECT 
  'Tickets Payés' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'paid'

UNION ALL

SELECT 
  'Tickets avec QR code' as metric,
  COUNT(*)::text as value
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND qr_code IS NOT NULL;
```

### Script 2 : Tickets Prêts pour Paiement

```sql
-- Tickets non payés (prêts pour paiement)
SELECT 
  id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  created_at,
  CONCAT(
    '/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/',
    id,
    '/payment'
  ) as payment_url
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'unpaid'
ORDER BY created_at DESC;
```

### Script 3 : Tickets Payés avec QR Code

```sql
-- Tickets payés (prêts pour confirmation)
SELECT 
  id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  payment_method,
  qr_code,
  created_at,
  CONCAT(
    '/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/',
    id,
    '/confirmation'
  ) as confirmation_url
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
  AND payment_status = 'paid'
  AND qr_code IS NOT NULL
ORDER BY created_at DESC;
```

---

## ✅ Checklist de Vérification

Avant de signaler un problème, vérifier :

- [ ] Le ticket existe dans Supabase
- [ ] Le ticket appartient à la bonne organisation
- [ ] Le statut de paiement est correct
- [ ] Les routes existent dans le code
- [ ] Les logs du navigateur (F12)
- [ ] Les logs du serveur
- [ ] Les permissions RLS dans Supabase
- [ ] Les migrations sont appliquées

---

## 📞 Support

Si le problème persiste :

1. **Collecter les informations** :
   - ID du ticket
   - URL complète
   - Message d'erreur exact
   - Logs du navigateur
   - Logs du serveur

2. **Exécuter les scripts de diagnostic** :
   - `supabase/scripts/verify_ticket_payment_flow.sql`
   - `supabase/scripts/verify_ticket_creation.sql`

3. **Vérifier la documentation** :
   - `docs/FOIRE_DAKAR_TEST_GUIDE.md`
   - `docs/FOIRE_DAKAR_TICKETS_TABLE.md`

---

**Dernière mise à jour** : 2025-02-02  
**Statut** : ✅ Guide de dépannage complet

