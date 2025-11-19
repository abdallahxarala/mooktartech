-- ============================================================================
-- Migration: Ajouter colonne payment_reference à la table exhibitors
-- Date: 2025-02-02
-- Description: Ajoute la colonne payment_reference pour stocker la référence du paiement externe (Wave, etc.)
-- ============================================================================

-- 1. Ajouter la colonne payment_reference si elle n'existe pas
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

-- 2. Créer index pour améliorer les requêtes de recherche par référence
CREATE INDEX IF NOT EXISTS idx_exhibitors_payment_reference 
ON exhibitors(payment_reference)
WHERE payment_reference IS NOT NULL;

