# Story 1.4: Create Orders Database Schema and Manual Order Entry API

Status: ready-for-dev

## Story

As a developer,
I want to create the orders database schema and API endpoints,
So that orders can be stored and retrieved from the system.

## Acceptance Criteria

**Given** the dishes table exists (from Story 1.2)
**When** database migration is executed
**Then** an `orders` table exists with columns:
- `id` (UUID, primary key)
- `order_number` (SERIAL, unique, not null) - auto-incrementing display number
- `customer_name` (TEXT, not null)
- `customer_phone` (TEXT, nullable) - WhatsApp number format
- `pickup_time` (TIMESTAMP, not null)
- `status` (ENUM: 'created', 'packing', 'ready', 'collected', 'cancelled', default 'created')
- `source` (ENUM: 'whatsapp', 'manual', 'email', 'phone', not null)
- `notes` (TEXT, nullable)
- `created_at` (TIMESTAMP, not null)
- `updated_at` (TIMESTAMP, not null)

**And** an `order_items` table exists with columns:
- `id` (UUID, primary key)
- `order_id` (UUID, foreign key → orders.id, ON DELETE CASCADE)
- `dish_id` (UUID, foreign key → dishes.id)
- `quantity` (INTEGER, not null) - for unit-based items
- `created_at` (TIMESTAMP)

**And** API route `/api/orders` supports POST (create order with items)
**And** API route `/api/orders` supports GET (list orders with filters: status, date)
**And** API route `/api/orders/[id]` supports GET (single order with items joined)
**And** creating an order auto-assigns sequential `order_number`
**And** RLS policies are configured

## Tasks / Subtasks

### Task 1: Create Supabase Migration File for Orders Tables (AC: 1-5)
- [ ] Create migration file: `supabase/migrations/002_create_orders_tables.sql`
- [ ] Create ENUM types first:
  - `CREATE TYPE order_status AS ENUM ('created', 'packing', 'ready', 'collected', 'cancelled', 'no_show');`
  - `CREATE TYPE order_source AS ENUM ('whatsapp', 'manual', 'email', 'phone');`
- [ ] Create `orders` table with all required columns
- [ ] Add `order_number` as SERIAL (auto-incrementing, global unique sequence)
- [ ] Add primary key constraint on `id`
- [ ] Add UNIQUE constraint on `order_number`
- [ ] Add NOT NULL constraints on required fields
- [ ] Add CHECK constraint: `pickup_time > created_at` (future pickup times only)
- [ ] Add indexes:
  - `CREATE INDEX idx_orders_status ON orders(status);`
  - `CREATE INDEX idx_orders_pickup_time ON orders(pickup_time);`
  - `CREATE INDEX idx_orders_order_number ON orders(order_number);`
- [ ] Add automatic timestamps using triggers or defaults

### Task 2: Create Order Items Table (AC: 5)
- [ ] Create `order_items` table in same migration
- [ ] Add foreign key: `order_id` → `orders.id` with ON DELETE CASCADE
- [ ] Add foreign key: `dish_id` → `dishes.id`
- [ ] Add CHECK constraint: `quantity > 0`
- [ ] Add index on `order_id` for efficient joins
- [ ] Add created_at timestamp

### Task 3: Configure RLS Policies (AC: 6)
- [ ] Enable Row Level Security on `orders` table
- [ ] Enable Row Level Security on `order_items` table
- [ ] Create policy: Allow SELECT for all users (for TV dashboard read access)
- [ ] Create policy: Allow INSERT/UPDATE/DELETE for service role (API routes)
- [ ] Test policies with Supabase dashboard

### Task 4: Generate TypeScript Types (AC: All)
- [ ] Run Supabase CLI to generate types: `npx supabase gen types typescript --local > lib/types/supabase.ts`
- [ ] Verify `Database` type includes `orders` and `order_items` tables
- [ ] Create convenience types in `lib/types/database.ts`:
  - `export type Order = Database['public']['Tables']['orders']['Row']`
  - `export type OrderInsert = Database['public']['Tables']['orders']['Insert']`
  - `export type OrderUpdate = Database['public']['Tables']['orders']['Update']`
  - `export type OrderItem = Database['public']['Tables']['order_items']['Row']`
  - `export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']`

### Task 5: Create Zod Validation Schemas (AC: All)
- [ ] Create file: `lib/validation/schemas/order-schema.ts`
- [ ] Define `createOrderSchema` with validation rules:
  - `customer_name`: string, min 2 characters, max 100 characters
  - `customer_phone`: string, optional, regex `/^05\d{8}$/` (Israeli phone format)
  - `pickup_time`: date, must be future time
  - `source`: enum ('whatsapp', 'manual', 'email', 'phone')
  - `notes`: string, optional, max 500 characters
  - `items`: array of objects (dish_id UUID, quantity positive integer), min 1 item
- [ ] Define `updateOrderSchema` for PATCH operations (partial schema)
- [ ] Export schemas for use in API routes

### Task 6: Create POST /api/orders Endpoint (AC: 6)
- [ ] Create file: `app/api/orders/route.ts`
- [ ] Implement `POST` handler:
  - Use `createClient()` from `@/lib/supabase/server` (async function)
  - Parse request body: `const body = await req.json()`
  - Validate with Zod: `const result = createOrderSchema.safeParse(body)`
  - Start database transaction
  - Insert order into `orders` table (auto-generates `order_number`)
  - Insert items into `order_items` table
  - Commit transaction
  - Return created order with items with 201 status
  - Handle validation errors (400) and database errors (500)
- [ ] Use English error codes (e.g., `VALIDATION_ERROR`, `DATABASE_ERROR`)

### Task 7: Create GET /api/orders Endpoint (AC: 7)
- [ ] Implement `GET` handler in `app/api/orders/route.ts`:
  - Parse query parameters: `status`, `date`, `limit`, `offset`
  - Build dynamic query with filters
  - Query: `SELECT * FROM orders WHERE ... ORDER BY pickup_time ASC`
  - Add pagination support (limit/offset from Story 1.2 learnings)
  - Return `NextResponse.json({ data: orders, count: total })` with 200 status
  - Handle errors with proper status codes (500)

### Task 8: Create GET /api/orders/[id] Endpoint (AC: 8)
- [ ] Create file: `app/api/orders/[id]/route.ts`
- [ ] Implement `GET` handler:
  - Extract and validate `id` parameter (UUID validation from Story 1.2 learnings)
  - Query order with items joined:
    ```sql
    SELECT orders.*,
           json_agg(order_items.*) as items
    FROM orders
    LEFT JOIN order_items ON order_items.order_id = orders.id
    WHERE orders.id = $1
    GROUP BY orders.id
    ```
  - Return single order with nested items array with 200 status
  - Handle not found (404), validation errors (400), database errors (500)

### Task 9: Test API Endpoints (AC: All)
- [ ] Test POST `/api/orders` creates order with auto-generated order_number
- [ ] Test POST `/api/orders` creates order_items correctly
- [ ] Test POST `/api/orders` validates required fields
- [ ] Test POST `/api/orders` validates future pickup_time
- [ ] Test POST `/api/orders` validates Israeli phone format
- [ ] Test POST `/api/orders` requires at least one item
- [ ] Test GET `/api/orders` returns filtered orders by status
- [ ] Test GET `/api/orders` returns filtered orders by date
- [ ] Test GET `/api/orders` pagination works correctly
- [ ] Test GET `/api/orders/[id]` returns order with items joined
- [ ] Test GET `/api/orders/[id]` returns 404 for non-existent order
- [ ] Verify all status codes are correct (200, 201, 400, 404, 500)

## Dev Notes

### Critical Context from Previous Stories

**From Story 1.2 (Menu Database Schema):**
- ✅ Established pattern: Supabase migrations in `supabase/migrations/`
- ✅ Naming convention: `001_create_dishes_table.sql` → use `002_create_orders_tables.sql`
- ✅ TypeScript types location: `lib/types/supabase.ts` (auto-generated)
- ✅ Convenience types pattern: `lib/types/database.ts` for manual type exports
- ✅ Validation schemas location: `lib/validation/schemas/`
- ✅ API route pattern: Use `createClient()` from `@/lib/supabase/server` (async)
- ✅ Error handling: English codes (`VALIDATION_ERROR`, `DATABASE_ERROR`, `NOT_FOUND`)
- ✅ Response format: `{ data: ... }` for success, `{ error: { code, message, details } }` for errors

**From Story 1.2 Code Review Improvements:**
- ✅ UUID validation required for route parameters (prevents SQL injection)
- ✅ Pagination support for GET endpoints (limit/offset query params)
- ✅ Sanitize error messages in production (no stack traces to client)
- ✅ Discriminate database error types (23505 unique violation, 23514 constraint violation)
- ✅ Standardized response format across all endpoints

**Files Created in Story 1.2:**
- `supabase/migrations/001_create_dishes_table.sql`
- `lib/types/supabase.ts`
- `lib/validation/schemas/dish-schema.ts`
- `app/api/menu/route.ts` (GET, POST)
- `app/api/menu/[id]/route.ts` (PATCH, DELETE)
- `lib/env.ts` (environment validation)

### Database Schema Requirements

**Migration File: `002_create_orders_tables.sql`**

```sql
-- Migration: 002_create_orders_tables.sql
-- Description: Create orders and order_items tables for order management
-- Dependencies: 001_create_dishes_table.sql (dishes table must exist)

-- Create ENUM types for order management
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

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT, -- Nullable - manual/email orders may not have phone
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status order_status NOT NULL DEFAULT 'created',
  source order_source NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Constraints
  CONSTRAINT pickup_time_future CHECK (pickup_time > created_at),
  CONSTRAINT customer_name_not_empty CHECK (length(trim(customer_name)) > 0),
  CONSTRAINT customer_phone_format CHECK (
    customer_phone IS NULL OR customer_phone ~ '^05\d{8}$'
  )
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  dish_id UUID NOT NULL REFERENCES dishes(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for efficient queries
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_pickup_time ON orders(pickup_time);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_dish_id ON order_items(dish_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all users to read orders (for TV dashboard)
CREATE POLICY "Allow public read access to orders"
  ON orders FOR SELECT
  USING (true);

-- RLS Policy: Allow all users to read order items
CREATE POLICY "Allow public read access to order_items"
  ON order_items FOR SELECT
  USING (true);

-- RLS Policy: Allow authenticated users to manage orders
CREATE POLICY "Allow authenticated users to manage orders"
  ON orders FOR ALL
  USING (auth.role() = 'authenticated');

-- RLS Policy: Allow authenticated users to manage order items
CREATE POLICY "Allow authenticated users to manage order_items"
  ON order_items FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at timestamp on orders
CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- Note: trigger_set_updated_at() function should exist from previous migrations
-- If not, create it:
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Key Schema Decisions:**

1. **`order_number` as SERIAL:**
   - Auto-incrementing integer for display to customers
   - Globally unique, never resets
   - Separate from UUID `id` for internal references
   - Indexed for fast lookups

2. **`pickup_time` NOT NULL:**
   - Critical business requirement: cannot pack without knowing pickup time
   - Must be future time (CHECK constraint)
   - TIMESTAMP WITH TIME ZONE for proper date handling

3. **`customer_phone` Nullable:**
   - WhatsApp orders have phone numbers
   - Manual entry for email/phone orders may not capture phone
   - When present, must match Israeli format: `05\d{8}`

4. **`status` ENUM:**
   - Includes `no_show` for future automated detection (Epic 4)
   - Default is `created` for new orders
   - Will drive Kanban column display in Story 1.6

5. **`source` ENUM:**
   - Tracks order origin for analytics
   - Required field - every order must have a source

6. **Foreign Keys with CASCADE:**
   - `order_items.order_id` → `orders.id` ON DELETE CASCADE
   - Deleting an order automatically deletes its items
   - Referential integrity maintained

### Naming Conventions (CRITICAL - From project_context.md)

**Database Level:**
- ✅ Tables: `snake_case`, plural (`orders`, `order_items`)
- ✅ Columns: `snake_case` (`customer_name`, `pickup_time`, `order_number`)
- ✅ ENUM types: `snake_case` (`order_status`, `order_source`)
- ✅ Indexes: `idx_{table}_{column(s)}` (`idx_orders_status`, `idx_order_items_order_id`)
- ✅ Foreign keys: `{referenced_table}_id` (`order_id`, `dish_id`)

**TypeScript Level:**
- ✅ Interfaces/Types: `PascalCase` (`Order`, `OrderInsert`, `OrderItem`)
- ✅ Files: `kebab-case` (`order-schema.ts`, `order-service.ts`)
- ✅ Component files: `PascalCase` (`OrderCard.tsx`)

**API Level:**
- ✅ Endpoints: `kebab-case` (`/api/orders`, `/api/orders/[id]`)
- ✅ Query parameters: `snake_case` (matches database: `?status=created&pickup_time=...`)

### API Implementation Patterns

**POST /api/orders - Transaction Pattern:**

```typescript
// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createOrderSchema } from '@/lib/validation/schemas/order-schema'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  const supabase = await createClient() // Async server client

  try {
    // Parse and validate request body
    const body = await req.json()
    const result = createOrderSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid order data',
            details: result.error.issues
          }
        },
        { status: 400 }
      )
    }

    const { customer_name, customer_phone, pickup_time, source, notes, items } = result.data

    // Insert order (order_number auto-generated by SERIAL)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        pickup_time,
        source,
        notes,
        status: 'created'
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create order' } },
        { status: 500 }
      )
    }

    // Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      dish_id: item.dish_id,
      quantity: item.quantity
    }))

    const { data: createdItems, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select()

    if (itemsError) {
      // Rollback order if items fail (or rely on CASCADE DELETE)
      await supabase.from('orders').delete().eq('id', order.id)
      console.error('Order items creation error:', itemsError)
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create order items' } },
        { status: 500 }
      )
    }

    // Return created order with items
    return NextResponse.json(
      {
        data: {
          ...order,
          items: createdItems
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
```

**GET /api/orders - Filtering and Pagination:**

```typescript
export async function GET(req: NextRequest) {
  const supabase = await createClient()

  // Parse query parameters
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const date = searchParams.get('date')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('pickup_time', { ascending: true })
    .range(offset, offset + limit - 1)

  // Apply filters
  if (status) {
    query = query.eq('status', status)
  }

  if (date) {
    // Filter by pickup_time date (ignore time)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    query = query
      .gte('pickup_time', startOfDay.toISOString())
      .lte('pickup_time', endOfDay.toISOString())
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json(
      { error: { code: 'DATABASE_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      data,
      count,
      limit,
      offset
    },
    { status: 200 }
  )
}
```

**GET /api/orders/[id] - Join Pattern:**

```typescript
// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// UUID validation schema (from Story 1.2 learnings)
const uuidSchema = z.string().uuid()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  // Validate UUID parameter
  const result = uuidSchema.safeParse(params.id)
  if (!result.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid order ID format' } },
      { status: 400 }
    )
  }

  // Query order with items joined
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        id,
        dish_id,
        quantity,
        dish:dishes(name, unit_type, price_per_unit)
      )
    `)
    .eq('id', result.data)
    .single()

  if (orderError) {
    if (orderError.code === 'PGRST116') {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Order not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: { code: 'DATABASE_ERROR', message: orderError.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: order }, { status: 200 })
}
```

### Validation Schema Requirements

**File: `lib/validation/schemas/order-schema.ts`**

```typescript
import { z } from 'zod'

// Israeli phone number regex: 05XXXXXXXX (10 digits starting with 05)
const israeliPhoneRegex = /^05\d{8}$/

export const createOrderSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'Customer name must be at least 2 characters')
    .max(100, 'Customer name must be at most 100 characters')
    .transform(val => val.trim()),

  customer_phone: z
    .string()
    .regex(israeliPhoneRegex, 'Phone must be Israeli format: 05XXXXXXXX')
    .optional()
    .nullable(),

  pickup_time: z
    .string()
    .datetime()
    .refine(
      (val) => new Date(val) > new Date(),
      'Pickup time must be in the future'
    ),

  source: z.enum(['whatsapp', 'manual', 'email', 'phone']),

  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
    .nullable(),

  items: z
    .array(
      z.object({
        dish_id: z.string().uuid('Invalid dish ID'),
        quantity: z.number().int().positive('Quantity must be positive')
      })
    )
    .min(1, 'Order must have at least one item')
})

export const updateOrderSchema = createOrderSchema.partial()

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
```

### TypeScript Type Patterns

**Auto-Generated Types (`lib/types/supabase.ts`):**

After running `npx supabase gen types typescript --local > lib/types/supabase.ts`, you'll have:

```typescript
export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          order_number: number
          customer_name: string
          customer_phone: string | null
          pickup_time: string
          status: 'created' | 'packing' | 'ready' | 'collected' | 'cancelled' | 'no_show'
          source: 'whatsapp' | 'manual' | 'email' | 'phone'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: never // Auto-generated by SERIAL
          customer_name: string
          customer_phone?: string | null
          pickup_time: string
          status?: 'created' | 'packing' | 'ready' | 'collected' | 'cancelled' | 'no_show'
          source: 'whatsapp' | 'manual' | 'email' | 'phone'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: never // Cannot update SERIAL
          customer_name?: string
          customer_phone?: string | null
          pickup_time?: string
          status?: 'created' | 'packing' | 'ready' | 'collected' | 'cancelled' | 'no_show'
          source?: 'whatsapp' | 'manual' | 'email' | 'phone'
          notes?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          dish_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          dish_id: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          dish_id?: string
          quantity?: number
        }
      }
    }
  }
}
```

**Convenience Types (`lib/types/database.ts`):**

```typescript
import type { Database } from './supabase'

// Order types
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

// Order Item types
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

// Composite type for order with items
export type OrderWithItems = Order & {
  items: (OrderItem & {
    dish: {
      name: string
      unit_type: 'unit' | 'weight'
      price_per_unit: number
    }
  })[]
}
```

### Architecture Requirements (From architecture.md)

**Multi-Layer Validation (ENFORCED):**
1. ✅ **API Layer**: Zod validation in POST endpoint
2. ✅ **Database Layer**: PostgreSQL constraints (NOT NULL, CHECK, FOREIGN KEY)
3. ✅ **Client Layer**: Will be implemented in Story 1.5a/1.5b (form validation)

**Error Handling (ENFORCED):**
- ✅ Return English error codes: `VALIDATION_ERROR`, `DATABASE_ERROR`, `NOT_FOUND`, `SERVER_ERROR`
- ✅ Client will translate to Hebrew (Stories 1.5a/1.5b)
- ✅ Never return stack traces to client in production
- ✅ Log detailed errors server-side for debugging

**Database Constraints (CRITICAL):**
- ✅ `pickup_time` is NEVER NULL (business requirement - cannot pack without pickup time)
- ✅ `pickup_time` must be future time (CHECK constraint)
- ✅ `order_number` is auto-generated (SERIAL) and unique
- ✅ `items` array must have at least one item (Zod validation + business logic)
- ✅ `customer_phone` format validated when present (CHECK constraint)

**RLS Policies:**
- ✅ Public read access (for TV dashboard in Story 1.6)
- ✅ Authenticated write access (service role for API routes)
- ✅ Future-proofed for multi-tenant scenarios

### Testing Requirements

**Manual Testing (This Story):**
```bash
# Test POST /api/orders - Create order with items
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "David Cohen",
    "customer_phone": "0501234567",
    "pickup_time": "2025-12-20T10:00:00Z",
    "source": "manual",
    "notes": "Extra crispy kubana",
    "items": [
      {"dish_id": "<dish-uuid>", "quantity": 2},
      {"dish_id": "<dish-uuid>", "quantity": 1}
    ]
  }'

# Expected: 201 Created with order data including auto-generated order_number

# Test POST /api/orders - Validation errors
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "A",
    "pickup_time": "2020-01-01T10:00:00Z",
    "items": []
  }'

# Expected: 400 Bad Request with VALIDATION_ERROR

# Test GET /api/orders - List all orders
curl http://localhost:3000/api/orders

# Expected: 200 OK with array of orders

# Test GET /api/orders - Filter by status
curl "http://localhost:3000/api/orders?status=created"

# Expected: 200 OK with filtered orders

# Test GET /api/orders - Pagination
curl "http://localhost:3000/api/orders?limit=10&offset=0"

# Expected: 200 OK with paginated results

# Test GET /api/orders/[id] - Single order with items
curl http://localhost:3000/api/orders/<order-uuid>

# Expected: 200 OK with order and nested items array

# Test GET /api/orders/[id] - Not found
curl http://localhost:3000/api/orders/00000000-0000-0000-0000-000000000000

# Expected: 404 Not Found with NOT_FOUND error code
```

**Automated Testing (Future - Epic 5):**
- Unit tests for validation schemas
- Integration tests for API endpoints
- See `/docs/test-requirements.md` for complete strategy

### Critical Rules from project_context.md

**Supabase Client Usage:**
- ✅ **API Routes**: Use `createClient()` from `@/lib/supabase/server` (async function)
- ❌ **NEVER**: Use browser client (`@/lib/supabase/client`) in API routes

**Database Naming:**
- ✅ **Tables/Columns**: `snake_case` (orders, order_number, customer_name)
- ❌ **NEVER**: Use camelCase in database (orderNumber, customerName)

**API Response Format:**
- ✅ **Success**: `{ data: ... }` with appropriate status code
- ✅ **Error**: `{ error: { code: 'ERROR_CODE', message: '...', details: {...} } }`
- ❌ **NEVER**: Return Hebrew text from API

**Price Handling (Future Stories):**
- Prices will be calculated in Story 3.2 (Add Weight Entry)
- Store as DECIMAL with 2 decimal places
- Round using: `Math.round(price * 100) / 100`

### Integration with Future Stories

**Story 1.3 (Desktop Menu Management UI):**
- Will consume `/api/menu` endpoints to populate dish selector
- Order creation forms will reference `dishes` table

**Story 1.5a/1.5b (Desktop Order Creation Form):**
- Will use POST `/api/orders` endpoint
- Will implement client-side Zod validation with Hebrew error messages
- Will use dish selector to populate `items` array
- Will use date/time picker for `pickup_time`

**Story 1.6 (Tablet Kanban Display):**
- Will use GET `/api/orders` with status filtering
- Will display orders grouped by status in Kanban columns
- Will use `order_number` for display to customers

**Story 1.7a (WhatsApp Webhook):**
- Will use POST `/api/orders` with `source='whatsapp'`
- Will parse WhatsApp messages to extract order data
- Will populate `customer_phone` from WhatsApp sender

### References

- [Source: docs/epics.md - Epic 1, Story 1.4]
- [Source: docs/architecture.md - Database Schema Management Section]
- [Source: docs/architecture.md - Data Validation Section]
- [Source: docs/project_context.md - Database & Validation Rules]
- [Source: docs/project_context.md - Framework-Specific Rules (Next.js API Routes)]
- [Source: docs/sprint-artifacts/1-2-create-menu-management-database-schema-and-api.md - Previous Story Learnings]

### Success Criteria

**Story is complete when:**
1. ✅ Migration file `002_create_orders_tables.sql` created and executed
2. ✅ `orders` table exists in Supabase with all columns
3. ✅ `order_items` table exists with foreign key constraints
4. ✅ `order_status` and `order_source` ENUMs created
5. ✅ RLS policies configured (public read, authenticated write)
6. ✅ `order_number` auto-increments on insert (SERIAL)
7. ✅ TypeScript types generated in `lib/types/supabase.ts`
8. ✅ Convenience types created in `lib/types/database.ts`
9. ✅ Zod validation schemas created in `lib/validation/schemas/order-schema.ts`
10. ✅ POST `/api/orders` creates order with items (201)
11. ✅ GET `/api/orders` returns filtered/paginated orders (200)
12. ✅ GET `/api/orders/[id]` returns order with items joined (200)
13. ✅ All validation errors return 400 with VALIDATION_ERROR code
14. ✅ Not found errors return 404 with NOT_FOUND code
15. ✅ Database errors return 500 with DATABASE_ERROR code
16. ✅ Manual testing confirms all CRUD operations work
17. ✅ UUID validation prevents SQL injection in route parameters
18. ✅ Future pickup time constraint works correctly
19. ✅ Israeli phone format validation works when phone provided
20. ✅ At least one item validation works

## Dev Agent Record

### Context Reference

**Previous Stories:**
- 1.1 - Initialize Next.js Project with Supabase and shadcn/ui
- 1.2 - Create Menu Management Database Schema and API

**Dependencies:**
- Supabase connection from Story 1.1
- `dishes` table from Story 1.2 (foreign key dependency)
- `trigger_set_updated_at()` function from Story 1.2

### Agent Model Used

_To be filled by Dev agent during implementation_

### Implementation Notes

_To be filled by Dev agent during implementation_

### Completion Notes List

_To be filled by Dev agent during implementation_

### File List

**To be created:**
- `supabase/migrations/002_create_orders_tables.sql` - Orders and order_items schema
- `lib/types/database.ts` - Convenience types for Order and OrderItem
- `lib/validation/schemas/order-schema.ts` - Zod validation schemas
- `app/api/orders/route.ts` - POST and GET endpoints
- `app/api/orders/[id]/route.ts` - GET single order endpoint

**To be modified:**
- `lib/types/supabase.ts` - Regenerated with new tables (auto-generated)
