-- ============================================================================
-- Migration : Créer table tickets pour la billetterie
-- Date : 2025-02-02
-- Description: Table pour gérer les billets vendus pour les événements
-- ============================================================================

-- 1. Créer la table tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, -- Pour isolation multitenant
  
  -- Informations billet
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('standard', 'vip', 'exposant', 'adulte', 'groupe')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  total_price INTEGER NOT NULL CHECK (total_price >= 0),
  
  -- Informations acheteur
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  
  -- Paiement
  payment_status TEXT NOT NULL DEFAULT 'unpaid' 
    CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  payment_method TEXT 
    CHECK (payment_method IN ('cash', 'wave', 'orange_money', 'free_money', 'bank_transfer', 'card')),
  payment_reference TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- QR Code et utilisation
  qr_code TEXT, -- URL ou base64 du QR code (déprécié, utiliser qr_code_data)
  qr_code_data JSONB, -- Données structurées du QR code
  qr_code_image_url TEXT, -- URL de l'image QR code (si stockée)
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  scanned_by UUID REFERENCES auth.users(id),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets(organization_id); -- Pour isolation multitenant
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);
CREATE INDEX IF NOT EXISTS idx_tickets_buyer_email ON tickets(buyer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_qr_code ON tickets(qr_code) WHERE qr_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tickets_used ON tickets(used);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_type ON tickets(ticket_type);

-- 3. RLS (Row Level Security)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy : Lecture publique (pour vérification QR code)
CREATE POLICY "Public can read tickets by QR code"
ON tickets FOR SELECT
USING (true);

-- Policy : Insertion par utilisateurs authentifiés
CREATE POLICY "Authenticated users can create tickets"
ON tickets FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy : Mise à jour par staff seulement
-- Note: Cette policy nécessite que la table user_roles existe
-- Si elle n'existe pas, on crée une policy plus permissive temporairement
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    EXECUTE '
    CREATE POLICY "Staff can update tickets"
    ON tickets FOR UPDATE
    TO authenticated
    USING (
      event_id IN (
        SELECT id FROM events 
        WHERE organization_id IN (
          SELECT organization_id FROM user_roles 
          WHERE user_id = auth.uid()
          AND role IN (''admin'', ''staff'')
        )
      )
    )';
  ELSE
    -- Policy temporaire plus permissive si user_roles n'existe pas
    EXECUTE '
    CREATE POLICY "Authenticated users can update tickets"
    ON tickets FOR UPDATE
    TO authenticated
    USING (true)';
  END IF;
END $$;

-- 4. Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_tickets_updated_at();

-- 5. Commentaires
COMMENT ON TABLE tickets IS 'Billets vendus pour les événements';
COMMENT ON COLUMN tickets.ticket_type IS 'Type de billet : standard (2000 FCFA), vip (5000 FCFA), exposant (10000 FCFA), adulte, groupe';
COMMENT ON COLUMN tickets.payment_status IS 'Statut du paiement : unpaid, paid, refunded, failed';
COMMENT ON COLUMN tickets.qr_code IS 'QR code pour l''entrée (généré automatiquement)';
COMMENT ON COLUMN tickets.qr_code_data IS 'Données structurées du QR code (JSON)';
COMMENT ON COLUMN tickets.used IS 'Indique si le billet a été utilisé pour entrer à l''événement';
COMMENT ON COLUMN tickets.metadata IS 'Données supplémentaires (JSON)';

-- 6. Vérification
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'tickets'
ORDER BY ordinal_position;

