-- Migration: 001_create_dishes_table.sql
-- Description: Create dishes table for menu item management

-- Create ENUM type for unit measurement
CREATE TYPE unit_type AS ENUM ('unit', 'weight');

-- Create trigger function for updated_at (reusable for all tables)
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create dishes table
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit_type unit_type NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL CHECK (price_per_unit > 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for filtering active dishes
CREATE INDEX idx_dishes_is_active ON dishes(is_active);

-- Create index for name ordering
CREATE INDEX idx_dishes_name ON dishes(name);

-- Enable Row Level Security
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all users to read active dishes (public read access)
CREATE POLICY "Allow public read access to active dishes"
  ON dishes FOR SELECT
  USING (is_active = true);

-- RLS Policy: Allow service role full access (for API routes and authenticated operations)
CREATE POLICY "Allow service role full access to dishes"
  ON dishes FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Comments for documentation
COMMENT ON TABLE dishes IS 'Menu items available for ordering';
COMMENT ON COLUMN dishes.name IS 'Hebrew display name of the dish';
COMMENT ON COLUMN dishes.unit_type IS 'unit = countable items, weight = sold by weight (kg)';
COMMENT ON COLUMN dishes.price_per_unit IS 'Price in NIS per unit or per kg';
COMMENT ON COLUMN dishes.is_active IS 'Whether the dish is currently available for ordering';
