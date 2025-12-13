-- 003_customers.sql
-- Customer records with blacklist and HITL flags

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact
  phone TEXT UNIQUE NOT NULL,               -- Primary identifier (indexed)
  name TEXT,
  
  -- Order history stats
  total_orders INT DEFAULT 0,
  no_shows INT DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  
  -- Blacklist management
  blacklisted BOOLEAN DEFAULT false,
  blacklisted_at TIMESTAMPTZ,
  blacklisted_by UUID REFERENCES stations(id),
  blacklist_reason TEXT,
  
  -- Computed HITL flag (2+ no-shows triggers approval requirement)
  hitl_required BOOLEAN GENERATED ALWAYS AS (
    no_shows >= 2 AND NOT blacklisted
  ) STORED,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_blacklisted ON customers(blacklisted) WHERE blacklisted = true;
CREATE INDEX idx_customers_hitl ON customers(hitl_required) WHERE hitl_required = true;

CREATE TRIGGER customers_updated_at 
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Comments
COMMENT ON TABLE customers IS 'Customer records keyed by phone number';
COMMENT ON COLUMN customers.hitl_required IS 'Auto-computed: true if 2+ no-shows and not blacklisted';
