# 📊 Schéma Supabase - Table exhibitors

**Date de mise à jour** : Février 2025

---

## Table `exhibitors`

### Colonnes Principales

| Colonne | Type | Nullable | Défaut | Description |
|---------|------|----------|--------|-------------|
| `id` | UUID | ❌ | `gen_random_uuid()` | Identifiant unique |
| `event_id` | UUID | ❌ | - | Référence à l'événement |
| `organization_id` | UUID | ❌ | - | Référence à l'organisation |
| `company_name` | TEXT | ❌ | - | Nom de l'entreprise |
| `slug` | TEXT | ❌ | - | Slug unique pour l'URL |
| `description` | TEXT | ✅ | `NULL` | Description de l'entreprise |
| `logo_url` | TEXT | ✅ | `NULL` | URL du logo |
| `banner_url` | TEXT | ✅ | `NULL` | URL de la bannière |
| `contact_name` | TEXT | ❌ | - | Nom du contact |
| `contact_email` | TEXT | ❌ | - | Email du contact |
| `contact_phone` | TEXT | ✅ | `NULL` | Téléphone du contact |
| `website` | TEXT | ✅ | `NULL` | Site web |
| `booth_number` | TEXT | ✅ | `NULL` | Numéro du stand |
| `booth_location` | TEXT | ✅ | `NULL` | Emplacement du stand |
| `category` | TEXT | ✅ | `NULL` | Catégorie |
| `tags` | TEXT[] | ✅ | `'{}'` | Tags |
| `status` | TEXT | ✅ | `'pending'` | Statut (pending, approved, active, rejected, cancelled) |
| `payment_status` | TEXT | ✅ | `'unpaid'` | Statut paiement (unpaid, paid, refunded, failed) ⚠️ **Valeurs autorisées uniquement** |
| `payment_method` | TEXT | ✅ | `'cash'` | **Méthode de paiement** (cash, wave, orange_money, bank_transfer, card) ⭐ **NOUVEAU** |
| `payment_amount` | DECIMAL(10,2) | ✅ | `NULL` | Montant du paiement |
| `currency` | TEXT | ✅ | `'XOF'` | Devise (XOF, EUR, USD, etc.) |
| `stripe_payment_id` | TEXT | ✅ | `NULL` | ID paiement Stripe |
| `stripe_payment_intent_id` | TEXT | ✅ | `NULL` | ID intent Stripe |
| `payment_reference` | TEXT | ✅ | `NULL` | Référence paiement externe (Wave, etc.) ⭐ **NOUVEAU** |
| `qr_code_data` | TEXT | ✅ | `NULL` | Données QR code |
| `qr_code_url` | TEXT | ✅ | `NULL` | URL QR code |
| `metadata` | JSONB | ✅ | `'{}'` | Métadonnées supplémentaires |
| `settings` | JSONB | ✅ | `'{}'` | Paramètres |
| `social_links` | JSONB | ✅ | `'{}'` | Liens réseaux sociaux |
| `created_at` | TIMESTAMPTZ | ✅ | `NOW()` | Date de création |
| `updated_at` | TIMESTAMPTZ | ✅ | `NOW()` | Date de mise à jour |
| `approved_at` | TIMESTAMPTZ | ✅ | `NULL` | Date d'approbation |

### Index

- `idx_exhibitors_event` : Sur `event_id`
- `idx_exhibitors_organization` : Sur `organization_id`
- `idx_exhibitors_slug` : Sur `slug`
- `idx_exhibitors_status` : Sur `status`
- `idx_exhibitors_payment_status` : Sur `payment_status`
- `idx_exhibitors_payment_method` : Sur `payment_method` ⭐ **NOUVEAU**
- `idx_exhibitors_payment_reference` : Sur `payment_reference` (partiel, seulement valeurs non-null) ⭐ **NOUVEAU**
- `idx_exhibitors_category` : Sur `category`
- `idx_exhibitors_contact_email` : Sur `contact_email`

### Contraintes

- **Clé primaire** : `id`
- **Unique** : `(event_id, slug)`
- **Unique** : `(event_id, booth_number)`
- **Check** : `status IN ('pending', 'approved', 'active', 'rejected', 'cancelled')`
- **Check** : `payment_status IN ('unpaid', 'paid', 'refunded', 'failed')` ⚠️ **'pending' n'est PAS autorisé**
- **Check** : `payment_method IN ('cash', 'wave', 'orange_money', 'bank_transfer', 'card')` ⭐ **NOUVEAU**

---

## Migrations : Ajout des colonnes de paiement

### Migration 1 : `payment_method`

**Fichier** : `supabase/migrations/20250202000002_add_payment_method_to_exhibitors.sql`

**Date** : 2025-02-02

**Description** : Ajoute la colonne `payment_method` pour stocker la méthode de paiement choisie par l'exposant.

### Migration 2 : `payment_reference`

**Fichier** : `supabase/migrations/20250202000003_add_payment_reference_to_exhibitors.sql`

**Date** : 2025-02-02

**Description** : Ajoute la colonne `payment_reference` pour stocker la référence du paiement externe (Wave payment ID, etc.).

**Valeurs possibles** :
- `'cash'` : Paiement au comptant (défaut)
- `'wave'` : Paiement via Wave
- `'orange_money'` : Paiement via Orange Money
- `'bank_transfer'` : Virement bancaire
- `'card'` : Carte bancaire

---

## Utilisation dans le Code

### Inscription Exposant

**Fichier** : `app/[locale]/org/[slug]/foires/[eventSlug]/inscription/page.tsx`

**Ligne 208** :
```typescript
payment_method: paymentMethod === 'mobile' ? 'wave' : paymentMethod === 'transfer' ? 'bank_transfer' : paymentMethod === 'cash' ? 'cash' : null,
```

**Ligne 1976** (handleWavePayment) :
```typescript
payment_method: 'wave',
```

**Ligne 2119** (handleWavePayment - mise à jour) :
```typescript
payment_reference: payment.id,
```

---

## ⚠️ Valeurs Autorisées pour payment_status

**IMPORTANT** : La contrainte CHECK limite les valeurs à :
- `'unpaid'` : Non payé (défaut)
- `'paid'` : Payé
- `'refunded'` : Remboursé
- `'failed'` : Échec du paiement

**Valeurs NON autorisées** :
- ❌ `'pending'` → Utiliser `'unpaid'` à la place
- ❌ `'completed'` → Utiliser `'paid'` à la place
- ❌ `'processing'` → Utiliser `'unpaid'` à la place

### Mapping Recommandé

```typescript
// ❌ MAUVAIS
payment_status: 'pending'

// ✅ BON
payment_status: 'unpaid' // Pour les paiements en attente

// ❌ MAUVAIS
payment_status: 'completed'

// ✅ BON
payment_status: 'paid' // Pour les paiements complétés
```

---

## Vérification

Pour vérifier que les colonnes existent :

```sql
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'exhibitors' 
AND column_name IN ('payment_method', 'payment_reference')
ORDER BY column_name;
```

**Résultat attendu** :
```
column_name         | data_type | column_default | is_nullable
payment_method      | text      | 'cash'::text   | YES
payment_reference   | text      | NULL           | YES
```

Pour vérifier la contrainte CHECK :

```sql
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'exhibitors'::regclass
AND conname LIKE '%payment_status%';
```

---

## Notes

- La colonne est **nullable** pour permettre les insertions sans spécifier la méthode
- La valeur par défaut est `'cash'` pour les nouveaux enregistrements
- Un index a été créé pour améliorer les requêtes de filtrage par méthode de paiement
- Les enregistrements existants sans `payment_method` sont mis à jour avec `'cash'`

