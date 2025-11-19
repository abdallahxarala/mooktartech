# 🧪 Guide de Test - Foire Dakar 2025

**Date** : 2025-02-02  
**Objectif** : Tester le parcours complet de la billetterie

---

## 🎯 Parcours Complet à Tester

### Étape 1 : Billetterie - Sélection et Formulaire

**URL** : `http://localhost:3000/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets`

**Actions** :
1. ✅ Vérifier que la page se charge correctement
2. ✅ Vérifier que les 3 types de billets s'affichent :
   - Billet Visiteur (1000 FCFA)
   - Pass VIP (5000 FCFA)
   - Billet Groupe (8000 FCFA)
3. ✅ Sélectionner un billet (ex: Billet Visiteur)
4. ✅ Augmenter la quantité à 2
5. ✅ Vérifier que le sous-total s'affiche (2000 FCFA)
6. ✅ Remplir le formulaire :
   - Prénom : `Jean`
   - Nom : `Dupont`
   - Email : `jean.dupont@example.com`
   - Téléphone : `+221 77 123 45 67`
   - Entreprise : `Test Company` (optionnel)
7. ✅ Vérifier le récapitulatif dans la colonne de droite
8. ✅ Cliquer sur "Procéder au paiement"

**Résultat Attendu** :
- ✅ Ticket créé avec `payment_status='unpaid'`
- ✅ Redirection vers `/tickets/[ID]/payment`
- ✅ Pas d'erreur dans la console

**Vérification SQL** :
```sql
SELECT 
  id,
  organization_id,
  event_id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  payment_status,
  created_at
FROM tickets
ORDER BY created_at DESC
LIMIT 1;
```

**Résultat Attendu** :
```
organization_id: 6559a4ed-0ac4-4157-980e-756369fc683c ✅
ticket_type: standard
quantity: 2
total_price: 2000
payment_status: unpaid ✅
buyer_name: Jean Dupont
buyer_email: jean.dupont@example.com
```

---

### Étape 2 : Paiement - Sélection Méthode

**URL** : `http://localhost:3000/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/[TICKET_ID]/payment`

**Actions** :
1. ✅ Vérifier que la page se charge correctement
2. ✅ Vérifier le résumé de commande :
   - Événement : Foire Dakar 2025
   - Type de billet : standard
   - Quantité : 2
   - Acheteur : Jean Dupont
   - Total : 2000 FCFA
3. ✅ Vérifier que les 4 méthodes de paiement s'affichent :
   - Wave (sélectionné par défaut)
   - Orange Money
   - Free Money
   - Espèces
4. ✅ Sélectionner "Wave"
5. ✅ Entrer le numéro de téléphone : `+221 77 123 45 67`
6. ✅ Vérifier que le bouton "Payer" est activé
7. ✅ Cliquer sur "Payer"

**Résultat Attendu** :
- ✅ Ticket mis à jour avec `payment_status='paid'`
- ✅ `payment_method` = `'wave'`
- ✅ `payment_reference` généré
- ✅ `payment_date` enregistré
- ✅ Redirection vers `/tickets/[ID]/confirmation`
- ✅ Pas d'erreur dans la console

**Vérification SQL** :
```sql
SELECT 
  id,
  payment_status,
  payment_method,
  payment_reference,
  payment_date,
  updated_at
FROM tickets
WHERE id = '[TICKET_ID]';
```

**Résultat Attendu** :
```
payment_status: paid ✅
payment_method: wave ✅
payment_reference: REF-1234567890-abc123 ✅
payment_date: 2025-02-02T10:05:00Z ✅
```

---

### Étape 3 : Confirmation - QR Code

**URL** : `http://localhost:3000/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/[TICKET_ID]/confirmation`

**Actions** :
1. ✅ Vérifier que la page se charge correctement
2. ✅ Vérifier le message de succès : "Paiement réussi !"
3. ✅ Vérifier les informations de l'événement :
   - Nom : Foire Dakar 2025
   - Date : (si disponible)
   - Lieu : (si disponible)
4. ✅ Vérifier que le QR code s'affiche :
   - Image QR code visible
   - Référence affichée : `FOIRE2025-{ticket_id}-foire-dakar-2025`
5. ✅ Vérifier les détails du billet :
   - Type : standard
   - Quantité : 2
   - Acheteur : Jean Dupont
   - Email : jean.dupont@example.com
   - Méthode de paiement : Wave
   - Total payé : 2000 FCFA
6. ✅ Tester le bouton "Télécharger le billet" (impression)
7. ✅ Tester le bouton "Envoyer par email"

**Résultat Attendu** :
- ✅ QR code généré et affiché
- ✅ `qr_code` rempli dans la base
- ✅ `qr_code_data` rempli (JSONB)
- ✅ Téléchargement fonctionne
- ✅ Email s'ouvre avec les bonnes informations

**Vérification SQL** :
```sql
SELECT 
  id,
  qr_code,
  qr_code_data,
  payment_status,
  used
FROM tickets
WHERE id = '[TICKET_ID]';
```

**Résultat Attendu** :
```
qr_code: FOIRE2025-{ticket_id}-foire-dakar-2025 ✅
qr_code_data: {"ticket_id": "...", "event_slug": "...", ...} ✅
payment_status: paid ✅
used: false ✅
```

---

## 🔍 Tests de Validation

### Test 1 : Validation Email

**Action** : Essayer de créer un ticket avec email invalide

**Résultat Attendu** :
- ❌ Erreur : "Veuillez entrer une adresse email valide"
- ❌ Pas de redirection vers `/payment`

### Test 2 : Validation Quantité

**Action** : Essayer de créer un ticket sans sélectionner de billet

**Résultat Attendu** :
- ❌ Erreur : "Veuillez sélectionner au moins un billet"
- ❌ Bouton "Procéder au paiement" désactivé

### Test 3 : Validation Téléphone (Mobile Money)

**Action** : Sélectionner Wave sans entrer de téléphone

**Résultat Attendu** :
- ❌ Bouton "Payer" désactivé
- ❌ Message d'erreur si clic : "Veuillez entrer votre numéro de téléphone"

### Test 4 : Accès Direct Non Autorisé

**Action** : Accéder directement à `/confirmation` avec un ticket non payé

**Résultat Attendu** :
- ❌ Redirection vers 404 (`notFound()`)
- ❌ Ou redirection vers `/payment`

### Test 5 : Isolation Multitenant

**Action** : Vérifier qu'un ticket créé pour Foire Dakar n'est pas visible par Xarala/Mooktar

**Résultat Attendu** :
- ✅ Tickets filtrés par `organization_id`
- ✅ Pas de fuite de données

---

## 📊 Checklist de Test

### Fonctionnalités

- [ ] Page billetterie se charge
- [ ] Types de billets s'affichent
- [ ] Sélection quantité fonctionne
- [ ] Formulaire validation fonctionne
- [ ] Création ticket fonctionne
- [ ] Redirection vers payment fonctionne
- [ ] Page payment se charge
- [ ] Résumé commande correct
- [ ] Sélection méthode paiement fonctionne
- [ ] Validation téléphone fonctionne
- [ ] Paiement fonctionne
- [ ] Redirection vers confirmation fonctionne
- [ ] Page confirmation se charge
- [ ] QR code généré et affiché
- [ ] Téléchargement fonctionne
- [ ] Email fonctionne

### Données

- [ ] `organization_id` rempli correctement
- [ ] `event_id` rempli correctement
- [ ] `payment_status` mis à jour correctement
- [ ] `payment_method` enregistré
- [ ] `payment_reference` généré
- [ ] `qr_code` généré après paiement
- [ ] `qr_code_data` rempli (JSONB)

### Sécurité

- [ ] Isolation multitenant vérifiée
- [ ] Validation côté client fonctionne
- [ ] Validation côté serveur fonctionne
- [ ] Protection accès non autorisé

---

## 🐛 Dépannage

### Erreur : Page confirmation renvoie 404

**Cause** : Le ticket n'est pas encore payé (`payment_status='unpaid'`)

**Solution** :
1. Accéder à la page de paiement :
   ```
   /fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/[TICKET_ID]/payment
   ```
2. Sélectionner une méthode de paiement (ex: Wave)
3. Entrer le numéro de téléphone (si mobile money)
4. Cliquer sur "Payer"
5. Redirection automatique vers `/confirmation` avec QR code ✅

**Vérification SQL** :
```sql
SELECT 
  id,
  payment_status,
  qr_code
FROM tickets
WHERE id = '[TICKET_ID]';
```

**Résultat attendu après paiement** :
```
payment_status: paid ✅
qr_code: FOIRE2025-[ticket_id]-foire-dakar-2025 ✅
```

### Erreur : "Could not find the 'organization_id' column"

**Solution** : Exécuter la migration `20250202000006_add_organization_id_to_tickets.sql`

### Erreur : QR code ne s'affiche pas

**Vérifier** :
1. Le package `qrcode` est installé ✅ (v1.5.4)
2. `ticket.qr_code` n'est pas null
3. `ticket.payment_status` = `'paid'`
4. Pas d'erreur dans la console du navigateur

**Solution** : Si le ticket est payé mais le QR code manque, il sera généré automatiquement à l'accès de la page confirmation.

### Erreur : Redirection ne fonctionne pas

**Vérifier** :
1. Le ticket a bien été créé
2. L'ID du ticket est correct
3. Les routes existent
4. Le ticket est payé (pour `/confirmation`)

### Erreur : Bouton "Payer" désactivé

**Cause** : Numéro de téléphone manquant pour mobile money

**Solution** :
- Entrer un numéro de téléphone (ex: `+221 77 123 45 67`)
- Ou sélectionner "Espèces" (cash) qui ne nécessite pas de téléphone

---

## 📝 Notes de Test

**Date du test** : _______________  
**Testeur** : _______________  
**Résultat global** : ✅ / ❌

**Tickets créés** :
- Ticket ID : _______________
- Type : _______________
- Quantité : _______________
- Prix : _______________ FCFA
- Statut : _______________

**Problèmes rencontrés** :
1. _______________
2. _______________

**Solutions appliquées** :
1. _______________
2. _______________

---

## 🔍 Scripts SQL de Vérification

### Script 1 : Vérifier l'état des tickets
```sql
-- Voir tous les tickets avec leur statut
SELECT 
  id,
  ticket_type,
  quantity,
  total_price,
  buyer_name,
  buyer_email,
  payment_status,
  payment_method,
  qr_code,
  created_at
FROM tickets
WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
ORDER BY created_at DESC;
```

### Script 2 : Statistiques complètes
```sql
-- Exécuter le script complet
-- Fichier: supabase/scripts/verify_ticket_payment_flow.sql
```

### Script 3 : Vérifier un ticket spécifique
```sql
SELECT 
  id,
  payment_status,
  payment_method,
  payment_reference,
  payment_date,
  qr_code,
  qr_code_data,
  created_at
FROM tickets
WHERE id = '[TICKET_ID]';
```

---

## 🎯 Parcours Rapide de Test

### Test Rapide (Ticket Existant)

1. **Vérifier les tickets non payés** :
   ```sql
   SELECT id, buyer_email, total_price, created_at
   FROM tickets
   WHERE organization_id = '6559a4ed-0ac4-4157-980e-756369fc683c'
     AND payment_status = 'unpaid'
   ORDER BY created_at DESC
   LIMIT 1;
   ```

2. **Accéder à la page de paiement** :
   ```
   http://localhost:3001/fr/org/foire-dakar-2025/foires/foire-dakar-2025/tickets/[TICKET_ID]/payment
   ```

3. **Payer le ticket** :
   - Sélectionner "Wave"
   - Entrer téléphone : `+221 77 123 45 67`
   - Cliquer "Payer"

4. **Vérifier la confirmation** :
   - Redirection automatique vers `/confirmation`
   - QR code affiché ✅

5. **Vérifier dans Supabase** :
   ```sql
   SELECT payment_status, qr_code, qr_code_data
   FROM tickets
   WHERE id = '[TICKET_ID]';
   ```

**Résultat attendu** :
```
payment_status: paid ✅
qr_code: FOIRE2025-[ticket_id]-foire-dakar-2025 ✅
qr_code_data: {"ticket_id": "...", ...} ✅
```

---

**Dernière mise à jour** : 2025-02-02  
**Statut** : ✅ Guide de test prêt avec scripts SQL

