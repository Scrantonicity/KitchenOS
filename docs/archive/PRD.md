# KitchenOS (Lacomida KDS) — Product Requirements Document

**Version:** 2.0
**Last Updated:** December 12, 2024
**Status:** In Development
**Language:** Hebrew (RTL Support)
**Methodology:** BMad Method (BMM)

> **Implementation Guide**: This PRD is implemented using the [BMad Method](.claude/workflows/bmad-method.md) - a structured, phase-based approach with Epic → Story → Task hierarchy.

---

# 📑 Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Device & User Matrix](#3-device--user-matrix)
4. [Screen Inventory](#4-screen-inventory)
5. [Database Schema](#5-database-schema)
6. [API Contracts](#6-api-contracts)
7. [Security Model](#7-security-model)
8. [Offline Resilience](#8-offline-resilience)
9. [Real-time Subscriptions](#9-real-time-subscriptions)
10. [Project Folder Structure](#10-project-folder-structure)
11. [Component Library](#11-component-library)
12. [Environment Variables](#12-environment-variables)
13. [Sprint Plan](#13-sprint-plan)
14. [Pre-Development Checklist](#14-pre-development-checklist)

---

# 1. Executive Summary

## Project Overview
**KitchenOS** is a tablet-first Kitchen Display System (KDS) for Lacomida restaurant, integrating WhatsApp ordering (via n8n + Wassenger), payment processing (Meshulam), and human-in-the-loop (HITL) approval workflows.

## Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Shadcn/ui (customized for touch) |
| State | Zustand (offline queue), React Query (server state) |
| Backend | Next.js API Routes (Vercel serverless) |
| Database | Supabase (PostgreSQL 15) |
| Real-time | Supabase Realtime Channels |
| Auth | Supabase Auth (Phase 2) |
| Workflows | n8n (self-hosted or cloud) |
| Payments | Meshulam |
| WhatsApp | Wassenger |
| HITL | Telegram Bot |
| Hosting | Vercel |

## Key Design Principles
1. **Tablet-first**: 48px minimum touch targets, large inputs, gesture support
2. **Offline-resilient**: Queue mutations locally, sync with conflict resolution
3. **Real-time**: Instant updates across all stations via Supabase Realtime
4. **Secure**: HMAC-signed webhooks, API key rotation, rate limiting
5. **Auditable**: Status history tracking, error logging, payment audit trail

---

# 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 EXTERNAL SERVICES                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│   │  WhatsApp   │    │    n8n      │    │  Meshulam   │    │  Telegram   │         │
│   │ (Wassenger) │    │  Workflows  │    │  Payments   │    │  HITL Bot   │         │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
│          │                  │                  │                  │                 │
│          │    ┌─────────────┴──────────────────┴──────────────────┘                 │
│          │    │                                                                      │
│          │    │  HMAC-Signed Webhooks (x-webhook-signature + timestamp)             │
│          │    │                                                                      │
│          ▼    ▼                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                           VERCEL (Next.js 16)                               │   │
│   │                                                                              │   │
│   │   ┌─────────────────────────────────────────────────────────────────────┐   │   │
│   │   │                         API ROUTES                                  │   │   │
│   │   │                                                                      │   │   │
│   │   │  /api/orders          - CRUD + status updates                       │   │   │
│   │   │  /api/customers       - Lookup, blacklist, HITL check               │   │   │
│   │   │  /api/inventory       - Daily stock management                      │   │   │
│   │   │  /api/menu            - Dish management                             │   │   │
│   │   │  /api/reservations    - שמור לי management                          │   │   │
│   │   │  /api/stations        - Tablet registration                         │   │   │
│   │   │  /api/sync            - Offline queue sync endpoint                 │   │   │
│   │   │  /api/webhooks/*      - n8n, Meshulam, Telegram callbacks           │   │   │
│   │   │                                                                      │   │   │
│   │   └─────────────────────────────────────────────────────────────────────┘   │   │
│   │                                    │                                         │   │
│   │   ┌─────────────────────────────────────────────────────────────────────┐   │   │
│   │   │                      FRONTEND (React/Next.js)                       │   │   │
│   │   │                                                                      │   │   │
│   │   │   (kds) Layout Group          │    (admin) Layout Group             │   │   │
│   │   │   ├── Orders Dashboard        │    ├── Menu Management              │   │   │
│   │   │   ├── Packing Screen          │    ├── Customer Details             │   │   │
│   │   │   ├── Inventory Management    │    ├── Analytics (Phase 2)          │   │   │
│   │   │   ├── Pickup Queue            │    └── Settings (Phase 2)           │   │   │
│   │   │   ├── Reservations            │                                      │   │   │
│   │   │   ├── Risk Approvals          │                                      │   │   │
│   │   │   └── Manual Order Entry      │                                      │   │   │
│   │   │                                                                      │   │   │
│   │   └─────────────────────────────────────────────────────────────────────┘   │   │
│   │                                    │                                         │   │
│   └────────────────────────────────────┼─────────────────────────────────────────┘   │
│                                        │                                             │
│                                        ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────────────┐   │
│   │                              SUPABASE                                        │   │
│   │                                                                              │   │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│   │   │  PostgreSQL  │  │   Realtime   │  │     Auth     │  │   Storage    │   │   │
│   │   │   Database   │  │   Channels   │  │  (Phase 2)   │  │  (Phase 2)   │   │   │
│   │   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│   │                                                                              │   │
│   │   Tables:                          Channels:                                 │   │
│   │   ├── menu                         ├── orders (INSERT, UPDATE)              │   │
│   │   ├── customers                    ├── inventory (UPDATE)                   │   │
│   │   ├── orders                       ├── reservations (INSERT, UPDATE)        │   │
│   │   ├── order_items                  └── stations (UPDATE)                    │   │
│   │   ├── order_status_history                                                   │   │
│   │   ├── daily_inventory                                                        │   │
│   │   ├── reserved_items                                                         │   │
│   │   ├── stations                                                               │   │
│   │   └── error_log                                                              │   │
│   │                                                                              │   │
│   └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              TABLET DEVICES (Kitchen)                                │
│                                                                                      │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│   │  Station 1   │  │  Station 2   │  │  Station 3   │  │   Manager    │           │
│   │   Packing    │  │   Packing    │  │    Pickup    │  │    iPad      │           │
│   │    iPad      │  │   Android    │  │    Tablet    │  │              │           │
│   └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                                      │
│   Features per station:                                                              │
│   • Offline queue with localStorage persistence                                      │
│   • Auto-sync on reconnection                                                        │
│   • Conflict resolution (server wins for terminal states)                            │
│   • Station ID displayed in header                                                   │
│   • Sound notifications for new orders                                               │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. Device & User Matrix

| User Role | Primary Device | Screen Size | Primary Screens | Auth Level |
|-----------|----------------|-------------|-----------------|------------|
| Kitchen Staff | Touch Tablet (iPad/Android) | 10"+ | Orders, Packing, Inventory, Pickup | Station |
| Pickup Staff | Touch Tablet | 10"+ | Pickup Queue, Reservations | Station |
| Owner/Manager | Tablet + Mobile | 10"+ / 6"+ | Approvals, All KDS screens | Manager |
| Admin | Desktop | 13"+ | Menu, Analytics, Settings | Admin |

## Tablet UX Requirements

```
┌────────────────────────────────────────────────────────────────┐
│                    TOUCH TARGET SPECIFICATIONS                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Minimum touch target:     48px × 48px                        │
│   Recommended button:       56px height                         │
│   Input field height:       52px minimum                        │
│   Font size (body):         16px minimum                        │
│   Font size (buttons):      18px                                │
│   Spacing between targets:  8px minimum                         │
│   Border radius:            12-16px (finger-friendly)           │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│                         GESTURES                                │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Swipe Left:    Reveal quick actions (cancel, start packing)  │
│   Swipe Right:   Mark as collected (reservations/pickup)       │
│   Pull Down:     Refresh data                                   │
│   Long Press:    Context menu                                   │
│   Double Tap:    Clear input field and focus                   │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│                    LAYOUT (Landscape Primary)                   │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │ HEADER: Logo │ Station │ Time │ Connection │ Sync      │  │
│   ├─────────────────────────────────────────────────────────┤  │
│   │                                                          │  │
│   │                    MAIN CONTENT                          │  │
│   │              (scrollable, touch-optimized)               │  │
│   │                                                          │  │
│   ├─────────────────────────────────────────────────────────┤  │
│   │ BOTTOM NAV: הזמנות │ מלאי │ איסוף │ שמור לי │ עוד...   │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

# 4. Screen Inventory

## MVP Screens (8 total)

| # | Screen Name | Route | Layout | Priority | Primary Actions |
|---|-------------|-------|--------|----------|-----------------|
| 1 | Orders Dashboard | `/` | `(kds)` | 🔴 P0 | View orders, filter, start packing |
| 2 | Weighing & Packing | `/orders/[id]` | `(kds)` | 🔴 P0 | Enter weights, calculate price, send payment |
| 3 | Inventory Management | `/inventory` | `(kds)` | 🔴 P0 | Set daily quantities, view availability |
| 4 | Payment & Pickup Queue | `/pickup` | `(kds)` | 🔴 P0 | Track payments, mark collected |
| 5 | Risk Approvals | `/approvals` | `(kds)` | 🟡 P1 | HITL approve/reject, manage blacklist |
| 6 | Reserved Items (שמור לי) | `/reservations` | `(kds)` | 🟡 P1 | View reservations, mark collected |
| 7 | Manual Order Entry | `/orders/new` | `(kds)` | 🟡 P1 | Create phone/walk-in orders |
| 8 | Menu Management | `/menu` | `(admin)` | 🟡 P1 | CRUD dishes, prices, availability |

## Phase 2 Screens

| # | Screen Name | Route | Layout | Purpose |
|---|-------------|-------|--------|---------|
| 9 | Analytics Dashboard | `/analytics` | `(admin)` | Sales, no-show rate, popular items |
| 10 | Customer Details | `/customers/[id]` | `(admin)` | Order history, notes, blacklist |
| 11 | Settings | `/settings` | `(admin)` | App configuration |

## Screen Flow Diagram

```
                                    ┌─────────────────┐
                                    │  Orders Dashboard │
                                    │       (/)        │
                                    └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
                    ▼                        ▼                        ▼
         ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
         │ Packing Screen   │    │ Risk Approvals   │    │ Manual Order     │
         │ /orders/[id]     │    │ /approvals       │    │ /orders/new      │
         └────────┬─────────┘    └──────────────────┘    └──────────────────┘
                  │
                  │ "ארוז ושלח" (Pack & Send)
                  ▼
         ┌──────────────────┐
         │  Pickup Queue    │◄───────────────────────────────────────┐
         │  /pickup         │                                        │
         └────────┬─────────┘                                        │
                  │                                                   │
                  │ "נאסף" (Collected)                               │
                  ▼                                                   │
         ┌──────────────────┐                              ┌──────────────────┐
         │    Completed     │                              │  Reservations    │
         │   (no screen)    │                              │  /reservations   │
         └──────────────────┘                              └──────────────────┘

         ┌──────────────────┐                              ┌──────────────────┐
         │    Inventory     │                              │ Menu Management  │
         │   /inventory     │                              │     /menu        │
         └──────────────────┘                              └──────────────────┘
```

---

# 5. Database Schema

## Complete SQL Migrations

### Migration 001: Menu Table

```sql
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
```

### Migration 002: Stations Table

```sql
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
```

### Migration 003: Customers Table

```sql
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
```

### Migration 004: Orders Table

```sql
-- 004_orders.sql
-- Main orders table with comprehensive status tracking

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE,               -- Human-readable order #

  -- Customer reference
  customer_id UUID NOT NULL REFERENCES customers(id),

  -- Pricing
  estimated_total DECIMAL(10,2),            -- Sum of (requested_qty × price)
  final_total DECIMAL(10,2),                -- Sum of (final_qty × price)
  manual_price_override BOOLEAN DEFAULT false,
  manual_price DECIMAL(10,2),               -- If override is true

  -- Timing
  pickup_time TIMESTAMPTZ,                  -- Requested pickup time
  packing_started_at TIMESTAMPTZ,
  packed_at TIMESTAMPTZ,
  picked_up_at TIMESTAMPTZ,

  -- Status workflow
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',           -- New order, waiting to be processed
    'awaiting_approval', -- HITL required, waiting for manager
    'approved',          -- HITL approved, ready for packing
    'packing',           -- Currently being packed
    'ready',             -- Packed, waiting for payment link
    'pending_payment',   -- Payment link sent, waiting for payment
    'paid_online',       -- Paid via Meshulam
    'paid_cash',         -- Will pay cash at pickup
    'completed',         -- Picked up successfully
    'no_show',           -- Customer didn't show up
    'cancelled'          -- Order cancelled
  )),

  -- HITL (Human-in-the-loop)
  hitl_required BOOLEAN DEFAULT false,
  hitl_decided_by UUID REFERENCES stations(id),
  hitl_decided_at TIMESTAMPTZ,
  hitl_decision TEXT CHECK (hitl_decision IN ('approved', 'rejected')),
  hitl_rejection_reason TEXT,
  risk_score INT,                           -- Computed risk score (0-100)

  -- Payment
  payment_url TEXT,                         -- Meshulam payment link
  payment_id TEXT,                          -- Meshulam transaction ID
  payment_method TEXT CHECK (payment_method IN ('online', 'cash', 'card')),
  paid_at TIMESTAMPTZ,
  payment_reminder_sent_at TIMESTAMPTZ,
  payment_reminder_count INT DEFAULT 0,

  -- Source and metadata
  source TEXT DEFAULT 'bot' CHECK (source IN ('bot', 'phone', 'walk_in', 'reserved')),
  is_reserve_request BOOLEAN DEFAULT false, -- שמור לי request
  is_large_order BOOLEAN DEFAULT false,     -- Flagged for review
  notes TEXT,                               -- Customer notes
  internal_notes TEXT,                      -- Staff notes

  -- Attribution
  packed_by UUID REFERENCES stations(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_status_pickup ON orders(status, pickup_time);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_hitl ON orders(hitl_required, status)
  WHERE hitl_required = true AND status = 'awaiting_approval';
CREATE INDEX idx_orders_payment ON orders(status)
  WHERE status IN ('pending_payment', 'ready');

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Comments
COMMENT ON TABLE orders IS 'Main orders table';
COMMENT ON COLUMN orders.status IS 'Order workflow status - see status flow diagram';
COMMENT ON COLUMN orders.risk_score IS 'Computed risk: base 50 + (no_shows × 15) + new_customer + large_order';
```

### Migration 005: Order Items Table

```sql
-- 005_order_items.sql
-- Line items for orders (normalized, not JSONB, for analytics)

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Dish reference (denormalized for performance)
  dish_id UUID NOT NULL REFERENCES menu(id),
  dish_name TEXT NOT NULL,                  -- Snapshot at order time
  sku TEXT,

  -- Quantities
  requested_qty DECIMAL(10,2) NOT NULL,     -- What customer ordered
  final_qty DECIMAL(10,2),                  -- Actual weight after packing
  unit_type TEXT DEFAULT 'kg',

  -- Pricing (snapshot at order time)
  price_per_unit DECIMAL(10,2) NOT NULL,
  estimated_price DECIMAL(10,2) GENERATED ALWAYS AS (
    requested_qty * price_per_unit
  ) STORED,
  final_price DECIMAL(10,2),                -- final_qty × price_per_unit

  -- Packing status
  packed BOOLEAN DEFAULT false,
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_dish ON order_items(dish_id);

-- Comments
COMMENT ON TABLE order_items IS 'Individual line items in an order';
COMMENT ON COLUMN order_items.dish_name IS 'Denormalized dish name at order time';
```

### Migration 006: Order Status History Table

```sql
-- 006_order_status_history.sql
-- Audit trail for order status changes

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

  -- Status change
  from_status TEXT,                         -- NULL for initial creation
  to_status TEXT NOT NULL,

  -- Attribution
  changed_by_station_id UUID REFERENCES stations(id),
  changed_by_source TEXT NOT NULL CHECK (changed_by_source IN (
    'station',    -- KDS tablet
    'n8n',        -- Workflow automation
    'webhook',    -- External webhook (Meshulam, etc.)
    'system',     -- Auto-triggered
    'admin'       -- Admin override
  )),

  -- Additional context
  metadata JSONB,                           -- e.g., {reason: "Customer cancelled"}

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_status_history_created ON order_status_history(created_at DESC);

-- Auto-log trigger
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (
      order_id,
      from_status,
      to_status,
      changed_by_station_id,
      changed_by_source
    )
    VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NEW.packed_by,
      COALESCE(current_setting('app.change_source', true), 'system')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_status_change();

-- Comments
COMMENT ON TABLE order_status_history IS 'Audit trail for all order status changes';
```

### Migration 007: Daily Inventory Table

```sql
-- 007_daily_inventory.sql
-- Kitchen prep quantities per day (renamed from reserved_stock)

CREATE TABLE daily_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  dish_id UUID NOT NULL REFERENCES menu(id),
  inventory_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Quantities
  prepared_qty DECIMAL(10,2) NOT NULL,      -- Kitchen's prep target
  ordered_qty DECIMAL(10,2) DEFAULT 0,      -- Consumed by confirmed orders
  available_qty DECIMAL(10,2) GENERATED ALWAYS AS (
    prepared_qty - ordered_qty
  ) STORED,

  unit_type TEXT DEFAULT 'kg',

  -- Attribution
  updated_by UUID REFERENCES stations(id),

  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one entry per dish per day
  UNIQUE(dish_id, inventory_date)
);

-- Indexes
CREATE INDEX idx_inventory_date ON daily_inventory(inventory_date);
CREATE INDEX idx_inventory_date_dish ON daily_inventory(inventory_date, dish_id);
CREATE INDEX idx_inventory_available ON daily_inventory(available_qty)
  WHERE available_qty > 0;

-- Realtime notification trigger
CREATE OR REPLACE FUNCTION notify_inventory_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('inventory_updates', json_build_object(
    'type', TG_OP,
    'dish_id', NEW.dish_id,
    'available_qty', NEW.available_qty,
    'inventory_date', NEW.inventory_date
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_change_trigger
  AFTER INSERT OR UPDATE ON daily_inventory
  FOR EACH ROW EXECUTE FUNCTION notify_inventory_change();

-- Comments
COMMENT ON TABLE daily_inventory IS 'Daily kitchen inventory/prep quantities';
COMMENT ON COLUMN daily_inventory.prepared_qty IS 'How much kitchen prepared/allocated for the day';
COMMENT ON COLUMN daily_inventory.ordered_qty IS 'How much has been ordered (reserved by confirmed orders)';
COMMENT ON COLUMN daily_inventory.available_qty IS 'Auto-calculated: prepared - ordered';
```

### Migration 008: Reserved Items Table

```sql
-- 008_reserved_items.sql
-- "שמור לי" (Save for me) reservations

CREATE TABLE reserved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Customer
  customer_id UUID NOT NULL REFERENCES customers(id),

  -- Item details
  dish_id UUID NOT NULL REFERENCES menu(id),
  dish_name TEXT NOT NULL,                  -- Snapshot
  quantity DECIMAL(10,2) DEFAULT 0.5,
  unit_type TEXT DEFAULT 'kg',

  -- Reservation details
  reserved_for_date DATE NOT NULL,
  reservation_time TIME,                    -- Preferred pickup time

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN (
    'active',     -- Waiting for pickup
    'collected',  -- Successfully picked up
    'expired',    -- Day passed without pickup
    'cancelled'   -- Customer or staff cancelled
  )),

  -- Collection tracking
  collected_at TIMESTAMPTZ,
  collected_by UUID REFERENCES stations(id),

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_reserved_items_date ON reserved_items(reserved_for_date, status);
CREATE INDEX idx_reserved_items_customer ON reserved_items(customer_id);
CREATE INDEX idx_reserved_items_active ON reserved_items(status)
  WHERE status = 'active';

-- Comments
COMMENT ON TABLE reserved_items IS 'שמור לי - Save for me reservations (no upfront payment)';
```

### Migration 009: Error Log Table

```sql
-- 009_error_log.sql
-- System error tracking and debugging

CREATE TABLE error_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Error source
  source TEXT NOT NULL,                     -- 'n8n', 'webhook', 'api', 'frontend'
  workflow TEXT,                            -- n8n workflow name if applicable
  endpoint TEXT,                            -- API endpoint if applicable

  -- Error details
  error_type TEXT NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  error_details JSONB,                      -- Full error context

  -- Related entities
  order_id UUID REFERENCES orders(id),
  customer_phone TEXT,
  station_id UUID REFERENCES stations(id),

  -- Severity
  severity TEXT DEFAULT 'error' CHECK (severity IN (
    'debug', 'info', 'warning', 'error', 'critical'
  )),

  -- Resolution
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES stations(id),
  resolution_notes TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_error_log_severity ON error_log(severity, resolved);
CREATE INDEX idx_error_log_created ON error_log(created_at DESC);
CREATE INDEX idx_error_log_source ON error_log(source);
CREATE INDEX idx_error_log_unresolved ON error_log(resolved)
  WHERE resolved = false AND severity IN ('error', 'critical');

-- Comments
COMMENT ON TABLE error_log IS 'System error tracking for debugging and monitoring';
```

### Migration 010: Realtime Triggers

```sql
-- 010_realtime_triggers.sql
-- Triggers for Supabase Realtime notifications

-- Orders realtime notification
CREATE OR REPLACE FUNCTION notify_order_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('order_updates', json_build_object(
    'type', TG_OP,
    'id', NEW.id,
    'order_number', NEW.order_number,
    'status', NEW.status,
    'pickup_time', NEW.pickup_time,
    'hitl_required', NEW.hitl_required,
    'customer_id', NEW.customer_id
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_change_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_change();

-- Reservations realtime notification
CREATE OR REPLACE FUNCTION notify_reservation_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('reservation_updates', json_build_object(
    'type', TG_OP,
    'id', NEW.id,
    'status', NEW.status,
    'reserved_for_date', NEW.reserved_for_date
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reservation_change_trigger
  AFTER INSERT OR UPDATE ON reserved_items
  FOR EACH ROW EXECUTE FUNCTION notify_reservation_change();

-- Station heartbeat
CREATE OR REPLACE FUNCTION notify_station_status()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_online IS DISTINCT FROM NEW.is_online THEN
    PERFORM pg_notify('station_updates', json_build_object(
      'type', 'STATUS_CHANGE',
      'station_id', NEW.id,
      'station_number', NEW.station_number,
      'is_online', NEW.is_online
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER station_status_trigger
  AFTER UPDATE ON stations
  FOR EACH ROW EXECUTE FUNCTION notify_station_status();
```

### Migration 011: Seed Data

```sql
-- 011_seed_data.sql
-- Initial data for development and testing

-- Insert default stations
INSERT INTO stations (station_number, name, type) VALUES
  (1, 'עמדת אריזה 1', 'packing'),
  (2, 'עמדת אריזה 2', 'packing'),
  (3, 'עמדת איסוף', 'pickup'),
  (4, 'עמדת מנהל', 'manager');

-- Insert sample menu items
INSERT INTO menu (dish_name, dish_name_normalized, category, price_per_unit, unit_type, unit_label, available) VALUES
  ('עוף בטעם תימני', 'עוףבטעםתימני', 'עיקריות', 85.00, 'kg', 'ק"ג', true),
  ('אורז אדום', 'אורזאדום', 'תוספות', 45.00, 'kg', 'ק"ג', true),
  ('סלט ירקות', 'סלטירקות', 'סלטים', 35.00, 'kg', 'ק"ג', true),
  ('חומוס', 'חומוס', 'סלטים', 40.00, 'kg', 'ק"ג', true),
  ('קובה במיה', 'קובהבמיה', 'עיקריות', 75.00, 'kg', 'ק"ג', true),
  ('מרק תימני', 'מרקתימני', 'עיקריות', 30.00, 'portion', 'מנה', true),
  ('מלווח', 'מלווח', 'תוספות', 15.00, 'unit', 'יחידה', true),
  ('עוגת שוקולד', 'עוגתשוקולד', 'קינוחים', 55.00, 'kg', 'ק"ג', true);

-- Comments
COMMENT ON TABLE menu IS 'Sample menu for development - replace with real data in production';
```

## Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    stations     │       │    customers    │       │      menu       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ station_number  │       │ phone (unique)  │       │ dish_name       │
│ name            │       │ name            │       │ dish_name_norm  │
│ type            │       │ total_orders    │       │ category        │
│ is_online       │       │ no_shows        │       │ price_per_unit  │
│ last_seen_at    │       │ blacklisted     │       │ unit_type       │
│ device_info     │       │ hitl_required*  │       │ available       │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         │    ┌────────────────────┴──────────────┐         │
         │    │                                    │         │
         │    ▼                                    │         │
         │  ┌─────────────────┐                   │         │
         │  │     orders      │                   │         │
         │  ├─────────────────┤                   │         │
         │  │ id (PK)         │                   │         │
         │  │ order_number    │                   │         │
         │  │ customer_id (FK)├───────────────────┘         │
         │  │ status          │                             │
         │  │ hitl_required   │                             │
         │  │ packed_by (FK)  ├─────────────────────────────┤
         │  │ payment_*       │                             │
         │  │ timestamps      │                             │
         │  └────────┬────────┘                             │
         │           │                                       │
         │           │  ┌───────────────────────────────────┘
         │           │  │
         │           ▼  ▼
         │  ┌─────────────────┐       ┌─────────────────┐
         │  │  order_items    │       │ daily_inventory │
         │  ├─────────────────┤       ├─────────────────┤
         │  │ id (PK)         │       │ id (PK)         │
         │  │ order_id (FK)   │       │ dish_id (FK)    │
         │  │ dish_id (FK)    │       │ inventory_date  │
         │  │ requested_qty   │       │ prepared_qty    │
         │  │ final_qty       │       │ ordered_qty     │
         │  │ price_per_unit  │       │ available_qty*  │
         │  └─────────────────┘       └─────────────────┘
         │
         │  ┌─────────────────┐       ┌─────────────────┐
         │  │order_status_hist│       │ reserved_items  │
         │  ├─────────────────┤       ├─────────────────┤
         │  │ id (PK)         │       │ id (PK)         │
         │  │ order_id (FK)   │       │ customer_id (FK)│
         │  │ from_status     │       │ dish_id (FK)    │
         │  │ to_status       │       │ quantity        │
         └──┤ station_id (FK) │       │ status          │
            │ source          │       │ collected_by(FK)│
            └─────────────────┘       └─────────────────┘

         ┌─────────────────┐
         │   error_log     │
         ├─────────────────┤
         │ id (PK)         │
         │ source          │
         │ error_type      │
         │ severity        │
         │ order_id (FK)   │
         │ station_id (FK) │
         │ resolved        │
         └─────────────────┘

* = Generated/Computed column
```

---

# 6. API Contracts

## Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://kitchenos.vercel.app/api`

## Authentication
All API requests (except webhooks) require a station token:
```
Headers:
  x-station-id: {station-uuid}
  x-station-token: {station-token}  // Future: JWT
```

Webhooks use HMAC signatures:
```
Headers:
  x-webhook-signature: {hmac-sha256-signature}
  x-webhook-timestamp: {unix-timestamp-ms}
```

---

## Orders API

### `GET /api/orders`
List orders with filters

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (comma-separated) |
| `source` | string | Filter by source: `bot`, `phone`, `walk_in` |
| `date` | string | Filter by pickup date (YYYY-MM-DD) |
| `hitl` | boolean | Filter HITL-required orders |
| `limit` | number | Max results (default: 50) |
| `offset` | number | Pagination offset |

**Response:**
```typescript
{
  success: true,
  data: {
    orders: Order[],
    total: number,
    hasMore: boolean
  }
}

interface Order {
  id: string;
  order_number: number;
  customer: {
    id: string;
    phone: string;
    name: string | null;
  };
  items: OrderItem[];
  status: OrderStatus;
  estimated_total: number;
  final_total: number | null;
  pickup_time: string | null;
  hitl_required: boolean;
  source: 'bot' | 'phone' | 'walk_in' | 'reserved';
  created_at: string;
  updated_at: string;
}
```

---

### `POST /api/orders`
Create a new order (called by n8n or Manual Entry screen)

**Request:**
```typescript
{
  customer_phone: string;           // Required
  items: {
    dish_name: string;              // Will be fuzzy-matched
    requested_qty: number;
  }[];
  pickup_time?: string;             // ISO datetime
  notes?: string;
  source: 'bot' | 'phone' | 'walk_in';
  is_reserve_request?: boolean;
  skip_hitl_check?: boolean;        // For staff-created orders
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    order: Order,
    hitl_required: boolean,
    stock_warnings: {
      dish_name: string;
      requested: number;
      available: number;
      status: 'ok' | 'low' | 'out_of_stock';
    }[]
  }
}
```

**Error Codes:**
| Code | Description |
|------|-------------|
| `CUSTOMER_BLACKLISTED` | Customer is blacklisted |
| `OUT_OF_STOCK` | One or more items unavailable |
| `INVALID_DISH` | Dish name not found |
| `INVALID_QUANTITY` | Quantity below minimum |

---

### `GET /api/orders/:id`
Get order details

**Response:**
```typescript
{
  success: true,
  data: {
    order: Order,
    items: OrderItem[],
    customer: Customer,
    status_history: StatusHistoryEntry[]
  }
}
```

---

### `PATCH /api/orders/:id`
Update order (status, weights, etc.)

**Request:**
```typescript
{
  action: 'start_packing' | 'complete_packing' | 'send_payment' |
          'mark_paid_cash' | 'mark_collected' | 'mark_no_show' |
          'cancel' | 'approve_hitl' | 'reject_hitl';

  // For complete_packing:
  items?: {
    id: string;
    final_qty: number;
    final_price: number;
  }[];

  // For reject_hitl:
  rejection_reason?: string;

  // Attribution
  station_id: string;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    order: Order,
    payment_url?: string,  // For send_payment action
    notification_sent?: boolean
  }
}
```

---

## Customers API

### `POST /api/customers/check`
Check customer status (called by n8n before order creation)

**Request:**
```typescript
{
  phone: string;
  order_total?: number;     // For large order detection
  items_count?: number;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    customer: Customer | null,
    exists: boolean,
    action: 'auto_approve' | 'require_hitl' | 'reject',
    reason?: string,
    risk_score: number,
    risk_factors: {
      no_shows: number,
      is_new_customer: boolean,
      is_large_order: boolean
    }
  }
}
```

---

## Inventory API

### `GET /api/inventory`
Get today's inventory

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `date` | string | Inventory date (default: today) |
| `category` | string | Filter by menu category |

**Response:**
```typescript
{
  success: true,
  data: {
    date: string,
    items: {
      dish_id: string,
      dish_name: string,
      category: string,
      price_per_unit: number,
      unit_type: string,
      prepared_qty: number,
      ordered_qty: number,
      available_qty: number,
      status: 'available' | 'low' | 'out_of_stock'
    }[],
    stats: {
      total_dishes: number,
      available: number,
      low_stock: number,
      out_of_stock: number
    }
  }
}
```

---

# 7. Security Model

## Webhook Authentication

```typescript
// lib/security/webhook-auth.ts

import crypto from 'crypto';

interface WebhookVerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * Verify n8n webhook signature
 * n8n sends: x-n8n-signature (HMAC-SHA256 of timestamp:body)
 */
export function verifyN8nWebhook(
  body: string,
  signature: string | null,
  timestamp: string | null
): WebhookVerificationResult {
  const secret = process.env.N8N_WEBHOOK_SECRET;

  if (!secret) {
    return { valid: false, error: 'N8N_WEBHOOK_SECRET not configured' };
  }

  if (!signature || !timestamp) {
    return { valid: false, error: 'Missing signature or timestamp' };
  }

  // Prevent replay attacks (5 minute window)
  const timestampMs = parseInt(timestamp);
  const now = Date.now();
  if (Math.abs(now - timestampMs) > 5 * 60 * 1000) {
    return { valid: false, error: 'Timestamp too old' };
  }

  // Compute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}:${body}`)
    .digest('hex');

  // Timing-safe comparison
  const valid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  return { valid, error: valid ? undefined : 'Invalid signature' };
}

/**
 * Verify Meshulam payment webhook
 */
export function verifyMeshulamWebhook(payload: any): WebhookVerificationResult {
  const secret = process.env.MESHULAM_WEBHOOK_SECRET;

  if (!secret) {
    return { valid: false, error: 'MESHULAM_WEBHOOK_SECRET not configured' };
  }

  const { signature, ...data } = payload;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(data))
    .digest('hex');

  const valid = signature === expectedSignature;

  return { valid, error: valid ? undefined : 'Invalid signature' };
}
```

---

# 8. Offline Resilience

## Overview
Tablets must function when network is temporarily unavailable. All mutations are queued locally and synced when connection is restored.

## Implementation Strategy

```typescript
// lib/offline/mutation-queue.ts

interface QueuedMutation {
  id: string;
  type: 'ORDER_UPDATE' | 'INVENTORY_UPDATE' | 'CUSTOMER_UPDATE';
  entityId: string;
  payload: any;
  timestamp: number;
  retryCount: number;
  stationId: string;
}

class MutationQueue {
  private queue: QueuedMutation[] = [];
  private processing = false;

  constructor() {
    // Load queue from localStorage on init
    this.loadQueue();

    // Listen for online event
    window.addEventListener('online', () => this.processQueue());
  }

  /**
   * Add mutation to queue
   */
  enqueue(mutation: Omit<QueuedMutation, 'id' | 'timestamp' | 'retryCount'>) {
    const queuedMutation: QueuedMutation = {
      ...mutation,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(queuedMutation);
    this.saveQueue();

    // Try to process immediately if online
    if (navigator.onLine) {
      this.processQueue();
    }
  }

  /**
   * Process queued mutations
   */
  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const mutation = this.queue[0];

      try {
        const result = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mutation),
        });

        if (result.ok) {
          // Success - remove from queue
          this.queue.shift();
          this.saveQueue();
        } else if (result.status === 409) {
          // Conflict - server state different, skip this mutation
          console.warn('Sync conflict, skipping mutation:', mutation);
          this.queue.shift();
          this.saveQueue();
        } else {
          // Retry later
          mutation.retryCount++;
          if (mutation.retryCount > 5) {
            // Give up after 5 retries
            console.error('Max retries exceeded for mutation:', mutation);
            this.queue.shift();
          }
          this.saveQueue();
          break;
        }
      } catch (error) {
        // Network error - stop processing
        console.error('Sync error:', error);
        break;
      }
    }

    this.processing = false;
  }

  private saveQueue() {
    localStorage.setItem('mutation-queue', JSON.stringify(this.queue));
  }

  private loadQueue() {
    const saved = localStorage.getItem('mutation-queue');
    if (saved) {
      this.queue = JSON.parse(saved);
    }
  }
}

export const mutationQueue = new MutationQueue();
```

---

# 9. Real-time Subscriptions

## Supabase Realtime Channels

```typescript
// lib/realtime/subscriptions.ts

import { createClient } from '@/lib/supabase/client';

export function subscribeToOrders(callback: (order: any) => void) {
  const supabase = createClient();

  return supabase
    .channel('order_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}

export function subscribeToInventory(callback: (inventory: any) => void) {
  const supabase = createClient();

  return supabase
    .channel('inventory_updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_inventory',
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();
}
```

---

# 10. Project Folder Structure

```
kitchenos/
├── app/
│   ├── (kds)/                          # Kitchen Display System layout group
│   │   ├── layout.tsx                  # KDS shared layout (nav, header)
│   │   ├── page.tsx                    # Orders Dashboard (/)
│   │   ├── orders/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx            # Packing Screen
│   │   │   └── new/
│   │   │       └── page.tsx            # Manual Order Entry
│   │   ├── inventory/
│   │   │   └── page.tsx                # Inventory Management
│   │   ├── pickup/
│   │   │   └── page.tsx                # Pickup Queue
│   │   ├── reservations/
│   │   │   └── page.tsx                # Reserved Items (שמור לי)
│   │   └── approvals/
│   │       └── page.tsx                # Risk Approvals (HITL)
│   ├── (admin)/                        # Admin layout group
│   │   ├── layout.tsx                  # Admin shared layout
│   │   ├── menu/
│   │   │   └── page.tsx                # Menu Management
│   │   ├── customers/
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Customer Details
│   │   ├── analytics/
│   │   │   └── page.tsx                # Analytics Dashboard (Phase 2)
│   │   └── settings/
│   │       └── page.tsx                # Settings (Phase 2)
│   ├── api/
│   │   ├── orders/
│   │   │   ├── route.ts                # GET /api/orders, POST /api/orders
│   │   │   └── [id]/
│   │   │       └── route.ts            # GET, PATCH, DELETE /api/orders/:id
│   │   ├── customers/
│   │   │   ├── check/
│   │   │   │   └── route.ts            # POST /api/customers/check
│   │   │   └── [id]/
│   │   │       └── route.ts            # GET, PATCH /api/customers/:id
│   │   ├── inventory/
│   │   │   ├── route.ts                # GET, POST /api/inventory
│   │   │   ├── check/
│   │   │   │   └── route.ts            # POST /api/inventory/check
│   │   │   ├── reserve/
│   │   │   │   └── route.ts            # POST /api/inventory/reserve
│   │   │   └── release/
│   │   │       └── route.ts            # POST /api/inventory/release
│   │   ├── menu/
│   │   │   ├── route.ts                # GET, POST /api/menu
│   │   │   └── [id]/
│   │   │       └── route.ts            # PATCH, DELETE /api/menu/:id
│   │   ├── reservations/
│   │   │   ├── route.ts                # GET, POST /api/reservations
│   │   │   └── [id]/
│   │   │       └── route.ts            # PATCH /api/reservations/:id
│   │   ├── stations/
│   │   │   └── route.ts                # GET, POST /api/stations
│   │   ├── sync/
│   │   │   └── route.ts                # POST /api/sync
│   │   └── webhooks/
│   │       ├── n8n/
│   │       │   └── route.ts            # POST /api/webhooks/n8n
│   │       ├── payment/
│   │       │   └── route.ts            # POST /api/webhooks/payment
│   │       └── hitl/
│   │           └── route.ts            # POST /api/webhooks/hitl
│   ├── layout.tsx                      # Root layout (RTL, fonts)
│   └── globals.css                     # Global styles
├── components/
│   ├── ui/                             # Shadcn/ui components (customized)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── kds/                            # KDS-specific components
│   │   ├── OrderCard.tsx               # Order display card
│   │   ├── PackingItemRow.tsx          # Item in packing screen
│   │   ├── InventoryRow.tsx            # Inventory item row
│   │   ├── ReservationCard.tsx         # Reservation display
│   │   ├── ApprovalCard.tsx            # HITL approval card
│   │   ├── ConnectionStatus.tsx        # Online/offline indicator
│   │   ├── StationHeader.tsx           # KDS header with station info
│   │   └── BottomNav.tsx               # KDS bottom navigation
│   └── admin/                          # Admin-specific components
│       ├── MenuItemForm.tsx            # Menu item CRUD form
│       ├── CustomerHistory.tsx         # Customer order history
│       └── AnalyticsChart.tsx          # Analytics charts (Phase 2)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Browser Supabase client
│   │   ├── server.ts                   # Server Supabase client
│   │   ├── admin.ts                    # Admin Supabase client
│   │   └── types.ts                    # Generated TypeScript types
│   ├── security/
│   │   ├── webhook-auth.ts             # Webhook signature verification
│   │   └── rate-limit.ts               # Rate limiting
│   ├── offline/
│   │   └── mutation-queue.ts           # Offline mutation queue
│   ├── realtime/
│   │   └── subscriptions.ts            # Realtime channel subscriptions
│   ├── api/
│   │   ├── orders.ts                   # Order API client functions
│   │   ├── customers.ts                # Customer API client functions
│   │   ├── inventory.ts                # Inventory API client functions
│   │   └── menu.ts                     # Menu API client functions
│   ├── hooks/
│   │   ├── useOrders.ts                # React Query hook for orders
│   │   ├── useInventory.ts             # React Query hook for inventory
│   │   ├── useReservations.ts          # React Query hook for reservations
│   │   └── useStation.ts               # Station context hook
│   ├── stores/
│   │   ├── offline-store.ts            # Zustand store for offline queue
│   │   └── station-store.ts            # Zustand store for station state
│   └── utils.ts                        # Utility functions (cn, etc.)
├── supabase/
│   └── migrations/
│       ├── 001_menu.sql
│       ├── 002_stations.sql
│       ├── 003_customers.sql
│       ├── 004_orders.sql
│       ├── 005_order_items.sql
│       ├── 006_order_status_history.sql
│       ├── 007_daily_inventory.sql
│       ├── 008_reserved_items.sql
│       ├── 009_error_log.sql
│       ├── 010_realtime_triggers.sql
│       └── 011_seed_data.sql
├── public/
│   ├── sounds/
│   │   └── new-order.mp3              # Notification sound
│   └── images/
│       └── logo.png
├── .claude/
│   ├── workflows/
│   │   ├── project.md                  # Project workflow
│   │   └── README.md                   # Workflow usage
│   └── commands/
│       ├── feature.md
│       ├── component.md
│       ├── migrate.md
│       ├── review.md
│       ├── fix.md
│       └── deploy.md
├── .env.local                          # Environment variables
├── .gitignore
├── components.json                     # Shadcn/ui config
├── middleware.ts                       # Next.js middleware
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── PRD.md                              # This document
└── README.md
```

---

# 11. Component Library

## Design System Overview

### Colors (Tailwind)
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Status colors
        status: {
          pending: 'rgb(156 163 175)',      // gray-400
          awaiting: 'rgb(251 191 36)',      // amber-400
          approved: 'rgb(34 197 94)',       // green-500
          packing: 'rgb(59 130 246)',       // blue-500
          ready: 'rgb(34 197 94)',          // green-500
          paid: 'rgb(34 197 94)',           // green-500
          completed: 'rgb(107 114 128)',    // gray-500
          cancelled: 'rgb(239 68 68)',      // red-500
          blacklisted: 'rgb(127 29 29)',    // red-900
        },
      },
    },
  },
};
```

### Typography
- **Geist Sans**: Primary font (already configured)
- **Geist Mono**: Monospace for order numbers

### Touch-Optimized Components

```typescript
// components/ui/touch-button.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TouchButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        'h-14 min-w-[48px] text-lg rounded-2xl',  // Touch-friendly
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
```

---

# 12. Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# n8n
N8N_WEBHOOK_URL=https://n8n.example.com/webhook/xxx
N8N_WEBHOOK_SECRET=xxx

# Meshulam
MESHULAM_API_KEY=xxx
MESHULAM_WEBHOOK_SECRET=xxx
MESHULAM_PAGE_CODE=xxx

# Telegram HITL Bot
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx

# App
NEXT_PUBLIC_APP_URL=https://kitchenos.vercel.app
NODE_ENV=production

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

---

# 13. Sprint Plan

## Sprint 0: Setup (1 week)
- [x] Initialize Next.js 16 project
- [x] Configure Tailwind CSS 4
- [x] Set up Supabase project
- [x] Run database migrations (001-011)
- [ ] Configure Shadcn/ui components
- [ ] Set up environment variables
- [ ] Deploy to Vercel (dev environment)

## Sprint 1: Core Infrastructure (2 weeks)

### Week 1: Foundation
- [ ] Implement Supabase client utilities
- [ ] Create station authentication system
- [ ] Build offline mutation queue
- [ ] Set up React Query + Zustand
- [ ] Implement webhook authentication
- [ ] Create KDS layout components (header, nav)

### Week 2: Realtime & API
- [ ] Implement Supabase Realtime subscriptions
- [ ] Build API routes: orders CRUD
- [ ] Build API routes: customers check
- [ ] Build API routes: inventory
- [ ] Create connection status indicator
- [ ] Add sound notifications

## Sprint 2: Orders & Packing (2 weeks)

### Week 1: Orders Dashboard
- [ ] Orders Dashboard screen (/)
- [ ] OrderCard component with status badges
- [ ] Filter by status/date
- [ ] Real-time order updates
- [ ] Pull-to-refresh gesture

### Week 2: Packing Screen
- [ ] Packing screen (/orders/[id])
- [ ] PackingItemRow with weight input
- [ ] Price calculation logic
- [ ] Payment link generation (Meshulam API)
- [ ] Status updates (packing → ready → paid)

## Sprint 3: Inventory & Pickup (2 weeks)

### Week 1: Inventory Management
- [ ] Inventory screen (/inventory)
- [ ] Set daily quantities
- [ ] Real-time availability updates
- [ ] Stock reservation logic
- [ ] Low stock warnings

### Week 2: Pickup Queue
- [ ] Pickup Queue screen (/pickup)
- [ ] Payment status tracking
- [ ] Mark as collected
- [ ] No-show handling
- [ ] Customer stats update

## Sprint 4: HITL & Reservations (1 week)
- [ ] Risk Approvals screen (/approvals)
- [ ] ApprovalCard with customer history
- [ ] Approve/reject actions
- [ ] Blacklist management
- [ ] Reservations screen (/reservations)
- [ ] Swipe-to-collect gesture

## Sprint 5: Manual Entry & Menu (1 week)
- [ ] Manual Order Entry screen (/orders/new)
- [ ] Dish search/autocomplete
- [ ] Customer lookup
- [ ] Menu Management screen (/menu)
- [ ] MenuItemForm (CRUD)

## Sprint 6: Testing & Polish (1 week)
- [ ] End-to-end testing
- [ ] Offline mode testing
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Production deployment
- [ ] Staff training materials

---

# 14. Pre-Development Checklist

## Prerequisites
- [ ] Supabase project created
- [ ] Vercel account set up
- [ ] Meshulam account + API credentials
- [ ] Telegram bot created (for HITL)
- [ ] n8n instance set up (self-hosted or cloud)
- [ ] Wassenger account + WhatsApp number

## Database
- [ ] All 11 migrations run successfully
- [ ] Seed data inserted
- [ ] RLS policies configured (Phase 2)
- [ ] Realtime enabled on tables

## External Services
- [ ] n8n workflows created:
  - [ ] WhatsApp order intake
  - [ ] Customer risk check
  - [ ] Payment link generation
  - [ ] HITL Telegram notification
- [ ] Meshulam webhook configured
- [ ] Telegram bot webhook configured

## Development Environment
- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] .env.local populated
- [ ] Dependencies installed (`npm install`)
- [ ] Development server runs (`npm run dev`)

## Deployment
- [ ] Vercel project linked
- [ ] Environment variables in Vercel
- [ ] Custom domain configured (optional)
- [ ] Preview deployments enabled

---

## Success Metrics

### Key Performance Indicators (KPIs)
1. **Order Accuracy**: >95% correct first-time
2. **HITL Precision**: <10% false positives on risky customers
3. **No-Show Rate**: <5% overall
4. **Average Order Time**: <8 minutes from order to ready
5. **Station Uptime**: >99.5%
6. **Offline Sync Success**: >98% mutations synced without conflicts

### Business Metrics
- Orders per day (target growth)
- Revenue per hour
- Customer retention rate
- Staff efficiency (orders/hour per station)

---

**Document Owner**: Product Team
**Technical Lead**: [TBD]
**Last Review**: December 12, 2024
