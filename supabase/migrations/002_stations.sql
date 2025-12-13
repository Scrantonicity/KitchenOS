-- 002_stations.sql
-- Tablet devices/stations in the kitchen

CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identification
  station_number INT UNIQUE NOT NULL,
  name TEXT NOT NULL,                       -- "עמדת אריזה 1", "עמדת איסוף"
  
  -- Type and permissions
  type TEXT DEFAULT 'packing' CHECK (type IN ('packing', 'pickup', 'manager', 'admin')),
  
  -- Status
  is_online BOOLEAN DEFAULT false,
  last_seen_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  
  -- Device info (for debugging)
  device_info JSONB,                        -- {userAgent, screenSize, etc.}
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
COMMENT ON TABLE stations IS 'Registered tablet devices in the kitchen';
