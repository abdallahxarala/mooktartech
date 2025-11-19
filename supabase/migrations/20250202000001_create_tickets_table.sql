-- Migration : Création de la table tickets pour la billetterie avec QR codes
-- Foire Dakar 2025

-- 1. Créer la table tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informations acheteur
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  
  -- Type et quantité
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('adulte', 'enfant', 'groupe', 'vip', 'standard')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  
  -- Prix
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- QR Code
  qr_code_data TEXT NOT NULL, -- JSON stringifié du QR code
  qr_code_image_url TEXT, -- URL de l'image QR code (optionnel, pour stockage)
  
  -- Statut d'utilisation
  used BOOLEAN DEFAULT FALSE NOT NULL,
  used_at TIMESTAMPTZ,
  scanned_by UUID REFERENCES users(id), -- Admin qui a scanné
  
  -- Paiement
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT, -- 'wave', 'orange_money', 'cash', 'bank_transfer'
  payment_reference TEXT, -- Référence du paiement externe
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Créer les index pour performance
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_buyer_email ON tickets(buyer_email);
CREATE INDEX IF NOT EXISTS idx_tickets_used ON tickets(used);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_status ON tickets(payment_status);
CREATE INDEX IF NOT EXISTS idx_tickets_organization_id ON tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

-- Index composite pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_tickets_event_used ON tickets(event_id, used);

-- 3. Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_tickets_updated_at();

-- 4. RLS Policies
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Policy : Users can view their own tickets (by email)
CREATE POLICY "Users can view their own tickets"
ON tickets
FOR SELECT
USING (
  buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR buyer_email = (auth.jwt() ->> 'email')
);

-- Policy : Public can insert tickets (for purchase)
CREATE POLICY "Public can insert tickets"
ON tickets
FOR INSERT
WITH CHECK (true);

-- Policy : Users can update their own tickets (for payment status)
CREATE POLICY "Users can update their own tickets"
ON tickets
FOR UPDATE
USING (
  buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR buyer_email = (auth.jwt() ->> 'email')
);

-- Policy : Admins can view all tickets in their organization
CREATE POLICY "Admins can view all tickets in their organization"
ON tickets
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.organization_id = tickets.organization_id
    AND users.role IN ('admin', 'super_admin')
  )
);

-- Policy : Admins can update tickets (for validation)
CREATE POLICY "Admins can update tickets for validation"
ON tickets
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.organization_id = tickets.organization_id
    AND users.role IN ('admin', 'super_admin')
  )
);

-- 5. Fonction helper pour marquer un ticket comme utilisé
CREATE OR REPLACE FUNCTION mark_ticket_as_used(
  p_ticket_id UUID,
  p_scanned_by UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_status BOOLEAN;
BEGIN
  -- Vérifier le statut actuel
  SELECT used INTO v_current_status
  FROM tickets
  WHERE id = p_ticket_id;
  
  -- Si déjà utilisé, retourner false
  IF v_current_status = TRUE THEN
    RETURN FALSE;
  END IF;
  
  -- Marquer comme utilisé
  UPDATE tickets
  SET 
    used = TRUE,
    used_at = NOW(),
    scanned_by = p_scanned_by,
    updated_at = NOW()
  WHERE id = p_ticket_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Commentaires pour documentation
COMMENT ON TABLE tickets IS 'Table des billets avec QR codes pour la billetterie';
COMMENT ON COLUMN tickets.qr_code_data IS 'Données JSON du QR code (ticketId, eventSlug, ticketType, quantity, timestamp)';
COMMENT ON COLUMN tickets.used IS 'Indique si le billet a été utilisé/scanné';
COMMENT ON COLUMN tickets.scanned_by IS 'ID de l''admin qui a scanné le billet';

