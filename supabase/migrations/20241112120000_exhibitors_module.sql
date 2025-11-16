-- =====================================================
-- MODULE EXPOSANTS & MARKETPLACE
-- =====================================================

-- =====================================================
-- TABLE EXPOSANTS
-- =====================================================

CREATE TABLE exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,

  -- Informations entreprise
  company_name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,

  -- Contact
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,

  -- Emplacement
  booth_number TEXT,
  booth_location TEXT,

  -- Catégorisation
  category TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Statut workflow
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'rejected', 'cancelled')),

  -- Paiement
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  payment_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'XOF',
  stripe_payment_id TEXT,
  stripe_payment_intent_id TEXT,

  -- QR Code
  qr_code_data TEXT,
  qr_code_url TEXT,

  -- Métadonnées
  settings JSONB DEFAULT '{}'::jsonb,

  -- Social media
  social_links JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,

  -- Contraintes d'unicité
  UNIQUE(event_id, slug),
  UNIQUE(event_id, booth_number)
);


-- =====================================================
-- TABLE PRODUITS/SERVICES EXPOSANTS
-- =====================================================

CREATE TABLE exhibitor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibitor_id UUID REFERENCES exhibitors(id) ON DELETE CASCADE NOT NULL,

  -- Informations produit
  name TEXT NOT NULL,
  description TEXT,

  -- Prix
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'XOF',
  price_on_request BOOLEAN DEFAULT false,

  -- Images
  images TEXT[] DEFAULT '{}',
  featured_image TEXT,

  -- Catégorisation
  category TEXT,
  tags TEXT[] DEFAULT '{}',

  -- Stock
  stock_quantity INTEGER,
  unlimited_stock BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,

  -- Mise en avant
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- TABLE INTERACTIONS VISITEURS-EXPOSANTS
-- =====================================================

CREATE TABLE exhibitor_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  exhibitor_id UUID REFERENCES exhibitors(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES event_attendees(id) ON DELETE SET NULL,

  -- Type d'interaction
  interaction_type TEXT NOT NULL CHECK (interaction_type IN (
    'page_view',
    'qr_scan',
    'product_view',
    'contact_request',
    'favorite',
    'share',
    'catalog_download'
  )),

  -- Références optionnelles
  product_id UUID REFERENCES exhibitor_products(id) ON DELETE SET NULL,

  -- Données supplémentaires
  metadata JSONB DEFAULT '{}'::jsonb,
  location_data JSONB,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================
-- INDEX POUR PERFORMANCE
-- =====================================================

-- Exposants
CREATE INDEX idx_exhibitors_event ON exhibitors(event_id);
CREATE INDEX idx_exhibitors_organization ON exhibitors(organization_id);
CREATE INDEX idx_exhibitors_slug ON exhibitors(slug);
CREATE INDEX idx_exhibitors_status ON exhibitors(status);
CREATE INDEX idx_exhibitors_payment_status ON exhibitors(payment_status);
CREATE INDEX idx_exhibitors_category ON exhibitors(category);
CREATE INDEX idx_exhibitors_contact_email ON exhibitors(contact_email);

-- Produits
CREATE INDEX idx_exhibitor_products_exhibitor ON exhibitor_products(exhibitor_id);
CREATE INDEX idx_exhibitor_products_category ON exhibitor_products(category);
CREATE INDEX idx_exhibitor_products_is_available ON exhibitor_products(is_available);
CREATE INDEX idx_exhibitor_products_is_featured ON exhibitor_products(is_featured);

-- Interactions
CREATE INDEX idx_exhibitor_interactions_event ON exhibitor_interactions(event_id);
CREATE INDEX idx_exhibitor_interactions_exhibitor ON exhibitor_interactions(exhibitor_id);
CREATE INDEX idx_exhibitor_interactions_visitor ON exhibitor_interactions(visitor_id);
CREATE INDEX idx_exhibitor_interactions_type ON exhibitor_interactions(interaction_type);
CREATE INDEX idx_exhibitor_interactions_created ON exhibitor_interactions(created_at);

-- Full-text search
CREATE INDEX idx_exhibitors_search ON exhibitors USING gin (
  to_tsvector('french', company_name || ' ' || COALESCE(description, ''))
);

CREATE INDEX idx_products_search ON exhibitor_products USING gin (
  to_tsvector('french', name || ' ' || COALESCE(description, ''))
);


-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE exhibitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitor_interactions ENABLE ROW LEVEL SECURITY;

-- Policy 1
CREATE POLICY "Event organizers manage exhibitors"
  ON exhibitors FOR ALL
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policy 2
CREATE POLICY "Approved exhibitors are public"
  ON exhibitors FOR SELECT
  USING (status IN ('approved', 'active'));

-- Policy 3
CREATE POLICY "Exhibitors manage their own data"
  ON exhibitors FOR ALL
  USING (contact_email = auth.email())
  WITH CHECK (contact_email = auth.email());

-- Policy 4
CREATE POLICY "Exhibitors manage their products"
  ON exhibitor_products FOR ALL
  USING (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  )
  WITH CHECK (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  );

-- Policy 5
CREATE POLICY "Products of approved exhibitors are public"
  ON exhibitor_products FOR SELECT
  USING (
    is_available = true
    AND exhibitor_id IN (
      SELECT id FROM exhibitors WHERE status IN ('approved', 'active')
    )
  );

-- Policy 6
CREATE POLICY "Event organizers view interactions"
  ON exhibitor_interactions FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policy 7
CREATE POLICY "Anyone can create interactions"
  ON exhibitor_interactions FOR INSERT
  WITH CHECK (true);

-- Policy 8
CREATE POLICY "Exhibitors view their interactions"
  ON exhibitor_interactions FOR SELECT
  USING (
    exhibitor_id IN (
      SELECT id FROM exhibitors WHERE contact_email = auth.email()
    )
  );


-- =====================================================
-- TRIGGERS UPDATED_AT
-- =====================================================

CREATE TRIGGER update_exhibitors_updated_at
  BEFORE UPDATE ON exhibitors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exhibitor_products_updated_at
  BEFORE UPDATE ON exhibitor_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- FONCTION UTILITAIRE : Générer QR Code Data
-- =====================================================

CREATE OR REPLACE FUNCTION generate_exhibitor_qr_data(exhibitor_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  event_slug TEXT;
  exhibitor_slug_val TEXT;
BEGIN
  SELECT e.slug, ex.slug INTO event_slug, exhibitor_slug_val
  FROM exhibitors ex
  JOIN events e ON e.id = ex.event_id
  WHERE ex.id = exhibitor_uuid;

  RETURN 'https://yourapp.com/expo/' || event_slug || '/' || exhibitor_slug_val;
END;
$$ LANGUAGE plpgsql;


-- =====================================================
-- VUE : Exposants avec statistiques
-- =====================================================

CREATE OR REPLACE VIEW exhibitors_with_stats AS
SELECT
  ex.*,
  COUNT(DISTINCT ep.id) AS products_count,
  COUNT(DISTINCT CASE WHEN ep.is_featured THEN ep.id END) AS featured_products_count,
  COUNT(DISTINCT ei.id) AS total_interactions,
  COUNT(DISTINCT CASE WHEN ei.interaction_type = 'page_view' THEN ei.id END) AS page_views,
  COUNT(DISTINCT CASE WHEN ei.interaction_type = 'qr_scan' THEN ei.id END) AS qr_scans,
  COUNT(DISTINCT ei.visitor_id) AS unique_visitors
FROM exhibitors ex
LEFT JOIN exhibitor_products ep ON ep.exhibitor_id = ex.id
LEFT JOIN exhibitor_interactions ei ON ei.exhibitor_id = ex.id
GROUP BY ex.id;

