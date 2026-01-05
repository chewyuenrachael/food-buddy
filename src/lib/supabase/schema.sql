-- Food Buddy Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================================
-- Users Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Lists Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  share_code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'hawker', 'cafe', 'local-favorites', 'budget', 'splurge',
    'late-night', 'breakfast', 'vegetarian', 'date-night',
    'family-friendly', 'tourist-must-try'
  )),
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for share code lookups
CREATE INDEX IF NOT EXISTS lists_share_code_idx ON lists(share_code);

-- Index for public lists
CREATE INDEX IF NOT EXISTS lists_public_idx ON lists(is_public) WHERE is_public = true;

-- ============================================================================
-- Places Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS places (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_place_id TEXT UNIQUE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(POINT) NOT NULL,
  cuisine_type TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  cultural_context TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Geospatial index for location queries
CREATE INDEX IF NOT EXISTS places_location_idx ON places USING GIST (location);

-- Index for Google Place ID lookups
CREATE INDEX IF NOT EXISTS places_google_id_idx ON places(google_place_id);

-- ============================================================================
-- List-Places Junction Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS list_places (
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  PRIMARY KEY (list_id, place_id)
);

-- Index for ordered retrieval
CREATE INDEX IF NOT EXISTS list_places_position_idx ON list_places(list_id, position);

-- ============================================================================
-- Food Routes Table (for optimized routes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  optimized_order UUID[] NOT NULL,
  total_walking_time INTEGER NOT NULL, -- minutes
  total_distance INTEGER NOT NULL, -- meters
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_routes ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can read public lists
CREATE POLICY "Anyone can view public lists" ON lists
  FOR SELECT USING (is_public = true);

-- Users can manage their own lists
CREATE POLICY "Users can manage own lists" ON lists
  FOR ALL USING (auth.uid() = user_id);

-- Anyone can read places
CREATE POLICY "Anyone can view places" ON places
  FOR SELECT USING (true);

-- Only authenticated users can create places
CREATE POLICY "Authenticated users can create places" ON places
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Anyone can read list_places for public lists
CREATE POLICY "Anyone can view list_places for public lists" ON list_places
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_places.list_id 
      AND lists.is_public = true
    )
  );

-- Users can manage list_places for their own lists
CREATE POLICY "Users can manage list_places for own lists" ON list_places
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM lists 
      WHERE lists.id = list_places.list_id 
      AND lists.user_id = auth.uid()
    )
  );

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on lists
CREATE TRIGGER lists_updated_at
  BEFORE UPDATE ON lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to get list with place count
CREATE OR REPLACE FUNCTION get_lists_with_counts()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  title TEXT,
  description TEXT,
  is_public BOOLEAN,
  share_code TEXT,
  category TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  place_count BIGINT,
  user_name TEXT,
  user_avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.user_id,
    l.title,
    l.description,
    l.is_public,
    l.share_code,
    l.category,
    l.cover_image_url,
    l.created_at,
    l.updated_at,
    COUNT(lp.place_id) as place_count,
    u.name as user_name,
    u.avatar_url as user_avatar_url
  FROM lists l
  LEFT JOIN list_places lp ON l.id = lp.list_id
  LEFT JOIN users u ON l.user_id = u.id
  WHERE l.is_public = true
  GROUP BY l.id, u.id
  ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Sample Data (Optional - for testing)
-- ============================================================================

-- Insert sample user
INSERT INTO users (id, email, name, avatar_url) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'demo@foodbuddy.sg', 'Demo User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo')
ON CONFLICT (email) DO NOTHING;

-- Insert sample places
INSERT INTO places (id, google_place_id, name, address, location, cuisine_type, tags, rating, price_level, cultural_context) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440101',
    'ChIJ-1',
    'Tian Tian Hainanese Chicken Rice',
    'Maxwell Food Centre, #01-10, Singapore 069184',
    ST_SetSRID(ST_MakePoint(103.8447, 1.2805), 4326),
    ARRAY['Singaporean', 'Chicken Rice'],
    ARRAY['air-conditioned'],
    4.5,
    1,
    'This legendary stall has been serving what many consider the best chicken rice in Singapore since 1987.'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440102',
    'ChIJ-2',
    'Hill Street Tai Hwa Pork Noodle',
    '466 Crawford Lane, #01-12, Singapore 190466',
    ST_SetSRID(ST_MakePoint(103.8617, 1.3067), 4326),
    ARRAY['Singaporean', 'Noodles'],
    ARRAY['reservation-recommended'],
    4.7,
    1,
    'A Michelin-starred hawker stall famous for bak chor mee (minced pork noodles).'
  )
ON CONFLICT (google_place_id) DO NOTHING;
