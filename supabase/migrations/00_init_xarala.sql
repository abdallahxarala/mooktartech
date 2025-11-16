-- Migration initiale pour Xarala Solutions
-- Création de toutes les tables et configurations nécessaires

-- Extension pour générer des UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension pour les fonctions de texte
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Table des utilisateurs (profil étendu)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    company_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories de produits
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des produits
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku TEXT UNIQUE,
    barcode TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT,
    model TEXT,
    weight DECIMAL(8,2),
    dimensions JSONB, -- {length, width, height}
    specifications JSONB, -- Spécifications techniques
    features JSONB, -- Fonctionnalités
    image_url TEXT,
    gallery JSONB, -- Tableau d'URLs d'images
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    track_stock BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_digital BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des commandes
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    payment_method TEXT,
    payment_reference TEXT,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0 CHECK (shipping_amount >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT DEFAULT 'XOF',
    notes TEXT,
    shipping_address JSONB,
    billing_address JSONB,
    tracking_number TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des articles de commande
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des cartes virtuelles
CREATE TABLE IF NOT EXISTS public.virtual_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    template_id UUID,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    bio TEXT,
    avatar_url TEXT,
    background_color TEXT DEFAULT '#ffffff',
    text_color TEXT DEFAULT '#000000',
    logo_url TEXT,
    qr_code_url TEXT,
    nfc_data TEXT,
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    custom_fields JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des modèles de cartes
CREATE TABLE IF NOT EXISTS public.card_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    preview_url TEXT,
    template_data JSONB NOT NULL,
    category TEXT,
    is_premium BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analytics des cartes
CREATE TABLE IF NOT EXISTS public.card_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    card_id UUID REFERENCES public.virtual_cards(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'share', 'contact', 'download')),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des contacts
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    position TEXT,
    notes TEXT,
    tags TEXT[],
    source TEXT, -- Comment le contact a été obtenu
    is_active BOOLEAN DEFAULT true,
    last_contact_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des webhooks
CREATE TABLE IF NOT EXISTS public.webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    secret TEXT,
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des logs de webhooks
CREATE TABLE IF NOT EXISTS public.webhook_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    webhook_id UUID REFERENCES public.webhooks(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des analytics
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT,
    page_url TEXT,
    page_title TEXT,
    referrer TEXT,
    ip_address INET,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_user ON public.virtual_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_virtual_cards_public ON public.virtual_cards(is_public);
CREATE INDEX IF NOT EXISTS idx_card_analytics_card ON public.card_analytics(card_id);
CREATE INDEX IF NOT EXISTS idx_card_analytics_event ON public.card_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_contacts_user ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics(created_at);

-- Fonctions pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_virtual_cards_updated_at BEFORE UPDATE ON public.virtual_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_card_templates_updated_at BEFORE UPDATE ON public.card_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON public.webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Policies pour les utilisateurs
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les produits
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les commandes
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les articles de commande
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage order items" ON public.order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les cartes virtuelles
CREATE POLICY "Users can view own cards" ON public.virtual_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create cards" ON public.virtual_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON public.virtual_cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON public.virtual_cards FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public cards are viewable by everyone" ON public.virtual_cards FOR SELECT USING (is_public = true);

-- Policies pour les modèles de cartes
CREATE POLICY "Card templates are viewable by everyone" ON public.card_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage card templates" ON public.card_templates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les analytics des cartes
CREATE POLICY "Users can view own card analytics" ON public.card_analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.virtual_cards WHERE id = card_id AND user_id = auth.uid())
);
CREATE POLICY "Card analytics can be inserted" ON public.card_analytics FOR INSERT WITH CHECK (true);

-- Policies pour les contacts
CREATE POLICY "Users can view own contacts" ON public.contacts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create contacts" ON public.contacts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own contacts" ON public.contacts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own contacts" ON public.contacts FOR DELETE USING (auth.uid() = user_id);

-- Policies pour les webhooks
CREATE POLICY "Admins can manage webhooks" ON public.webhooks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les logs de webhooks
CREATE POLICY "Admins can view webhook logs" ON public.webhook_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Policies pour les analytics
CREATE POLICY "Analytics can be inserted" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.analytics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- Données initiales
INSERT INTO public.categories (name, slug, description) VALUES
('Cartes PVC', 'cartes-pvc', 'Cartes en PVC pour identification professionnelle'),
('Imprimantes', 'imprimantes', 'Imprimantes professionnelles pour cartes'),
('Accessoires', 'accessoires', 'Accessoires et consommables'),
('Cartes Virtuelles NFC', 'cartes-virtuelles-nfc', 'Cartes de visite digitales avec technologie NFC')
ON CONFLICT (slug) DO NOTHING;

-- Modèles de cartes par défaut
INSERT INTO public.card_templates (name, description, template_data, category) VALUES
('Classique', 'Design classique et professionnel', '{"background": "#ffffff", "text": "#000000", "layout": "centered"}', 'professionnel'),
('Moderne', 'Design moderne avec dégradés', '{"background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "text": "#ffffff", "layout": "left-aligned"}', 'moderne'),
('Minimaliste', 'Design épuré et minimaliste', '{"background": "#f8f9fa", "text": "#495057", "layout": "minimal"}', 'minimaliste')
ON CONFLICT DO NOTHING;

-- Commentaires
COMMENT ON TABLE public.users IS 'Profils utilisateurs étendus';
COMMENT ON TABLE public.products IS 'Catalogue des produits Xarala Solutions';
COMMENT ON TABLE public.orders IS 'Commandes des clients';
COMMENT ON TABLE public.virtual_cards IS 'Cartes de visite virtuelles';
COMMENT ON TABLE public.card_templates IS 'Modèles de cartes disponibles';
COMMENT ON TABLE public.contacts IS 'Carnet d''adresses des utilisateurs';
COMMENT ON TABLE public.analytics IS 'Données d''analyse et de tracking';
