-- ============================================================================
-- Script SQL: Ajouter colonnes payment_method et payment_reference à exhibitors
-- Date: 2025-02-02
-- Description: Script combiné pour exécution directe dans Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. Ajouter payment_method
-- ============================================================================

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

CREATE INDEX IF NOT EXISTS idx_exhibitors_payment_method 
ON exhibitors(payment_method);

UPDATE exhibitors
SET payment_method = 'cash'
WHERE payment_method IS NULL;

-- ============================================================================
-- 2. Ajouter payment_reference
-- ============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'exhibitors' AND column_name = 'payment_reference'
  ) THEN
    ALTER TABLE exhibitors
    ADD COLUMN payment_reference TEXT;
    
    COMMENT ON COLUMN exhibitors.payment_reference IS 'Référence du paiement externe (Wave payment ID, etc.)';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_exhibitors_payment_reference 
ON exhibitors(payment_reference)
WHERE payment_reference IS NOT NULL;

-- ============================================================================
-- 3. Vérification
-- ============================================================================

SELECT 
  column_name, 
  data_type, 
  column_default, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'exhibitors' 
AND column_name IN ('payment_method', 'payment_reference')
ORDER BY column_name;

