-- 001_menu.sql
-- Menu items with normalized names for GPT matching

CREATE TABLE menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Display info
  dish_name TEXT NOT NULL,
  dish_name_normalized TEXT NOT NULL,      -- Lowercase, no spaces: "עוףבטעםתימני"
  sku TEXT UNIQUE,                          -- Optional: "CHKN-TIM-001"
  description TEXT,
  image_url TEXT,
  
  -- Categorization
  category TEXT NOT NULL CHECK (category IN ('עיקריות', 'סלטים', 'תוספות', 'קינוחים')),
  sort_order INT DEFAULT 0,
  
  -- Pricing
  price_per_unit DECIMAL(10,2) NOT NULL,
  unit_type TEXT DEFAULT 'kg' CHECK (unit_type IN ('kg', 'unit', 'portion')),
  unit_label TEXT DEFAULT 'ק"ג',           -- Display: "ק"ג", "יחידה", "מנה"
  min_order_qty DECIMAL(10,2) DEFAULT 0.25,
  
  -- Availability
  available BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_menu_normalized ON menu(dish_name_normalized);
CREATE INDEX idx_menu_category ON menu(category);
CREATE INDEX idx_menu_available ON menu(available) WHERE available = true;

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER menu_updated_at 
  BEFORE UPDATE ON menu
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Comments
COMMENT ON TABLE menu IS 'Restaurant menu items';
COMMENT ON COLUMN menu.dish_name_normalized IS 'Lowercase, no-space version for GPT fuzzy matching';
COMMENT ON COLUMN menu.unit_type IS 'kg=by weight, unit=countable items, portion=fixed serving';
