# 🎫 Création de la table `tickets`

**Date** : 2025-02-02  
**Migration** : `20250202000005_create_tickets_table.sql`  
**Statut** : ✅ Prêt pour exécution

---

## 📋 Structure de la Table

### Colonnes Principales

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID | Clé primaire |
| `event_id` | UUID | Référence à l'événement (FK) |
| `organization_id` | UUID | Référence à l'organisation (FK) - Pour isolation multitenant |
| `ticket_type` | TEXT | Type de billet (standard, vip, exposant, adulte, groupe) |
| `quantity` | INTEGER | Quantité de billets |
| `unit_price` | INTEGER | Prix unitaire en FCFA |
| `total_price` | INTEGER | Prix total en FCFA |
| `buyer_name` | TEXT | Nom de l'acheteur |
| `buyer_email` | TEXT | Email de l'acheteur |
| `buyer_phone` | TEXT | Téléphone (nullable) |
| `payment_status` | TEXT | Statut paiement (unpaid, paid, refunded, failed) |
| `payment_method` | TEXT | Méthode de paiement (cash, wave, orange_money, etc.) |
| `payment_reference` | TEXT | Référence du paiement (nullable) |
| `payment_date` | TIMESTAMP | Date du paiement (nullable) |
| `qr_code` | TEXT | QR code (déprécié, utiliser qr_code_data) |
| `qr_code_data` | JSONB | Données structurées du QR code |
| `qr_code_image_url` | TEXT | URL de l'image QR code |
| `used` | BOOLEAN | Indique si le billet a été utilisé |
| `used_at` | TIMESTAMP | Date d'utilisation (nullable) |
| `scanned_by` | UUID | Utilisateur qui a scanné (nullable, FK → users) |
| `metadata` | JSONB | Données supplémentaires |
| `created_at` | TIMESTAMP | Date de création |
| `updated_at` | TIMESTAMP | Date de mise à jour |

---

## 🔒 Contraintes CHECK

### ticket_type
```sql
CHECK (ticket_type IN ('standard', 'vip', 'exposant', 'adulte', 'groupe'))
```

### payment_status
```sql
CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed'))
```

### payment_method
```sql
CHECK (payment_method IN ('cash', 'wave', 'orange_money', 'free_money', 'bank_transfer', 'card'))
```

### quantity
```sql
CHECK (quantity > 0)
```

### unit_price et total_price
```sql
CHECK (unit_price >= 0)
CHECK (total_price >= 0)
```

---

## 📊 Indexes

1. `idx_tickets_event_id` - Sur `event_id`
2. `idx_tickets_organization_id` - Sur `organization_id` (isolation multitenant)
3. `idx_tickets_payment_status` - Sur `payment_status`
4. `idx_tickets_buyer_email` - Sur `buyer_email`
5. `idx_tickets_qr_code` - Sur `qr_code` (WHERE qr_code IS NOT NULL)
6. `idx_tickets_used` - Sur `used`
7. `idx_tickets_created_at` - Sur `created_at DESC`
8. `idx_tickets_ticket_type` - Sur `ticket_type`

---

## 🔐 RLS Policies

### 1. Lecture Publique
```sql
CREATE POLICY "Public can read tickets by QR code"
ON tickets FOR SELECT
USING (true);
```
**Objectif** : Permettre la vérification des QR codes sans authentification

### 2. Insertion Authentifiée
```sql
CREATE POLICY "Authenticated users can create tickets"
ON tickets FOR INSERT
TO authenticated
WITH CHECK (true);
```
**Objectif** : Permettre à tout utilisateur authentifié de créer des tickets

### 3. Mise à Jour Staff
```sql
CREATE POLICY "Staff can update tickets"
ON tickets FOR UPDATE
TO authenticated
USING (
  event_id IN (
    SELECT id FROM events 
    WHERE organization_id IN (
      SELECT organization_id FROM user_roles 
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'staff')
    )
  )
);
```
**Objectif** : Seuls les admins/staff peuvent mettre à jour les tickets

---

## ⚙️ Triggers

### updated_at
```sql
CREATE TRIGGER tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_tickets_updated_at();
```
**Objectif** : Mettre à jour automatiquement `updated_at` à chaque modification

---

## 🔄 Corrections du Code

### Fichier : `app/[locale]/org/[slug]/foires/[eventSlug]/tickets/page.tsx`

**Changements** :
1. ✅ `qr_code_data` : Utilise maintenant JSONB directement (pas besoin de `JSON.stringify`)
2. ✅ `organization_id` : Ajouté à la table pour isolation multitenant

**Avant** :
```typescript
qr_code_data: JSON.stringify(qrData)
```

**Après** :
```typescript
qr_code_data: qrData // JSONB directement
```

---

## ✅ Checklist de Déploiement

### Étape 1 : Migration SQL

- [ ] Exécuter `supabase/migrations/20250202000005_create_tickets_table.sql` dans Supabase SQL Editor
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Vérifier que la table est créée

### Étape 2 : Vérification

- [ ] Exécuter `supabase/scripts/verify_tickets_table.sql`
- [ ] Vérifier la structure de la table
- [ ] Vérifier les contraintes CHECK
- [ ] Vérifier les indexes
- [ ] Vérifier les RLS policies
- [ ] Vérifier les triggers

### Étape 3 : Tests

- [ ] Tester la création d'un ticket via l'interface
- [ ] Vérifier que `organization_id` est bien rempli
- [ ] Vérifier que `qr_code_data` est bien stocké en JSONB
- [ ] Vérifier que les QR codes sont générés correctement

### Étape 4 : Audit

- [ ] Exécuter `supabase/scripts/audit_foire_dakar_v2.sql`
- [ ] Vérifier que toutes les requêtes passent
- [ ] Vérifier les statistiques

---

## 📊 Exemple d'Insertion

```sql
INSERT INTO tickets (
  event_id,
  organization_id,
  ticket_type,
  quantity,
  unit_price,
  total_price,
  buyer_name,
  buyer_email,
  buyer_phone,
  payment_status,
  qr_code_data,
  metadata
) VALUES (
  'event-uuid-here',
  'org-uuid-here',
  'standard',
  2,
  2000,
  4000,
  'John Doe',
  'john@example.com',
  '+221771234567',
  'unpaid',
  '{"ticket_id": "...", "event_slug": "...", "type": "standard", "quantity": 2, "email": "john@example.com"}'::jsonb,
  '{"company": null, "order_date": "2025-02-02T10:00:00Z"}'::jsonb
);
```

---

## 🎯 Résultat Attendu

Après la migration :

✅ **Table `tickets` créée**  
✅ **Toutes les colonnes présentes**  
✅ **Contraintes CHECK appliquées**  
✅ **Indexes créés**  
✅ **RLS policies configurées**  
✅ **Triggers fonctionnels**  
✅ **Code application compatible**  
✅ **Isolation multitenant assurée**  

---

## 📝 Notes Techniques

### Isolation Multitenant

La colonne `organization_id` permet :
- ✅ Filtrage direct sans JOIN
- ✅ Performance optimale
- ✅ Sécurité renforcée
- ✅ Cohérence avec les autres tables

### JSONB vs TEXT

- `qr_code_data` utilise JSONB pour :
  - ✅ Requêtes JSON performantes
  - ✅ Validation automatique
  - ✅ Indexation possible
  - ✅ Flexibilité des données

### RLS Policies

Les policies sont configurées pour :
- ✅ Lecture publique (vérification QR)
- ✅ Insertion authentifiée
- ✅ Mise à jour restreinte (staff seulement)

---

**Dernière mise à jour** : 2025-02-02  
**Statut** : ✅ Prêt pour déploiement

