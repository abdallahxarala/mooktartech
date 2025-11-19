-- ============================================================================
-- Migration: Create exhibitor_staff table
-- Date: 2025-01-31
-- Description: Table pour gérer le staff des exposants avec badges
-- ============================================================================

-- Table pour les exposants individuels (staff d'un exhibitor)
CREATE TABLE IF NOT EXISTS exhibitor_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  function TEXT, -- Fonction dans l'entreprise
  email TEXT,
  phone TEXT,
  badge_photo_url TEXT, -- Photo pour le badge
  badge_id TEXT UNIQUE NOT NULL, -- ID unique du badge
  badge_printed BOOLEAN DEFAULT false,
  badge_printed_at TIMESTAMPTZ,
  access_level TEXT DEFAULT 'exhibitor', -- 'exhibitor' | 'manager' | 'staff'
  is_primary_contact BOOLEAN DEFAULT false, -- Contact principal
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_exhibitor ON exhibitor_staff(exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_badge ON exhibitor_staff(badge_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_staff_email ON exhibitor_staff(email);

-- Trigger updated_at
CREATE TRIGGER update_exhibitor_staff_updated_at
  BEFORE UPDATE ON exhibitor_staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security)
ALTER TABLE exhibitor_staff ENABLE ROW LEVEL SECURITY;

-- Policy : Les exposants peuvent voir/modifier leur propre staff
CREATE POLICY "Exhibitors can view their own staff"
  ON exhibitor_staff FOR SELECT
  USING (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  );

CREATE POLICY "Exhibitors can insert their own staff"
  ON exhibitor_staff FOR INSERT
  WITH CHECK (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  );

CREATE POLICY "Exhibitors can update their own staff"
  ON exhibitor_staff FOR UPDATE
  USING (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  );

CREATE POLICY "Exhibitors can delete their own staff"
  ON exhibitor_staff FOR DELETE
  USING (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  );

-- Policy : Admin peut tout voir
CREATE POLICY "Admins can view all staff"
  ON exhibitor_staff FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exhibitors e
      JOIN events ev ON e.event_id = ev.id
      JOIN organization_members om ON ev.organization_id = om.organization_id
      WHERE e.id = exhibitor_staff.exhibitor_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Commentaires
COMMENT ON TABLE exhibitor_staff IS 'Staff members of exhibitors with badge info';
COMMENT ON COLUMN exhibitor_staff.badge_id IS 'Unique badge identifier for printing';
COMMENT ON COLUMN exhibitor_staff.badge_photo_url IS 'Photo URL for badge printing';
COMMENT ON COLUMN exhibitor_staff.access_level IS 'Access level: exhibitor, manager, or staff';
COMMENT ON COLUMN exhibitor_staff.is_primary_contact IS 'Whether this staff member is the primary contact for the exhibitor';

