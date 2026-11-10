-- ==============================================================================
-- SUPABASE SCHEMA & ROW LEVEL SECURITY (RLS) FOR MULTI-TENANT DIGITAL MENU & BOOKING
-- Tenant: SandBox Cafe (Cadiz City, Philippines - 10°50'N, 125°9'E)
-- ==============================================================================

-- 1. Enable uuid-ossp or pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Drop existing tables if re-running (order matters due to foreign keys)
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;

-- 3. Create 'businesses' table
-- Critical: Multi-tenant root entity accessed via slug (e.g., /b/sandbox-cafe)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    tagline TEXT DEFAULT 'Discover tranquility at SandBox Cafe in Cadiz City, a warm sanctuary for unwinding, where your days are perfected with relaxation and rich handcrafted brews.',
    hero_title TEXT DEFAULT 'Enjoy Your Coffee with SandBox Cafe',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create 'categories' table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create 'menu_items' table
-- Critical Directive: NO stock, inventory, or is_available tracking
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL, -- Prices in Philippine Pesos (PHP)
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Create 'reservations' table
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL, -- 639 format (e.g. +63 917 123 4567)
    reservation_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    party_size INT DEFAULT 2,
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Performance Indexes
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_categories_business ON categories(business_id);
CREATE INDEX idx_menu_items_business ON menu_items(business_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_reservations_business ON reservations(business_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 4 tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Security Requirement 1: Allow public access for businesses
CREATE POLICY "Allow public SELECT on businesses" 
ON businesses FOR SELECT TO public USING (true);

CREATE POLICY "Allow public INSERT on businesses" 
ON businesses FOR INSERT TO public WITH CHECK (true);

-- Security Requirement 2: Allow public access for categories
CREATE POLICY "Allow public SELECT on categories" 
ON categories FOR SELECT TO public USING (true);

CREATE POLICY "Allow public INSERT on categories" 
ON categories FOR INSERT TO public WITH CHECK (true);

-- Security Requirement 3: Allow public access for menu_items
CREATE POLICY "Allow public SELECT on menu_items" 
ON menu_items FOR SELECT TO public USING (true);

CREATE POLICY "Allow public INSERT on menu_items" 
ON menu_items FOR INSERT TO public WITH CHECK (true);

-- Security Requirement 4: Allow public SELECT and INSERT for reservations
CREATE POLICY "Allow public SELECT on reservations" 
ON reservations FOR SELECT TO public USING (true);

CREATE POLICY "Allow public INSERT on reservations" 
ON reservations FOR INSERT TO public WITH CHECK (true);

-- ==============================================================================
-- SEED DATA: SandBox Cafe (Cadiz City, Philippines: 10°50'N, 125°9'E)
-- ==============================================================================
-- SEED DATA: SandBox Cafe (Cadiz City, Philippines: 10°50'N, 125°9'E)
-- ==============================================================================

-- 1. Insert SandBox Cafe Business (Valid Hex UUID: b2222222...)
INSERT INTO businesses (id, slug, name, latitude, longitude, tagline, hero_title)
VALUES (
    'b2222222-2222-4222-8222-222222222222',
    'sandbox-cafe',
    'SandBox Cafe',
    10.950625,
    123.322375,
    'Discover tranquility at SandBox Cafe at Portside, Cadiz City, a warm seaside sanctuary for unwinding, where your days are perfected with ocean breezes and rich handcrafted brews.',
    'Enjoy Your Coffee with SandBox Cafe'
)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- 2. Insert Categories (Valid Hex UUIDs: c1111111...)
INSERT INTO categories (id, business_id, name, display_order)
VALUES 
    ('c1111111-0000-4000-8000-000000000001', 'b2222222-2222-4222-8222-222222222222', 'Signature Whipped', 1),
    ('c1111111-0000-4000-8000-000000000002', 'b2222222-2222-4222-8222-222222222222', 'Iced & Cold Brew', 2),
    ('c1111111-0000-4000-8000-000000000003', 'b2222222-2222-4222-8222-222222222222', 'Espresso & Latte', 3)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Menu Items with PHP currency (Valid Hex UUIDs: d1111111...)
INSERT INTO menu_items (id, business_id, category_id, name, price, image_url, description)
VALUES
    (
        'd1111111-0000-4000-8000-000000000001',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000001',
        'Dalgona Velvet Crema',
        195.00,
        'https://images.unsplash.com/photo-1587080413959-06b859fb107d?auto=format&fit=crop&w=800&q=80',
        'Golden whipped coffee crema layered over silky chilled fresh milk with organic muscovado sugar.'
    ),
    (
        'd1111111-0000-4000-8000-000000000002',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000002',
        'Iced Caramel Macchiato',
        185.00,
        'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
        'Fresh milk stained with double espresso shots and buttery artisanal caramel syrup over ice.'
    ),
    (
        'd1111111-0000-4000-8000-000000000003',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000002',
        'Nitro Cold Brew on Slate',
        190.00,
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        'Single-origin slow-steeped 16-hour cold brew served with glass straw on volcanic dark slate.'
    ),
    (
        'd1111111-0000-4000-8000-000000000004',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000003',
        'Spanish Sun Rosetta Latte',
        175.00,
        'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
        'Velvety steamed milk with sweet condensed milk base and hand-poured rosetta leaf art in ceramic.'
    ),
    (
        'd1111111-0000-4000-8000-000000000005',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000003',
        'Artisan Flat White Saucer',
        165.00,
        'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
        'Rich micro-foam delicately folded over double ristretto espresso, served on porcelain saucer.'
    ),
    (
        'd1111111-0000-4000-8000-000000000006',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000003',
        'SandBox Single-Origin Cortado',
        160.00,
        'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        'Equal ratio of double extracted espresso and velvety textured milk in a classic Gibraltar glass.'
    ),
    (
        'd1111111-0000-4000-8000-000000000007',
        'b2222222-2222-4222-8222-222222222222',
        'c1111111-0000-4000-8000-000000000001',
        'Ceremonial Matcha Cloud',
        210.00,
        'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
        'Stone-ground Uji ceremonial matcha whisked fresh and layered over silky oat milk with wild honey.'
    )
ON CONFLICT (id) DO NOTHING;

-- 4. Seed sample reservation with Philippine 639 format (Valid Hex UUID: e1111111...)
INSERT INTO reservations (id, business_id, customer_name, contact_number, reservation_time, status, party_size, special_notes)
VALUES (
    'e1111111-0000-4000-8000-000000000001',
    'b2222222-2222-4222-8222-222222222222',
    'Maria Santos',
    '+63 917 842 9102',
    NOW() + INTERVAL '2 days',
    'confirmed',
    2,
    'Corner window table for quiet coffee tasting'
)
ON CONFLICT (id) DO NOTHING;
