# Project Context: KitchenOS

**Purpose:** Critical implementation rules for AI agents. Read this BEFORE implementing any code.

---

## Technology Stack & Versions

**EXACT versions required:**

- Next.js **16.0.10** (App Router)
- React **19.2.1** + React DOM **19.2.1**
- TypeScript **5.x** (strict mode REQUIRED)
- Tailwind CSS **4.x** (@tailwindcss/postcss ^4)
- Supabase JS **2.87.1** + Supabase SSR **0.8.0**
- ESLint **9.x** + eslint-config-next **16.0.10**

**Path alias configured:** `@/*` → project root

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

**TypeScript Configuration (NEVER violate):**
- ✅ **Strict mode is ENABLED** - no implicit `any`, all null checks required
- ✅ **Target ES2017** - do NOT use features newer than ES2017
- ✅ **Use `type` for type-only imports** - `import type { User } from '@/types'`
- ❌ **NEVER disable strict** - no `@ts-ignore` or `@ts-expect-error` without explicit justification

**Import Patterns:**
```typescript
// ✅ CORRECT - Use @ alias for project imports
import { cn } from '@/lib/utils'
import type { Database } from '@/types/supabase'

// ❌ WRONG - Don't use relative paths for project files
import { cn } from '../../lib/utils'
```

**Error Handling Pattern (Multi-Layer):**
```typescript
// APIs return English error codes
{ error: { code: 'VALIDATION_ERROR', message: '...', details: {...} } }

// Client maps to Hebrew via lib/errors/messages.ts
const hebrewMessage = hebrewErrorMessages[error.code] || 'שגיאה כללית'
```

---

### Framework-Specific Rules (Next.js 16 App Router)

**Server vs Client Components:**
```typescript
// ✅ CORRECT - Server Component (default)
export default async function Page() {
  const data = await fetchData() // Can use async/await
  return <Component data={data} />
}

// ✅ CORRECT - Client Component (when needed)
'use client'
export function InteractiveButton() {
  const [state, setState] = useState() // Can use hooks
  return <button onClick={...}>...</button>
}

// ❌ WRONG - Server Component trying to use client features
export default function Page() {
  const [state, setState] = useState() // ERROR - can't use hooks in Server Component
}
```

**API Route Structure (REQUIRED):**
```typescript
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient() // Use server client for API routes (async)
  // ... implementation
  return NextResponse.json({ data })
}

// ❌ WRONG - Using browser client in API route
import { createClient } from '@/lib/supabase/client' // Don't use client in API routes
```

**Supabase Client Usage (CRITICAL):**
- **Browser/Client Components:** Use `createClient()` from `@/lib/supabase/client`
- **Server Components/API Routes:** Use `createClient()` (async) from `@/lib/supabase/server`
- **Admin Operations:** Use `createAdminClient()` from `@/lib/supabase/admin`
- ❌ **NEVER mix client types** - wrong client = auth failures

**Real-Time Patterns (Supabase + React Query):**
```typescript
// ✅ CORRECT - Realtime subscription triggers React Query invalidation
useEffect(() => {
  const channel = supabase
    .channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' },
      () => queryClient.invalidateQueries(['orders'])
    )
    .subscribe()
  return () => { channel.unsubscribe() }
}, [])
```

---

### Database & Validation Rules

**Naming Convention (ENFORCED):**
- Database tables/columns: `snake_case` (orders, customer_name, pickup_time)
- TypeScript interfaces: `PascalCase` (Order, CustomerData)
- JSON API responses: `snake_case` (matches database exactly)
- Component files: `PascalCase` (OrderCard.tsx)
- Utility files: `camelCase` (priority.ts, pricing.ts)

**Multi-Layer Validation (REQUIRED):**
1. **Client validation:** Zod schema in forms
2. **API validation:** Zod middleware in API routes
3. **Database validation:** PostgreSQL constraints (NOT NULL, CHECK, etc.)

```typescript
// Define schema ONCE, use everywhere
// src/lib/validation/schemas/order-schema.ts
export const orderSchema = z.object({
  customer_name: z.string().min(1),
  customer_phone: z.string().regex(/^05\d{8}$/), // Israeli phone
  pickup_time: z.date().min(new Date()), // Future only
  items: z.array(...).min(1)
})

// Use in client
const result = orderSchema.safeParse(formData)

// Use in API
const validated = orderSchema.parse(await req.json())
```

---

### Hebrew RTL & i18n Rules

**Text Direction (CRITICAL):**
- ✅ **ALL user-facing text is in Hebrew** (except error codes)
- ✅ **Use Tailwind RTL utilities** - `rtl:text-right`, `ltr:text-left`
- ✅ **Error messages:** English codes from API → Hebrew translation on client
- ❌ **NEVER return Hebrew from APIs** - breaks future i18n

**Date/Time Formatting:**
```typescript
// ✅ CORRECT - Use date-fns with Hebrew locale
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

format(date, 'PPp', { locale: he }) // "13 בדצמבר 2025, 14:30"

// ❌ WRONG - English date formatting
format(date, 'PPp') // "December 13, 2025, 2:30 PM"
```

---

### Touch Optimization Rules

**Minimum Touch Targets (48px REQUIRED):**
```tsx
// ✅ CORRECT - 48px minimum for all interactive elements
<button className="min-h-12 min-w-12 p-3"> {/* 48px = 12 * 4px */}
  <Icon className="h-6 w-6" />
</button>

// ❌ WRONG - Too small for touch
<button className="p-1"> {/* Only 4px padding */}
  <Icon className="h-4 w-4" />
</button>
```

**Shadcn/ui Custom Variants:**
- Use `size="lg"` for all touch-enabled components
- Add `touch-manipulation` class to prevent double-tap zoom
- Increase spacing between interactive elements (min 8px gap)

---

### Testing Rules (READ test-requirements.md)

**Test Coverage REQUIRED:**
- **100% coverage:** `lib/utils/priority.ts`, `lib/utils/pricing.ts`, `lib/webhooks/verify.ts`, `lib/errors/messages.ts`
- **80% coverage:** All API routes, integration tests, Realtime tests
- **5 E2E tests REQUIRED:** See test-requirements.md for exact specs

**Test File Organization:**
```
tests/
├── unit/           # *.test.ts - Pure function tests
├── integration/    # *.test.ts - API + database tests
└── e2e/            # *.spec.ts - Playwright full workflows
```

**Test Structure Pattern:**
```typescript
// ✅ CORRECT - Descriptive test names with context
describe('calculateOrderPriority', () => {
  it('assigns Priority 1000+ for overdue orders (pickup_time < now)')
  it('assigns Priority 500 for urgent orders (<15 min until pickup)')
})

// ❌ WRONG - Vague test names
it('works correctly')
it('handles edge cases')
```

---

### Security Rules (CRITICAL)

**HMAC Webhook Verification (100% coverage REQUIRED):**
```typescript
// lib/webhooks/verify.ts MUST use crypto.timingSafeEqual
import { timingSafeEqual } from 'crypto'

// ✅ CORRECT - Prevents timing attacks
const isValid = timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
)

// ❌ WRONG - Vulnerable to timing attacks
const isValid = signature === expectedSignature
```

**TV Dashboard Sanitization (NEVER leak sensitive data):**
```typescript
// ✅ CORRECT - Use public_orders_view (sanitized)
const { data } = await supabase.from('public_orders_view').select('*')
// Returns: first_name_only, status, pickup_time (NO phone, NO price)

// ❌ WRONG - Reading full orders table on TV
const { data } = await supabase.from('orders').select('*')
// Leaks customer_phone and total_price to public display
```

**API Authentication:**
- ✅ `/api/webhooks/*` → HMAC verification (no session)
- ✅ `/api/orders`, `/api/dishes` → Supabase session (middleware.ts)
- ❌ **NEVER skip authentication** on internal APIs

---

### Multi-Device Coordination Rules

**Primary Write Source (CRITICAL):**
- ✅ **Tablet is PRIMARY write source** - all order updates go through tablet
- ✅ **Desktop** - manual entry only (batch orders Wednesday/Thursday nights)
- ✅ **TV** - read-only display (public-facing, sanitized data)
- ❌ **EXCEPTION (ONLY):** n8n can update `delay_notification_sent_at` column ONLY

**Realtime Coordination:**
```typescript
// All devices subscribe to 'orders' channel
supabase.channel('orders')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' },
    (payload) => {
      queryClient.invalidateQueries(['orders']) // Auto-refresh all clients
    }
  )
```

---

### Critical Don't-Miss Rules

**Anti-Patterns (NEVER do these):**

❌ **Don't use camelCase in database:**
```sql
-- WRONG
CREATE TABLE orders (customerId UUID, pickupTime TIMESTAMP);

-- CORRECT
CREATE TABLE orders (customer_id UUID, pickup_time TIMESTAMP);
```

❌ **Don't return Hebrew from APIs:**
```typescript
// WRONG
return NextResponse.json({ error: 'שגיאה באימות' })

// CORRECT
return NextResponse.json({ error: { code: 'VALIDATION_ERROR' } })
// Client translates code → Hebrew
```

❌ **Don't mix Supabase clients:**
```typescript
// WRONG - Using browser client in API route
import { createClient } from '@/lib/supabase/client'
export async function GET() {
  const supabase = createClient() // Will fail - no cookies in API route
}

// CORRECT
import { createClient } from '@/lib/supabase/server'
export async function GET() {
  const supabase = await createClient() // Has access to cookies (async function)
}
```

❌ **Don't skip ESLint enforcement:**
- Story 1 MUST install `eslint-plugin-check-file` + `@typescript-eslint/eslint-plugin`
- Build MUST fail on naming violations (see architecture.md for .eslintrc.json)

**Edge Cases:**

⚠️ **pickup_time is NEVER NULL:**
```typescript
// ✅ CORRECT - Validate pickup_time exists
const orderSchema = z.object({
  pickup_time: z.date().min(new Date()), // Required + future date
})

// ❌ WRONG - Allowing null pickup_time
pickup_time: z.date().nullable() // Staff can't start packing without pickup time
```

⚠️ **Handle Realtime connection loss gracefully:**
```typescript
// ✅ CORRECT - Don't crash on disconnect
.on('system', { event: 'disconnect' }, () => {
  console.warn('Realtime disconnected - will auto-reconnect')
  // UI shows warning toast but remains functional
})

// ❌ WRONG - Throwing error on disconnect
.on('system', { event: 'disconnect' }, () => {
  throw new Error('Connection lost!') // Crashes UI
})
```

⚠️ **Price calculation must round to 2 decimals (NIS currency):**
```typescript
// ✅ CORRECT
const totalPrice = Math.round(weight * pricePerUnit * 100) / 100

// ❌ WRONG - Floating point errors
const totalPrice = weight * pricePerUnit // 1.5 * 10.3 = 15.449999999
```

---

## Architecture Reference

**Primary Documents:**
- `/docs/architecture.md` - Complete architectural decisions (3,500+ lines)
- `/docs/test-requirements.md` - Testing specifications (5 E2E + 4 unit + 3 integration)

**Key Architectural Decisions:**
1. Database Schema Management → Supabase Migration Files (version controlled)
2. Data Validation → Multi-Layer Zod (client + API + database)
3. Error Handling → Structured System (English codes + Hebrew client-side)
4. Testing Strategy → Pragmatic MVP (100% coverage for critical logic)
5. Monitoring → Simple MVP (Sentry + database logs + Vercel Analytics)
6. Environment Config → Type-safe .env (@t3-oss/env-nextjs)

**Project Structure Canonical Paths:**
- State management: `src/lib/stores/` (NOT `lib/state/`)
- TypeScript types: `src/types/` (NOT `lib/types/`)
- Supabase utilities: `src/lib/supabase/`
- Validation schemas: `src/lib/validation/schemas/`

---

## Pre-Implementation Checklist

Before implementing ANY story, verify:

- [ ] Read `/docs/architecture.md` - understand all architectural decisions
- [ ] Read `/docs/test-requirements.md` - understand test coverage requirements
- [ ] Read this `project_context.md` - understand critical rules
- [ ] Verify you're using correct Supabase client (browser vs server vs admin)
- [ ] Confirm naming conventions (snake_case DB, PascalCase components, camelCase utils)
- [ ] Check touch targets are 48px minimum
- [ ] Ensure error messages use English codes (client translates to Hebrew)
- [ ] Run ESLint before committing (build must pass)

---

**Last Updated:** 2025-12-13
**Architecture Version:** 1.0.0
**Status:** Active - Read before every implementation
