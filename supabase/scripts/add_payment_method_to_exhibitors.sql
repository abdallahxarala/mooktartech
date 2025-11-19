-- ============================================================================
-- Script SQL: Ajouter colonne payment_method à la table exhibitors
-- Date: 2025-02-02
-- Description: Script pour exécution directe dans Supabase SQL Editor
-- ============================================================================

-- 1. Ajouter la colonne payment_method si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'payment_method'
  ) THEN
    ALTER TABLE exhibitors
    ADD COLUMN payment_method TEXT 
    CHECK (payment_method IN ('cash', 'wave', 'orange_money', 'bank_transfer', 'card'))
    DEFAULT 'cash';
    
    COMMENT ON COLUMN exhibitors.payment_method IS 'Méthode de paiement choisie par l''exposant (cash, wave, orange_money, bank_transfer, card)';
  END IF;
END $$;

-- 2. Créer index pour améliorer les requêtes de filtrage par méthode de paiement
CREATE INDEX IF NOT EXISTS idx_exhibitors_payment_method 
ON exhibitors(payment_method);

-- 3. Mettre à jour les enregistrements existants sans payment_method
UPDATE exhibitors
SET payment_method = 'cash'
WHERE payment_method IS NULL;

-- 4. Vérifier que la colonne existe
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'exhibitors' 
AND column_name = 'payment_method';

