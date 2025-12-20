-- Migration: Create Orders and Order Items Tables
-- Story 1.4: Orders Database Schema and Manual Order Entry API
-- Created: 2025-12-20

-- ============================================================================
-- STEP 1: Create ENUM types for orders
-- ============================================================================

CREATE TYPE order_status AS ENUM (
  'created',
  'packing',
  'ready',
  'collected',
  'cancelled',
  'no_show'
);

CREATE TYPE order_source AS ENUM (
  'whatsapp',
  'manual',
  'email',
  'phone'
);

-- ============================================================================
-- STEP 2: Create orders table
-- ============================================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status order_status NOT NULL DEFAULT 'created',
  source order_source NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_pickup_time_future CHECK (pickup_time > created_at),
  CONSTRAINT chk_customer_name_not_empty CHECK (length(trim(customer_name)) > 0),
  CONSTRAINT chk_customer_phone_format CHECK (
    customer_phone IS NULL OR customer_phone ~ '^05\d{8}$'
  )
);

-- Create indexes for performance
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_pickup_time ON orders(pickup_time);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ============================================================================
-- STEP 3: Create order_items table
-- ============================================================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT chk_quantity_positive CHECK (quantity > 0)
);

-- Create index for efficient joins
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_dish_id ON order_items(dish_id);

-- ============================================================================
-- STEP 4: Create trigger for automatic updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 5: Enable Row Level Security
-- ============================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Allow SELECT for all users (for TV dashboard read access)
CREATE POLICY "Allow public read access to orders"
  ON orders
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to order_items"
  ON order_items
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to manage orders
CREATE POLICY "Allow authenticated users to manage orders"
  ON orders
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to manage order items
CREATE POLICY "Allow authenticated users to manage order_items"
  ON order_items
  FOR ALL
  USING (auth.role() = 'authenticated');
