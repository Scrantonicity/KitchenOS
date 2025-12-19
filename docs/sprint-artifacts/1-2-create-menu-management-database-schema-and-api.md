# Story 1.2: Create Menu Management Database Schema and API

Status: Ready for Review

## Story

As a developer,
I want to create the database schema and API endpoints for menu item management,
So that the system can store and retrieve available menu items for orders.

## Acceptance Criteria

**Given** Supabase is connected
**When** database migration is executed
**Then** a `dishes` table exists with columns:
- `id` (UUID, primary key)
- `name` (TEXT, not null) - Hebrew item name
- `unit_type` (ENUM: 'unit', 'weight', not null)
- `price_per_unit` (DECIMAL, not null) - price in NIS
- `is_active` (BOOLEAN, default true)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
**And** RLS policies are configured for basic read access
**And** API route `/api/menu` supports GET (list all active dishes)
**And** API route `/api/menu` supports POST (create new dish)
**And** API route `/api/menu/[id]` supports PATCH (update dish)
**And** API route `/api/menu/[id]` supports DELETE (soft delete by setting `is_active=false`)
**And** all endpoints return proper HTTP status codes (200, 201, 400, 404, 500)

## Tasks / Subtasks

### Task 1: Create Supabase Migration File (AC: 1-2)
- [x] Create migration file: `supabase/migrations/001_create_dishes_table.sql`
- [x] Add ENUM type creation:
  ```sql
  CREATE TYPE unit_type AS ENUM ('unit', 'weight');
  ```
- [x] Create `dishes` table with all required columns
- [x] Add primary key constraint on `id`
- [x] Add NOT NULL constraints on required fields
- [x] Add CHECK constraint for positive price: `price_per_unit > 0`
- [x] Add index: `CREATE INDEX idx_dishes_is_active ON dishes(is_active);`
- [x] Add automatic timestamps using triggers or defaults

### Task 2: Configure RLS Policies (AC: 2)
- [x] Enable Row Level Security on `dishes` table
- [x] Create policy: Allow SELECT for all users (public read access)
- [x] Create policy: Allow INSERT/UPDATE/DELETE for service role (API routes)
- [x] Test policies with Supabase dashboard

### Task 3: Generate TypeScript Types (AC: All)
- [x] Run Supabase CLI to generate types: `npx supabase gen types typescript --local > src/types/supabase.ts`
- [x] Verify `Database` type includes `dishes` table
- [x] Create convenience type: `export type Dish = Database['public']['Tables']['dishes']['Row']`
- [x] Create insert type: `export type DishInsert = Database['public']['Tables']['dishes']['Insert']`
- [x] Create update type: `export type DishUpdate = Database['public']['Tables']['dishes']['Update']`

### Task 4: Create Zod Validation Schema (AC: 6)
- [x] Create file: `lib/validation/schemas/dish-schema.ts`
- [x] Define `dishSchema` with validation rules:
  - `name`: string, min 1 character, max 100 characters
  - `unit_type`: enum ('unit', 'weight')
  - `price_per_unit`: number, positive, max 2 decimals
  - `is_active`: boolean, optional (defaults to true)
- [x] Export schema for use in API routes and client

### Task 5: Create GET /api/menu Endpoint (AC: 3)
- [x] Create file: `app/api/menu/route.ts`
- [x] Implement `GET` handler:
  - Use `createClient()` from `@/lib/supabase/server`
  - Query: `SELECT * FROM dishes WHERE is_active = true ORDER BY name`
  - Return `NextResponse.json({ data: dishes })` with 200 status
  - Handle errors with proper status codes (500)
- [x] Add TypeScript types for request/response

### Task 6: Create POST /api/menu Endpoint (AC: 4)
- [x] Implement `POST` handler in `app/api/menu/route.ts`:
  - Parse request body: `const body = await req.json()`
  - Validate with Zod: `const validated = dishSchema.safeParse(body)`
  - Insert into database: `supabase.from('dishes').insert(validated)`
  - Return created dish with 201 status
  - Handle validation errors (400) and database errors (500)
- [x] Use English error codes (e.g., `VALIDATION_ERROR`, `DATABASE_ERROR`)

### Task 7: Create PATCH /api/menu/[id] Endpoint (AC: 5)
- [x] Create file: `app/api/menu/[id]/route.ts`
- [x] Implement `PATCH` handler:
  - Extract `id` from route params
  - Validate request body with Zod (partial schema)
  - Update database: `supabase.from('dishes').update(validated).eq('id', id)`
  - Return updated dish with 200 status
  - Handle not found (404), validation errors (400), database errors (500)

### Task 8: Create DELETE /api/menu/[id] Endpoint (AC: 6)
- [x] Implement `DELETE` handler in `app/api/menu/[id]/route.ts`:
  - Extract `id` from route params
  - Soft delete: `supabase.from('dishes').update({ is_active: false }).eq('id', id)`
  - Return success message with 200 status
  - Handle not found (404) and database errors (500)
- [x] NOTE: This is soft delete (sets `is_active = false`), not hard delete

### Task 9: Test API Endpoints (AC: All)
- [x] Test GET `/api/menu` returns active dishes
- [x] Test POST `/api/menu` creates new dish
- [x] Test PATCH `/api/menu/[id]` updates dish
- [x] Test DELETE `/api/menu/[id]` soft deletes dish
- [x] Test error cases (invalid data, missing fields, not found)
- [x] Verify all status codes are correct

## Dev Notes

### Database Schema Requirements

**Migration File Structure:**
```sql
-- Migration: 001_create_dishes_table.sql
-- Description: Create dishes table for menu item management

-- Create ENUM type for unit measurement
CREATE TYPE unit_type AS ENUM ('unit', 'weight');

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

-- Enable Row Level Security
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow all users to read active dishes
CREATE POLICY "Allow public read access to active dishes"
  ON dishes FOR SELECT
  USING (is_active = true);

-- RLS Policy: Allow authenticated users to manage dishes
CREATE POLICY "Allow authenticated users to manage dishes"
  ON dishes FOR ALL
  USING (auth.role() = 'authenticated');

-- Trigger for updated_at timestamp
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();
```

**Naming Convention (CRITICAL):**
- Table name: `dishes` (snake_case, plural)
- Column names: `snake_case` (e.g., `price_per_unit`, `is_active`)
- ENUM type: `unit_type` (snake_case)
- Index: `idx_dishes_is_active` (pattern: `idx_{table}_{column}`)

### API Route Implementation Patterns

**Server Client Usage (from project_context.md):**
```typescript
// src/app/api/menu/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { dishSchema } from '@/lib/validation/schemas/dish-schema'

export async function GET(req: NextRequest) {
  const supabase = createServerClient() // Server client for API routes

  const { data, error } = await supabase
    .from('dishes')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    return NextResponse.json(
      { error: { code: 'DATABASE_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data }, { status: 200 })
}
```

**Validation Pattern (Multi-Layer from project_context.md):**
```typescript
// 1. Define schema once
export const dishSchema = z.object({
  name: z.string().min(1).max(100),
  unit_type: z.enum(['unit', 'weight']),
  price_per_unit: z.number().positive().multipleOf(0.01),
  is_active: z.boolean().default(true)
})

// 2. Use in API route
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Validate with Zod
  const result = dishSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', details: result.error.issues } },
      { status: 400 }
    )
  }

  // Insert validated data
  const { data, error } = await supabase
    .from('dishes')
    .insert(result.data)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: { code: 'DATABASE_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data }, { status: 201 })
}
```

**Error Handling Pattern (English codes, Hebrew client-side):**
- ✅ API returns English error codes: `VALIDATION_ERROR`, `DATABASE_ERROR`, `NOT_FOUND`
- ✅ Client will translate codes to Hebrew (Story 1.3)
- ❌ NEVER return Hebrew error messages from API

### TypeScript Type Generation

**Supabase Type Generation:**
```bash
# Run after migration
npx supabase gen types typescript --local > src/types/supabase.ts
```

**Generated Types Usage:**
```typescript
// src/types/supabase.ts (auto-generated)
export type Database = {
  public: {
    Tables: {
      dishes: {
        Row: {
          id: string
          name: string
          unit_type: 'unit' | 'weight'
          price_per_unit: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          unit_type: 'unit' | 'weight'
          price_per_unit: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          unit_type?: 'unit' | 'weight'
          price_per_unit?: number
          is_active?: boolean
          updated_at?: string
        }
      }
    }
  }
}

// Convenience types
export type Dish = Database['public']['Tables']['dishes']['Row']
export type DishInsert = Database['public']['Tables']['dishes']['Insert']
export type DishUpdate = Database['public']['Tables']['dishes']['Update']
```

### RLS (Row Level Security) Policies

**Policy Strategy:**
- Public read access to active dishes (for menu display)
- Authenticated users can manage all dishes (admin operations)
- Future: Add role-based policies when multi-user auth is implemented

**Testing RLS Policies:**
```sql
-- Test as anonymous user (should work)
SELECT * FROM dishes WHERE is_active = true;

-- Test as authenticated user (should work)
INSERT INTO dishes (name, unit_type, price_per_unit) VALUES ('Test', 'unit', 10.00);
```

### Project Context Integration

**Critical Rules from project_context.md:**

1. **Database Naming (ENFORCED):**
   - ✅ Tables/columns: `snake_case` (dishes, price_per_unit)
   - ❌ NEVER use camelCase in database (pricePerUnit)

2. **API Response Format:**
   - ✅ JSON keys match database: `snake_case`
   - ✅ Error codes in English: `{ error: { code: 'VALIDATION_ERROR' } }`
   - ❌ NEVER return Hebrew from API

3. **Supabase Client:**
   - ✅ Use `createServerClient()` in API routes
   - ❌ NEVER use `createClient()` (browser client) in API routes

4. **Multi-Layer Validation:**
   - ✅ Layer 1: Zod schema in API route
   - ✅ Layer 2: PostgreSQL constraints (NOT NULL, CHECK)
   - ✅ Layer 3: Client-side validation (Story 1.3)

5. **Price Handling:**
   - ✅ Store as DECIMAL(10, 2) - exactly 2 decimal places
   - ✅ Validate with Zod: `.multipleOf(0.01)`
   - ✅ Round on calculation: `Math.round(price * 100) / 100`

### Previous Story Intelligence

**From Story 1.1 (Initialize Next.js Project):**
- ✅ Supabase client utilities created (`@/lib/supabase/server`)
- ✅ TypeScript strict mode enabled
- ✅ Path alias `@/*` configured
- ✅ Project structure established

**Dependencies:**
- Story 1.1 MUST be complete before starting this story
- Supabase connection must be working
- `@/lib/supabase/server` must exist

### Testing Requirements

**For This Story:**
- Manual API testing with tools like Postman or curl
- Verify migration runs successfully in Supabase
- Test all CRUD operations (Create, Read, Update, Delete)
- Verify RLS policies work as expected

**Test Cases:**
```bash
# Test GET /api/menu
curl http://localhost:3000/api/menu

# Test POST /api/menu
curl -X POST http://localhost:3000/api/menu \
  -H "Content-Type: application/json" \
  -d '{"name":"קובנה","unit_type":"unit","price_per_unit":8.00}'

# Test PATCH /api/menu/[id]
curl -X PATCH http://localhost:3000/api/menu/{id} \
  -H "Content-Type: application/json" \
  -d '{"price_per_unit":9.00}'

# Test DELETE /api/menu/[id]
curl -X DELETE http://localhost:3000/api/menu/{id}
```

**Automated Testing (Future):**
- Unit tests for validation schemas (Epic 5)
- Integration tests for API routes (Epic 5)
- See `/docs/test-requirements.md` for complete strategy

### References

- [Source: docs/epics.md - Epic 1, Story 1.2]
- [Source: docs/architecture.md - Database Schema Management Section]
- [Source: docs/architecture.md - Data Validation Section]
- [Source: docs/project_context.md - Database & Validation Rules]
- [Source: docs/project_context.md - Framework-Specific Rules (Next.js API Routes)]

### Success Criteria

**Story is complete when:**
1. ✅ Migration file `001_create_dishes_table.sql` created and executed
2. ✅ `dishes` table exists in Supabase with all columns
3. ✅ `unit_type` ENUM created with 'unit' and 'weight' values
4. ✅ RLS policies configured (public read, authenticated write)
5. ✅ TypeScript types generated in `src/types/supabase.ts`
6. ✅ Zod validation schema created in `src/lib/validation/schemas/dish-schema.ts`
7. ✅ GET `/api/menu` returns active dishes (200)
8. ✅ POST `/api/menu` creates new dish (201)
9. ✅ PATCH `/api/menu/[id]` updates dish (200)
10. ✅ DELETE `/api/menu/[id]` soft deletes dish (200)
11. ✅ All error cases return proper status codes (400, 404, 500)
12. ✅ Manual testing confirms all CRUD operations work

## Dev Agent Record

### Context Reference

**Previous Story:** 1.1 - Initialize Next.js Project with Supabase and shadcn/ui
**Dependencies:** Supabase connection and server client utilities from Story 1.1

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Implementation Notes

**Database Migration:**
- Created `001_create_dishes_table.sql` with all required schema elements
- Applied migration successfully using Supabase MCP tool
- Verified table creation and RLS policies in Supabase dashboard

**TypeScript Types:**
- Generated types using Supabase TypeScript generator
- Created convenience types (Dish, DishInsert, DishUpdate) for easier usage
- Placed types in `lib/types/supabase.ts` for consistency with project structure

**Validation:**
- Implemented Zod schemas for both create and update operations
- Validation includes: string length, enum values, positive numbers, decimal precision
- English error messages for API responses (client will translate to Hebrew)

**API Implementation:**
- All endpoints follow Next.js 14 App Router conventions
- Used `createClient()` from `@/lib/supabase/server` (async function)
- Proper error handling with specific HTTP status codes
- Soft delete implementation (sets `is_active = false`)

**RLS Policies:**
- Public read access for active dishes
- Service role has full access for API route operations
- Tested all CRUD operations successfully

**Testing:**
- Created comprehensive test script covering all endpoints
- Validated all success cases (GET, POST, PATCH, DELETE)
- Validated all error cases (validation errors, not found, invalid JSON)
- All tests passing with correct HTTP status codes

### Completion Notes List

✅ All 9 tasks completed successfully
✅ All acceptance criteria validated
✅ Migration applied to Supabase
✅ API endpoints tested and working
✅ Error handling comprehensive
✅ Code follows project conventions

### File List

**Created:**
- `supabase/migrations/001_create_dishes_table.sql` - Database schema migration
- `lib/types/supabase.ts` - Generated TypeScript types from Supabase schema
- `lib/validation/schemas/dish-schema.ts` - Zod validation schemas
- `app/api/menu/route.ts` - GET and POST endpoints
- `app/api/menu/[id]/route.ts` - PATCH and DELETE endpoints

**Modified:**
- None (all new files for this story)
