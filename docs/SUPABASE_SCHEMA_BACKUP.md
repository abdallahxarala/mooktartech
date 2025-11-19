# 📊 Supabase Schema Backup - Pre-Multitenant

**Date** : 2025-02-02  
**Version** : v0.1.0-pre-multitenant  
**Commit** : 2a49293

---

## Organizations

| ID | Name | Slug | Created |
|----|------|------|---------|
| `0e973c3f-f507-4071-bb72-a01b92430186` | Mooktar Tech | mooktartech-com | 2025-11-16 |
| `08aca8c3-584d-4d83-98d0-90476ec40f3d` | Xarala Solutions | xarala-solutions | 2025-11-10 |
| `6559a4ed-0ac4-4157-980e-756369fc683c` | Foire Dakar 2025 | foire-dakar-2025 | 2025-11-15 |

---

## Data Summary

- **Mooktar Tech** : 27 produits, 0 événements
- **Xarala Solutions** : 0 produits, 6 événements, 1 exposant
- **Foire Dakar 2025** : 0 produits, 1 événement, 2 exposants

---

## Tables Structure

### Core Tables

1. **organizations**
   - `id`, `name`, `slug`, `description`, `logo_url`, `website`, `phone`, `email`, `address`, `is_active`, `created_at`, `updated_at`

2. **products**
   - `id`, `name`, `description`, `price`, `category`, `image_url`, `stock`, `featured`, `organization_id`, `brand`, `created_at`, `updated_at`

3. **orders**
   - `id`, `user_id`, `order_number`, `status`, `subtotal`, `shipping`, `tax`, `total`, `currency`, `shipping_address`, `payment_intent_id`, `payment_status`, `payment_method`, `organization_id`, `created_at`, `updated_at`

4. **events**
   - `id`, `organization_id`, `name`, `slug`, `description`, `event_type`, `start_date`, `end_date`, `location`, `status`, `foire_config` (JSONB), `created_at`, `updated_at`

5. **exhibitors**
   - `id`, `event_id`, `organization_id`, `company_name`, `slug`, `description`, `logo_url`, `banner_url`, `contact_name`, `contact_email`, `contact_phone`, `website`, `booth_location`, `category`, `tags`, `status`, `payment_status`, `payment_method`, `payment_reference`, `payment_amount`, `currency`, `metadata` (JSONB), `created_at`, `updated_at`

6. **exhibitor_staff**
   - `id`, `exhibitor_id`, `first_name`, `last_name`, `function`, `email`, `phone`, `badge_photo_url`, `badge_id`, `badge_printed`, `access_level`, `is_primary_contact`, `metadata`, `created_at`, `updated_at`

7. **exhibitor_products**
   - `id`, `exhibitor_id`, `name`, `description`, `price`, `currency`, `images`, `category`, `tags`, `stock_quantity`, `is_available`, `is_featured`, `created_at`, `updated_at`

8. **tickets**
   - `id`, `event_id`, `organization_id`, `buyer_name`, `buyer_email`, `buyer_phone`, `ticket_type`, `quantity`, `unit_price`, `total_price`, `qr_code_data`, `qr_code_image_url`, `used`, `used_at`, `payment_status`, `payment_method`, `payment_reference`, `created_at`, `updated_at`

9. **event_attendees**
   - `id`, `event_id`, `name`, `email`, `phone`, `ticket_type`, `created_at`

---

## Key Constraints

- **products.organization_id** : NOT NULL, Foreign Key → organizations.id
- **orders.organization_id** : NOT NULL, Foreign Key → organizations.id
- **events.organization_id** : NOT NULL, Foreign Key → organizations.id
- **exhibitors.organization_id** : NOT NULL, Foreign Key → organizations.id
- **exhibitors.payment_status** : CHECK ('unpaid', 'paid', 'refunded', 'failed')
- **exhibitors.payment_method** : CHECK ('cash', 'wave', 'orange_money', 'bank_transfer', 'card')
- **exhibitors.status** : CHECK ('pending', 'approved', 'active', 'rejected', 'cancelled')

---

## Indexes

- `idx_products_organization_id` : products(organization_id)
- `idx_orders_organization_id` : orders(organization_id)
- `idx_exhibitors_event` : exhibitors(event_id)
- `idx_exhibitors_organization` : exhibitors(organization_id)
- `idx_exhibitors_payment_status` : exhibitors(payment_status)
- `idx_exhibitors_payment_method` : exhibitors(payment_method)
- `idx_exhibitor_staff_exhibitor` : exhibitor_staff(exhibitor_id)
- `idx_tickets_event` : tickets(event_id)
- `idx_tickets_organization` : tickets(organization_id)

---

## Views

- **exhibitors_with_stats** : Vue agrégée avec statistiques (produits, interactions, vues, scans QR)

---

## Storage Buckets

- **foire-dakar-documents** : Documents PDF (factures, badges, etc.)
  - RLS : Public read, Admin/Exhibitor upload

---

## Notes

- ✅ Schema confirmé fonctionnel
- ⚠️ RLS policies partiellement implémentées (certaines tables désactivées temporairement)
- ✅ Multitenant isolation en cours d'implémentation
- ✅ Système de factures PDF fonctionnel
- ✅ Système d'emails transactionnels configuré
- ✅ Intégration Wave pour paiements
- ✅ Génération QR codes pour tickets

---

## Migrations Appliquées

- `20250130000002_add_organization_id_to_products.sql`
- `20250131000002_create_exhibitor_staff.sql`
- `20250131000003_update_foire_tarification.sql`
- `20250201000000_add_metadata_to_exhibitors.sql`
- `20250201000005_create_exhibitor_staff_table.sql`
- `20250202000001_create_tickets_table.sql`
- `20250202000002_add_payment_method_to_exhibitors.sql`
- `20250202000003_add_payment_reference_to_exhibitors.sql`

---

## Scripts de Migration Disponibles

- `supabase/scripts/01_identify_printer_products.sql`
- `supabase/scripts/02_copy_printer_products_to_xarala.sql`
- `supabase/scripts/03_verify_products_copy.sql`
- `supabase/scripts/04_create_specific_xarala_products.sql`
- `supabase/scripts/add_payment_columns_to_exhibitors.sql`

