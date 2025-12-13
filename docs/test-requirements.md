# Test Requirements for KitchenOS MVP

**Purpose:** This document defines REQUIRED test coverage for AI agents implementing user stories. "Pragmatic MVP Testing" means focused testing on critical paths and high-risk areas, NOT skipping tests.

---

## Critical Logic - Unit Tests (100% Coverage REQUIRED)

### 1. Order Priority Calculation (`lib/utils/priority.ts`)

**Why Critical:** Core "no thinking" business requirement - system tells staff what to do next.

**Required Test Cases:**
```typescript
describe('calculateOrderPriority', () => {
  it('assigns Priority 1000+ for overdue orders (pickup_time < now)')
  it('assigns Priority 500 for urgent orders (<15 min until pickup)')
  it('assigns Priority 100 for soon orders (15-45 min until pickup)')
  it('assigns Priority 0 for normal orders (>45 min until pickup)')
  it('handles edge case: exactly 15 minutes until pickup')
  it('handles edge case: exactly 45 minutes until pickup')
  it('handles null pickup_time by throwing error')
  it('handles invalid date objects by throwing error')
})
```

### 2. Price Calculation from Weights (`lib/utils/pricing.ts`)

**Why Critical:** Money calculations must be accurate - undercalculation = lost revenue, overcalculation = angry customers.

**Required Test Cases:**
```typescript
describe('calculateOrderPrice', () => {
  it('calculates total price from item weights * price_per_unit')
  it('handles decimal weights correctly (e.g., 1.5kg)')
  it('rounds to 2 decimal places (NIS currency)')
  it('handles zero weight items (free items like napkins)')
  it('throws error for negative weights')
  it('sums multiple items correctly')
  it('handles edge case: 0.01kg minimum weight')
  it('handles large weights (10kg+) without overflow')
})
```

### 3. Hebrew Error Message Mapping (`lib/errors/messages.ts`)

**Why Critical:** If this breaks, non-technical staff cannot understand errors, system becomes unusable.

**Required Test Cases:**
```typescript
describe('hebrewErrorMessages', () => {
  it('has Hebrew translation for every ErrorCode constant')
  it('returns fallback message for unknown error codes')
  it('messages are RTL-compatible (no mixed LTR/RTL text)')
  it('no message exceeds 80 characters (toast display limit)')
  it('all messages end with punctuation for consistency')
})
```

### 4. HMAC Webhook Signature Verification (`lib/webhooks/verify.ts`)

**Why Critical:** Security boundary - prevents malicious webhook injection, replay attacks.

**Required Test Cases:**
```typescript
describe('verifyWebhook', () => {
  it('accepts valid signature with correct timestamp')
  it('rejects invalid signature')
  it('rejects replay attacks (timestamp >5 min old)')
  it('rejects future timestamps (clock skew attack)')
  it('uses crypto.timingSafeEqual to prevent timing attacks')
  it('handles missing signature parameter gracefully')
  it('handles malformed timestamp (non-numeric) gracefully')
  it('validates against correct webhook secret from env')
})
```

---

## Integration Tests (80% Coverage REQUIRED)

### 1. POST /api/orders with Zod Validation

**Why Critical:** Proves multi-layer validation works (API boundary + database constraints).

**Required Test Cases:**
```typescript
describe('POST /api/orders', () => {
  it('accepts valid order with all required fields')
  it('rejects order with invalid Israeli phone number format')
  it('rejects order with pickup_time in the past')
  it('rejects order with empty items array')
  it('rejects order with negative quantity')
  it('rejects order with invalid dish_id (non-UUID)')
  it('returns VALIDATION_ERROR code with Hebrew-mappable message')
  it('returns 201 status with created order data on success')
  it('triggers Realtime broadcast after successful creation')
})
```

### 2. GET /api/orders/at-risk (Delay Notification Query)

**Why Critical:** n8n scheduled job depends on this endpoint for proactive customer notifications.

**Required Test Cases:**
```typescript
describe('GET /api/orders/at-risk', () => {
  it('returns orders with pickup_time <30 min and status != "ready"')
  it('excludes orders where delay_notification_sent_at IS NOT NULL')
  it('excludes orders already marked "ready" or "collected"')
  it('returns empty array when no at-risk orders exist')
  it('orders results by pickup_time ASC (most urgent first)')
  it('includes order details needed for WhatsApp message (name, phone, pickup_time)')
  it('requires valid authentication token')
})
```

### 3. Supabase Realtime Integration

**Why Critical:** Multi-device coordination depends on real-time sync (tablet ↔ TV ↔ desktop).

**Required Test Cases:**
```typescript
describe('Supabase Realtime Integration', () => {
  it('order INSERT triggers WebSocket broadcast to "orders" channel')
  it('order UPDATE triggers WebSocket broadcast to "orders" channel')
  it('client receives update and invalidates React Query cache')
  it('TV dashboard receives sanitized data only (no prices, no phone)')
  it('multiple clients receive same update simultaneously')
  it('connection loss gracefully degrades (no crashes)')
})
```

---

## E2E Happy Paths - Playwright (5 Tests REQUIRED)

### 1. Manual Order Entry → Packing Workflow → Payment Link

**Why Critical:** Primary user journey for sporadic orders and batch entry (Yaron's workflow).

**Test Implementation:**
```typescript
test('Complete order workflow from desktop entry to payment link', async ({ page }) => {
  // Desktop: Manual entry
  await page.goto('/manual-entry')
  await page.fill('[name="customer_name"]', 'David Cohen')
  await page.fill('[name="customer_phone"]', '0501234567')
  await page.fill('[name="pickup_time"]', '2025-12-13T14:00') // 2pm pickup
  await page.selectOption('[name="dish"]', 'Chicken Schnitzel')
  await page.fill('[name="quantity"]', '2')
  await page.click('button:has-text("הוסף הזמנה")') // "Add Order" in Hebrew

  // Verify order appears in queue
  await expect(page.locator('text=הזמנה נוספה בהצלחה')).toBeVisible() // "Order added successfully"

  // Tablet: Packing workflow
  await page.goto('/station')
  await expect(page.locator('text=David Cohen')).toBeVisible()
  await page.click('button:has-text("התחל אריזה")') // "START PACKING"

  // Enter weight
  await page.fill('[name="weight"]', '1.2')
  await expect(page.locator('text=₪')).toBeVisible() // Price calculated and displayed

  // Confirm and send payment link
  await page.click('button:has-text("שלח קישור לתשלום")') // "Send Payment Link"

  // Verify status changed
  await expect(page.locator('text=קישור תשלום נשלח')).toBeVisible() // "Payment Link Sent"
})
```

### 2. Webhook Order → Queue → Ready → TV Dashboard

**Why Critical:** Primary automated workflow via WhatsApp (majority of orders).

**Test Implementation:**
```typescript
test('Webhook order flows through system to TV dashboard', async ({ page, request }) => {
  // Simulate n8n webhook (WhatsApp order)
  const webhookResponse = await request.post('/api/webhooks/n8n', {
    data: {
      customer_name: 'Sarah Levi',
      customer_phone: '0509876543',
      pickup_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min from now
      items: [
        { dish_id: 'abc-123', dish_name: 'Chicken Schnitzel', quantity: 2 }
      ]
    },
    headers: {
      'X-Webhook-Signature': computeValidHMAC(...), // Helper function
      'X-Webhook-Timestamp': Date.now().toString()
    }
  })

  expect(webhookResponse.status()).toBe(201)

  // Tablet: Order appears in queue
  await page.goto('/station')
  await expect(page.locator('text=Sarah Levi')).toBeVisible()
  await expect(page.locator('text=URGENT')).toBeVisible() // 30 min = urgent tier

  // Mark order ready (skip packing for pre-weighed items)
  await page.click('button:has-text("סמן מוכן")') // "Mark Ready"

  // TV: Order appears on customer-facing dashboard
  await page.goto('/tv')
  await expect(page.locator('text=Sarah')).toBeVisible() // First name only
  await expect(page.locator('text=מוכן')).toBeVisible() // "Ready" in Hebrew
  await expect(page.locator('text=0509876543')).not.toBeVisible() // Phone NOT visible (sanitized)
})
```

### 3. Delay Notification Flow (n8n Integration)

**Why Critical:** Proactive customer communication system - prevents angry confrontations from delayed orders.

**Test Implementation:**
```typescript
// tests/e2e/delay-notification.spec.ts
test('At-risk orders trigger delay notifications correctly', async ({ page, request }) => {
  // Create order with pickup_time in 25 minutes (within 30-min window)
  const order = await createTestOrder({
    customer_name: 'Rachel Green',
    customer_phone: '0521112233',
    pickup_time: addMinutes(new Date(), 25),
    status: 'pending'
  })

  // Simulate n8n polling at-risk endpoint
  const response = await request.get('/api/orders/at-risk')
  expect(response.status()).toBe(200)
  const atRiskOrders = await response.json()

  // Verify order appears in at-risk list
  expect(atRiskOrders.data).toContainEqual(
    expect.objectContaining({
      id: order.id,
      customer_name: 'Rachel Green',
      customer_phone: '0521112233'
    })
  )

  // Simulate n8n updating delay_notification_sent_at timestamp
  await request.patch(`/api/orders/${order.id}`, {
    data: {
      delay_notification_sent_at: new Date().toISOString()
    }
  })

  // Verify second poll excludes this order (no duplicate notifications)
  const response2 = await request.get('/api/orders/at-risk')
  const atRiskOrders2 = await response2.json()
  expect(atRiskOrders2.data).not.toContainEqual(
    expect.objectContaining({ id: order.id })
  )

  // Verify order with status=ready is excluded even without notification timestamp
  await request.patch(`/api/orders/${order.id}`, {
    data: { status: 'ready', delay_notification_sent_at: null }
  })
  const response3 = await request.get('/api/orders/at-risk')
  const atRiskOrders3 = await response3.json()
  expect(atRiskOrders3.data).not.toContainEqual(
    expect.objectContaining({ id: order.id })
  )
})
```

### 4. TV Dashboard Sanitization (Security)

**Why Critical:** Prevents sensitive customer data (phone, price) from displaying on public-facing TV dashboard.

**Test Implementation:**
```typescript
// tests/e2e/tv-sanitization.spec.ts
test('TV dashboard never displays sensitive customer data', async ({ page }) => {
  // Create order with full customer details including sensitive data
  await createTestOrder({
    customer_name: 'David Cohen',
    customer_phone: '0501234567',
    total_price: 125.50,
    status: 'ready'
  })

  // Load TV dashboard (public-facing)
  await page.goto('/tv')

  // Verify only first name shown (not full name)
  await expect(page.locator('text=David')).toBeVisible()
  await expect(page.locator('text=Cohen')).not.toBeVisible()

  // Verify phone number NEVER appears anywhere on page
  await expect(page.locator('text=0501234567')).not.toBeVisible()
  await expect(page.locator(':has-text("050")')).not.toBeVisible()

  // Verify price NEVER appears (₪ symbol is OK for decoration, but not actual amounts)
  await expect(page.locator('text=125.50')).not.toBeVisible()
  await expect(page.locator('text=125')).not.toBeVisible()

  // Verify status IS visible (non-sensitive)
  await expect(page.locator('text=מוכן')).toBeVisible() // "Ready" in Hebrew

  // Test with multiple orders to ensure sanitization is consistent
  await createTestOrder({
    customer_name: 'Sarah Levi',
    customer_phone: '0529998877',
    total_price: 89.99,
    status: 'ready'
  })

  await page.reload()
  await expect(page.locator('text=Sarah')).toBeVisible()
  await expect(page.locator('text=Levi')).not.toBeVisible()
  await expect(page.locator('text=0529998877')).not.toBeVisible()
  await expect(page.locator('text=89.99')).not.toBeVisible()
})
```

### 5. Dual-Mode Tablet Toggle (Packing ↔ Cashier)

**Why Critical:** Staff switch between modes 4+ times daily, persistence must work across page reloads.

**Test Implementation:**
```typescript
// tests/e2e/station-mode-toggle.spec.ts
test('Tablet switches between packing and cashier modes with persistence', async ({ page }) => {
  await page.goto('/station')

  // Verify default mode is packing (morning workflow)
  await expect(page.locator('text=PACKING MODE')).toHaveClass(/active/)
  await expect(page.locator('button:has-text("התחל אריזה")')).toBeVisible() // "START PACKING"

  // Toggle to cashier mode (post-8:30am workflow)
  await page.click('button:has-text("CASHIER MODE")')

  // Verify confirmation dialog appears (prevent accidental switches)
  await expect(page.locator('text=לעבור למצב קופה?')).toBeVisible() // "Switch to cashier mode?"
  await page.click('button:has-text("אישור")') // "Confirm"

  // Verify UI changed to cashier interface
  await expect(page.locator('text=CASHIER MODE')).toHaveClass(/active/)
  await expect(page.locator('text=חפש הזמנה')).toBeVisible() // "Search Order"
  await expect(page.locator('button:has-text("התחל אריזה")')).not.toBeVisible()

  // Verify localStorage persisted the mode selection
  const mode = await page.evaluate(() => localStorage.getItem('station-mode'))
  expect(mode).toBe('cashier')

  // Verify persistence across page reload (critical for tablet restarts)
  await page.reload()
  await expect(page.locator('text=CASHIER MODE')).toHaveClass(/active/)
  await expect(page.locator('text=חפש הזמנה')).toBeVisible()

  // Toggle back to packing mode
  await page.click('button:has-text("PACKING MODE")')
  await page.click('button:has-text("אישור")')

  // Verify switch back works
  await expect(page.locator('text=PACKING MODE')).toHaveClass(/active/)
  const modeAfterSwitch = await page.evaluate(() => localStorage.getItem('station-mode'))
  expect(modeAfterSwitch).toBe('packing')
})
```

---

## NOT Required for MVP

These are nice-to-have but deferred to Phase 2 to maintain development velocity:

- **UI Component Unit Tests**: Shadcn/ui components already tested upstream
- **Performance/Load Tests**: <100 orders/day doesn't justify load testing overhead
- **Visual Regression Tests**: Useful for preventing UI regressions, but manual QA sufficient for MVP
- **Accessibility Tests**: WCAG compliance tested manually, automated tests in Phase 2
- **Cross-Browser E2E**: Focus on Chrome (primary tablet browser), add Safari/Firefox in Phase 2

---

## Test Execution Requirements

### CI/CD Pipeline
All tests MUST pass before deployment to production:

```yaml
# .github/workflows/test.yml
- run: npm run test:unit    # All unit tests
- run: npm run test:integration  # All API integration tests
- run: npm run test:e2e     # Playwright E2E tests
```

### Local Development
AI agents implementing stories MUST run tests locally:

```bash
# Before marking story complete
npm run test:unit -- lib/utils/priority.test.ts  # Specific unit test
npm run test:e2e -- tests/order-workflow.spec.ts  # Specific E2E test
npm run test  # All tests
```

### Coverage Thresholds

Enforced via Jest configuration:

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./lib/utils/priority.ts": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      },
      "./lib/utils/pricing.ts": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      },
      "./lib/webhooks/verify.ts": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
```

---

## AI Agent Testing Protocol

When implementing a user story:

1. **Before writing production code**: Write failing tests (TDD red-green-refactor)
2. **During implementation**: Run tests frequently to validate progress
3. **Before marking story complete**: Ensure ALL relevant tests pass
4. **When story touches critical logic**: Add unit tests to `/lib/**/*.test.ts`
5. **When story adds API endpoint**: Add integration tests to `/tests/api/**/*.test.ts`
6. **When story completes major user journey**: Add E2E test to `/tests/e2e/**/*.spec.ts`

**Story is NOT complete until:**
- All new code has required test coverage
- All existing tests still pass (no regressions)
- CI/CD pipeline passes (GitHub Actions green check)

---

## Questions?

If unclear whether a specific scenario requires testing:

1. **Ask**: "If this breaks, does it prevent core business operations?" → YES = test required
2. **Ask**: "Is this handling money, security, or customer data?" → YES = test required
3. **Ask**: "Will staff be unable to use the system if this fails?" → YES = test required
4. **Otherwise**: Defer test to Phase 2 and document as technical debt

**When in doubt, write the test.** Fixing bugs post-MVP is 10x more expensive than catching them in tests.
