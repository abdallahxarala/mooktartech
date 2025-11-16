-- Exhibitors & Marketplace module
-- ===========================================

-- Table: exhibitors
CREATE TABLE IF NOT EXISTS exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Company information
  company_name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,

  -- Contact
  contact_name TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,

  -- Physical location
  booth_number TEXT,
  booth_location TEXT,

  -- Categorization
  category TEXT,
  tags TEXT[],

  -- Status & payments
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_amount DECIMAL(10,2),
  stripe_payment_id TEXT,

  -- QR Code
  qr_code_url TEXT,

  -- Metadata
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(event_id, slug),
  UNIQUE(event_id, booth_number)
);


-- Table: exhibitor_products
CREATE TABLE IF NOT EXISTS exhibitor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'XOF',

  -- Images
  images TEXT[],
  featured_image TEXT,

  -- Categorization
  category TEXT,
  tags TEXT[],

  -- Stock
  stock_quantity INTEGER,
  is_available BOOLEAN DEFAULT TRUE,

  -- Visibility
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Table: exhibitor_interactions
CREATE TABLE IF NOT EXISTS exhibitor_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  exhibitor_id UUID NOT NULL REFERENCES exhibitors(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES event_attendees(id) ON DELETE SET NULL,

  interaction_type TEXT NOT NULL,
  product_id UUID REFERENCES exhibitor_products(id) ON DELETE SET NULL,

  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Indexes
CREATE INDEX IF NOT EXISTS idx_exhibitors_event ON exhibitors(event_id);
CREATE INDEX IF NOT EXISTS idx_exhibitors_slug ON exhibitors(slug);
CREATE INDEX IF NOT EXISTS idx_exhibitor_products_exhibitor ON exhibitor_products(exhibitor_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_interactions_event ON exhibitor_interactions(event_id);
CREATE INDEX IF NOT EXISTS idx_exhibitor_interactions_exhibitor ON exhibitor_interactions(exhibitor_id);


-- Enable RLS
ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_interactions ENABLE ROW LEVEL SECURITY;


-- Policies
CREATE POLICY "Event organizers manage exhibitors"
  ON exhibitors
  FOR ALL
  USING (
    event_id IN (
      SELECT id
      FROM events
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id
      FROM events
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Approved exhibitors are public"
  ON exhibitors
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Exhibitors manage their products"
  ON exhibitor_products
  FOR ALL
  USING (
    exhibitor_id IN (
      SELECT id
      FROM exhibitors
      WHERE contact_email = auth.email()
    )
  )
  WITH CHECK (
    exhibitor_id IN (
      SELECT id
      FROM exhibitors
      WHERE contact_email = auth.email()
    )
  );

CREATE POLICY "Products of approved exhibitors are public"
  ON exhibitor_products
  FOR SELECT
  USING (
    exhibitor_id IN (
      SELECT id
      FROM exhibitors
      WHERE status = 'approved'
    )
  );

-- Allow interactions logging by organizers or system (broad policy)
CREATE POLICY "Manage exhibitor interactions"
  ON exhibitor_interactions
  FOR ALL
  USING (
    event_id IN (
      SELECT id
      FROM events
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id
      FROM events
      WHERE organization_id IN (
        SELECT organization_id
        FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Interactions of approved exhibitors are public"
  ON exhibitor_interactions
  FOR SELECT
  USING (
    exhibitor_id IN (
      SELECT id
      FROM exhibitors
      WHERE status = 'approved'
    )
  );


-- updated_at triggers
CREATE TRIGGER update_exhibitors_updated_at
  BEFORE UPDATE ON exhibitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exhibitor_products_updated_at
  BEFORE UPDATE ON exhibitor_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

