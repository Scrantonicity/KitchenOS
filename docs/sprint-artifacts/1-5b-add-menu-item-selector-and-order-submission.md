# Story 1.5b: Add Menu Item Selector and Order Submission

Status: ready-for-dev

## Story

As Yaron,
I want to select menu items and submit manual orders,
So that I can complete phone/email order entry.

## Acceptance Criteria

**Given** I've filled customer details in Story 1.5a form
**When** I see the menu item selector
**Then** all active dishes are shown in a searchable dropdown
**And** dropdown displays dish name in Hebrew

**When** I select a menu item
**Then** it appears in the order summary with a quantity input (default: 1)
**And** I can adjust quantity using +/- buttons or direct input
**And** quantity input accepts keyboard entry (numbers only)
**And** I can remove the item with an X button

**When** I add multiple items
**Then** the order summary shows all items with total item count
**And** order summary updates in real-time as I modify items

**When** I have at least one item and valid customer details
**Then** the "Create Order" button becomes enabled (green, prominent)
**And** button shows "שמור הזמנה" (Save Order) text

**When** I submit the form
**Then** the order is created with `source='manual'` and `status='created'`
**And** API request includes: customer_name, customer_phone, pickup_time, notes, items array, source='manual'
**And** each item in items array contains: dish_id, quantity
**And** I see a confirmation toast with the assigned order number
**And** toast message format: "הזמנה #{order_number} נוצרה בהצלחה" (Order #{order_number} created successfully)
**And** I'm redirected to `/admin/orders` after 2 seconds

**When** I try to submit with no items
**Then** "Create Order" button remains disabled
**And** I see message: "יש להוסיף לפחות פריט אחד" (Must add at least one item)
**And** message appears below the menu selector in red text

**When** API call fails
**Then** I see error toast message in Hebrew
**And** form remains populated with my input
**And** I can retry submission

## Tasks / Subtasks

### Task 1: Create Menu Item Selector Component (AC: Searchable Dropdown, Hebrew Display)
- [ ] Create file: `app/admin/orders/new/components/MenuItemSelector.tsx`
- [ ] Install Combobox component: `npx shadcn@latest add command` (includes Command component for searchable select)
- [ ] Fetch active dishes from GET `/api/menu` using React Query or SWR
- [ ] Implement searchable dropdown with Hebrew text support:
  - Display dish name in Hebrew (RTL)
  - Show unit type badge (יחידה/משקל)
  - Show price per unit (₪XX.XX format)
  - Filter dishes by name as user types
- [ ] Handle loading state while fetching dishes
- [ ] Handle error state if dish fetch fails
- [ ] Emit onSelect event when dish is chosen (pass dish object to parent)
- [ ] Clear selection after dish is added to order
- [ ] Implement keyboard navigation (Arrow keys, Enter to select, Escape to close)

### Task 2: Create Order Summary Panel Component (AC: Real-time Updates, Quantity Controls, Remove Item)
- [ ] Create file: `app/admin/orders/new/components/OrderSummary.tsx`
- [ ] Implement sticky right sidebar layout (desktop >1024px)
- [ ] Display section title: "סיכום הזמנה" (Order Summary)
- [ ] For each selected item, show card with:
  - Dish name (Hebrew, RTL)
  - Unit type badge
  - Quantity controls (- button, number input, + button)
  - Price calculation: quantity × price_per_unit
  - Remove button (X icon, absolute top-right)
- [ ] Implement quantity controls:
  - Plus button: increment by 1 (max 999)
  - Minus button: decrement by 1 (min 1, disable at 1)
  - Direct input: numbers only, 1-999 range
  - Touch targets: 44px minimum (preparing for tablet Story 1.6)
- [ ] Calculate and display total:
  - Total items count: sum of all quantities
  - Total price: sum of (quantity × price_per_unit) for all items
  - Format: "סה\"כ פריטים: X | סה\"כ: ₪XX.XX"
- [ ] Handle empty state: "טרם נוספו פריטים" (No items added yet)
- [ ] Update parent form state on any quantity change or item removal

### Task 3: Integrate Menu Selector and Order Summary into Main Form (AC: Form Integration, At Least One Item)
- [ ] In `app/admin/orders/new/page.tsx`:
  - Add items field to form state (array of {dish_id, quantity})
  - Import MenuItemSelector and OrderSummary components
  - Add menu selection section between pickup time and submit button
  - Pass items array to OrderSummary
  - Implement onAddItem handler (append to items array)
  - Implement onUpdateQuantity handler (update items array by dish_id)
  - Implement onRemoveItem handler (filter out from items array)
- [ ] Add form validation:
  - Require at least one item in items array
  - Show error message "יש להוסיף לפחות פריט אחד" when items.length === 0 on submit attempt
  - Disable submit button when items.length === 0

### Task 4: Implement Order Submission Logic (AC: API Call, Success Toast, Redirect)
- [ ] Update form submission handler in `app/admin/orders/new/page.tsx`:
  - Remove TODO comment from Story 1.5a stub
  - Prepare order payload:
    ```typescript
    {
      customer_name: string,
      customer_phone: string | undefined,
      pickup_time: string (ISO datetime),
      notes: string | undefined,
      source: 'manual',
      items: [{ dish_id: UUID, quantity: number }]
    }
    ```
  - Call POST `/api/orders` with order payload
  - Handle success response (returns order with order_number)
  - Show success toast: "הזמנה #{order_number} נוצרה בהצלחה"
  - Wait 2 seconds, then redirect to `/admin/orders` using Next.js router
- [ ] Handle API errors:
  - Network errors: "שגיאת רשת. אנא נסה שוב"
  - Validation errors: Display specific field errors from API
  - Server errors: "שגיאה ביצירת ההזמנה. אנא נסה שוב"
  - Keep form populated on error (don't clear)
- [ ] Add loading state during submission:
  - Disable all form inputs
  - Show loading spinner on submit button
  - Button text changes to "שומר..." (Saving...)

### Task 5: Update Submit Button Styling and Behavior (AC: Enabled/Disabled States, Visual Prominence)
- [ ] In `app/admin/orders/new/page.tsx`:
  - Remove disabled state and placeholder text from Story 1.5a
  - Update button text to "שמור הזמנה" (Save Order)
  - Remove "(1.5b)" suffix
  - Implement conditional styling:
    - Enabled (items.length > 0): bg-green-600 hover:bg-green-700 (prominent green)
    - Disabled (items.length === 0): bg-gray-400 cursor-not-allowed opacity-50
  - Add aria-label: "שמור הזמנה חדשה" (Save new order)
  - Keep keyboard shortcut: Ctrl+Enter to submit (when enabled)

### Task 6: Add Toast Notifications (AC: Success/Error Messages)
- [ ] Install Toast component if not available: `npx shadcn@latest add toast` and `npx shadcn@latest add sonner`
- [ ] Import toast hook from shadcn/ui
- [ ] Configure toast provider in layout (if not already configured in Story 1.3)
- [ ] Implement toast notifications:
  - Success toast: Green background, checkmark icon, order number
  - Error toast: Red background, error icon, error message
  - Auto-dismiss after 5 seconds for success, 8 seconds for errors
  - Hebrew text direction (RTL)

### Task 7: Add Form Reset and Navigation (AC: Redirect, Form State Management)
- [ ] Implement form reset after successful submission:
  - Clear all form fields
  - Clear items array
  - Reset to default pickup time
  - Reset validation state
- [ ] Implement router navigation using Next.js useRouter
- [ ] Add confirmation dialog for "Cancel" button:
  - Message: "האם אתה בטוח שברצונך לבטל?" (Are you sure you want to cancel?)
  - Confirm: Clear form and return to `/admin/orders`
  - Cancel: Stay on page
- [ ] Update breadcrumb to be clickable (already implemented in 1.5a)

### Task 8: Test Complete Order Creation Flow (AC: All)
- [ ] Manual testing checklist:
  - [ ] Page loads with customer details form from 1.5a
  - [ ] Menu selector shows all active dishes
  - [ ] Search filters dishes by name (Hebrew)
  - [ ] Selected dish appears in order summary
  - [ ] Quantity controls work (+, -, direct input)
  - [ ] Remove item button works
  - [ ] Multiple items can be added
  - [ ] Total items and price calculate correctly
  - [ ] Submit button is disabled with no items
  - [ ] Error message shows when trying to submit without items
  - [ ] Submit button enables when items added
  - [ ] Form submission calls POST /api/orders with correct payload
  - [ ] Success toast shows with order number
  - [ ] Redirect to /admin/orders after 2 seconds
  - [ ] Error handling works for API failures
  - [ ] Loading state shows during submission
  - [ ] Form preserves data on error
  - [ ] Cancel button clears form with confirmation
- [ ] Update test plan: `docs/testing/story-1-5b-test-plan.md`
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari)

## Dev Notes

### Critical Context from Previous Stories

**From Story 1.5a (Order Creation Form - Customer Details):**
- ✅ Form structure established at `/app/admin/orders/new/page.tsx`
- ✅ react-hook-form with Zod validation already configured
- ✅ Customer details fields implemented: customer_name, customer_phone, pickup_time, notes
- ✅ Hebrew RTL support throughout
- ✅ Form validation with Hebrew error messages
- ✅ WCAG 2.1 AA accessibility compliance (aria-live, aria-required, aria-invalid)
- ✅ Business hours validation with override capability
- ✅ Submit button currently disabled with placeholder text "(1.5b)"
- ✅ Form state managed with react-hook-form in page component
- ✅ Validation schema in `lib/validation/schemas/order-form-schema.ts`
- ✅ **IMPORTANT**: Form onSubmit already wired up with stub (`console.log` only) - we extend this

**From Story 1.4 (Orders API):**
- ✅ POST `/api/orders` endpoint accepts:
  ```typescript
  {
    customer_name: string,      // required, 2-100 chars
    customer_phone?: string,    // optional, Israeli format /^05\d{8}$/
    pickup_time: string,        // required, ISO datetime, future
    source: 'manual',           // required enum value for manual orders
    notes?: string,             // optional, max 500 chars
    items: [{                   // required array, min 1 item
      dish_id: UUID,            // required, must exist in dishes table
      quantity: number          // required, integer > 0
    }]
  }
  ```
- ✅ Response format:
  ```typescript
  {
    id: UUID,
    order_number: number,       // auto-generated sequential number
    customer_name: string,
    customer_phone: string | null,
    pickup_time: string,
    status: 'created',
    source: 'manual',
    notes: string | null,
    created_at: string,
    items: [{
      id: UUID,
      dish_id: UUID,
      quantity: number,
      dish: {
        name: string,
        unit_type: 'unit' | 'weight',
        price_per_unit: number
      }
    }]
  }
  ```
- ✅ Error responses (400/404/500) include: `{ error: { code: string, message: string, details?: object } }`

**From Story 1.3 (Desktop Menu UI):**
- ✅ GET `/api/menu` endpoint returns active dishes:
  ```typescript
  [{
    id: UUID,
    name: string,              // Hebrew dish name
    unit_type: 'unit' | 'weight',
    price_per_unit: number,    // in NIS (₪)
    is_active: boolean,
    created_at: string,
    updated_at: string
  }]
  ```
- ✅ Form pattern established with react-hook-form + Zod
- ✅ Toast notifications configured (if available from Story 1.3)
- ✅ Admin layout at `/app/admin/layout.tsx`

**From Story 1.2 (Menu Database & API):**
- ✅ Dishes table structure known
- ✅ unit_type ENUM: 'unit' | 'weight'
- ✅ All prices in NIS (₪)

**From Story 1.1 (Project Initialization):**
- ✅ Next.js 15 App Router with TypeScript
- ✅ Tailwind CSS with RTL support
- ✅ shadcn/ui component library
- ✅ Supabase client configured

### Architecture Requirements

**UI/UX Guidelines (From architecture.md):**
- **Desktop Layout:** >1024px, max-width container (1200px), centered
- **Touch Targets:** 44px minimum for +/- buttons (preparing for tablet use in Story 1.6)
- **Spacing:** 8px minimum between interactive elements
- **RTL Support:** All Hebrew text must use `dir="rtl"`
- **Form Validation:** Real-time validation on blur, submission validation on submit
- **Keyboard Navigation:** Full keyboard support (Tab, Enter, Escape, Arrow keys)
- **Loading States:** Show loading indicators for all async operations
- **Error Handling:** Hebrew error messages, preserve form state on error

**API Integration Pattern:**
- Use fetch or axios for API calls
- Handle loading, success, error states
- Show toast notifications for user feedback
- Redirect after successful operations
- Preserve form data on errors for retry

**Data Fetching Pattern:**
- Use React Query or SWR for GET requests (dishes list)
- Handle stale data and refetching
- Cache active dishes list
- Show loading skeleton while fetching

**Form State Management:**
- Extend existing react-hook-form instance in page.tsx
- Add items array to form state: `items: { dish_id: string, quantity: number }[]`
- Validation: items.length >= 1
- Update form on item add/remove/quantity change

### Component Patterns

**Searchable Dropdown Pattern (shadcn/ui Combobox):**
```typescript
// app/admin/orders/new/components/MenuItemSelector.tsx
'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Dish {
  id: string
  name: string
  unit_type: 'unit' | 'weight'
  price_per_unit: number
}

interface MenuItemSelectorProps {
  onSelectItem: (dish: Dish) => void
}

export function MenuItemSelector({ onSelectItem }: MenuItemSelectorProps) {
  const [open, setOpen] = useState(false)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch dishes on mount
  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setDishes(data.filter(d => d.is_active))
        setLoading(false)
      })
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between" dir="rtl">
          בחר פריט מהתפריט
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="חפש פריט..." dir="rtl" />
          <CommandEmpty>לא נמצאו פריטים</CommandEmpty>
          <CommandGroup>
            {dishes.map((dish) => (
              <CommandItem
                key={dish.id}
                value={dish.name}
                onSelect={() => {
                  onSelectItem(dish)
                  setOpen(false)
                }}
                dir="rtl"
              >
                <Check className="mr-2 h-4 w-4 opacity-0" />
                <span className="flex-1">{dish.name}</span>
                <span className="text-xs text-muted-foreground">
                  {dish.unit_type === 'unit' ? 'יחידה' : 'משקל'} | ₪{dish.price_per_unit}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

**Order Summary Panel Pattern:**
```typescript
// app/admin/orders/new/components/OrderSummary.tsx
'use client'

import { Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface OrderItem {
  dish_id: string
  dish_name: string
  unit_type: 'unit' | 'weight'
  price_per_unit: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  onUpdateQuantity: (dishId: string, quantity: number) => void
  onRemoveItem: (dishId: string) => void
}

export function OrderSummary({ items, onUpdateQuantity, onRemoveItem }: OrderSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.price_per_unit), 0)

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        טרם נוספו פריטים
      </div>
    )
  }

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold">סיכום הזמנה</h3>

      {items.map((item) => (
        <div key={item.dish_id} className="relative border rounded-lg p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-6 w-6"
            onClick={() => onRemoveItem(item.dish_id)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="mb-2">
            <p className="font-medium">{item.dish_name}</p>
            <p className="text-sm text-muted-foreground">
              {item.unit_type === 'unit' ? 'יחידה' : 'משקל'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => onUpdateQuantity(item.dish_id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>

            <Input
              type="number"
              min="1"
              max="999"
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                if (val >= 1 && val <= 999) {
                  onUpdateQuantity(item.dish_id, val)
                }
              }}
              className="h-11 w-16 text-center"
            />

            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => onUpdateQuantity(item.dish_id, Math.min(999, item.quantity + 1))}
              disabled={item.quantity >= 999}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <span className="text-sm text-muted-foreground mr-auto">
              ₪{(item.quantity * item.price_per_unit).toFixed(2)}
            </span>
          </div>
        </div>
      ))}

      <div className="border-t pt-4 font-semibold">
        <p>סה"כ פריטים: {totalItems}</p>
        <p>סה"כ: ₪{totalPrice.toFixed(2)}</p>
      </div>
    </div>
  )
}
```

**Form Integration in Main Page:**
```typescript
// app/admin/orders/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { MenuItemSelector } from './components/MenuItemSelector'
import { OrderSummary } from './components/OrderSummary'
import { orderFormSchema, type OrderFormData } from '@/lib/validation/schemas/order-form-schema'

export default function NewOrderPage() {
  const router = useRouter()
  const [items, setItems] = useState<OrderItem[]>([])
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      pickup_time: calculateDefaultPickupTime().toISOString(),
      notes: '',
    },
  })

  const handleAddItem = (dish: Dish) => {
    // Check if dish already in order
    const existing = items.find(item => item.dish_id === dish.id)
    if (existing) {
      // Increment quantity
      setItems(items.map(item =>
        item.dish_id === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // Add new item
      setItems([...items, {
        dish_id: dish.id,
        dish_name: dish.name,
        unit_type: dish.unit_type,
        price_per_unit: dish.price_per_unit,
        quantity: 1,
      }])
    }
  }

  const handleUpdateQuantity = (dishId: string, quantity: number) => {
    setItems(items.map(item =>
      item.dish_id === dishId ? { ...item, quantity } : item
    ))
  }

  const handleRemoveItem = (dishId: string) => {
    setItems(items.filter(item => item.dish_id !== dishId))
  }

  const onSubmit = async (data: OrderFormData) => {
    if (items.length === 0) {
      toast.error('יש להוסיף לפחות פריט אחד')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        ...data,
        source: 'manual' as const,
        items: items.map(item => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
        })),
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'שגיאה ביצירת ההזמנה')
      }

      const order = await response.json()

      toast.success(`הזמנה #${order.order_number} נוצרה בהצלחה`)

      // Reset form
      form.reset()
      setItems([])

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/admin/orders')
      }, 2000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'שגיאת רשת. אנא נסה שוב')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-[1200px] p-6" dir="rtl">
      {/* Existing breadcrumb and title from 1.5a */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Customer Details Section - from 1.5a */}
          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <OrderFormCustomerDetails form={form} />
          </div>

          {/* Pickup Time Section - from 1.5a */}
          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <PickupTimeSelector {...} />
          </div>

          {/* Menu Items Section - NEW in 1.5b */}
          <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">פריטים</h2>
            <MenuItemSelector onSelectItem={handleAddItem} />
            {items.length === 0 && (
              <p className="text-sm text-red-600 mt-2">יש להוסיף לפחות פריט אחד</p>
            )}
            <div className="mt-6">
              <OrderSummary
                items={items}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>
          </div>

          {/* Submit Button - UPDATED in 1.5b */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (confirm('האם אתה בטוח שברצונך לבטל?')) {
                  form.reset()
                  setItems([])
                }
              }}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              disabled={items.length === 0 || submitting}
              className={cn(
                items.length > 0 && !submitting
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed opacity-50'
              )}
              aria-label="שמור הזמנה חדשה"
            >
              {submitting ? 'שומר...' : 'שמור הזמנה'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
```

### File Structure Requirements

**Story 1.5b will create:**
```
app/
  admin/
    orders/
      new/
        components/
          MenuItemSelector.tsx      # NEW: Searchable dish dropdown
          OrderSummary.tsx          # NEW: Order items panel with quantity controls
components/
  ui/
    command.tsx                     # NEW: shadcn Command component (for searchable dropdown)
    toast.tsx                       # NEW (if not exists): shadcn Toast component
    sonner.tsx                      # NEW (if not exists): Sonner toast provider
docs/
  testing/
    story-1-5b-test-plan.md         # NEW: Manual testing checklist
```

**Story 1.5b will modify:**
```
app/
  admin/
    orders/
      new/
        page.tsx                    # MODIFY: Add items state, menu selector, order summary, update submit logic
docs/
  sprint-artifacts/
    sprint-status.yaml              # MODIFY: Update story status from backlog to ready-for-dev
    1-5b-add-menu-item-selector-and-order-submission.md  # MODIFY: Mark tasks complete, add notes
```

**Dependencies:**
- Form structure from Story 1.5a (`app/admin/orders/new/page.tsx`)
- Customer details component from Story 1.5a
- Pickup time selector from Story 1.5a
- Validation schema from Story 1.5a (`lib/validation/schemas/order-form-schema.ts`)
- POST /api/orders from Story 1.4
- GET /api/menu from Story 1.3
- shadcn/ui components (Button, Form, Input from earlier stories)

### Testing Requirements

**Manual Testing (This Story):**
1. Load `/admin/orders/new` - verify form loads with customer details from 1.5a
2. Click menu selector - verify dropdown shows active dishes in Hebrew
3. Type in search - verify filtering works for Hebrew text
4. Select a dish - verify it appears in order summary with quantity 1
5. Click + button - verify quantity increments
6. Click - button - verify quantity decrements (min 1)
7. Type in quantity input - verify only numbers accepted, range 1-999
8. Click X button - verify item removed from order
9. Add multiple different dishes - verify all appear in summary
10. Verify total items count and total price calculate correctly
11. Try to submit with no items - verify button disabled and error message shows
12. Add items - verify button enables and turns green
13. Fill all required fields and submit - verify:
    - Loading state shows (button text "שומר...", inputs disabled)
    - Success toast appears with order number
    - Redirect to /admin/orders after 2 seconds
14. Test error scenarios:
    - Disconnect network - verify error toast shows
    - Invalid data - verify API errors display in Hebrew
    - Verify form preserves data on error
15. Test Cancel button - verify confirmation dialog and form clear

**Test Script Location:** `docs/testing/story-1-5b-test-plan.md`

**Automated Testing (Future - Epic 5):**
- Unit tests for MenuItemSelector component
- Unit tests for OrderSummary component
- Integration tests for order submission flow
- E2E tests for complete order creation (1.5a + 1.5b combined)

### Success Criteria

**Story is complete when:**
1. ✅ Menu selector shows all active dishes in searchable Hebrew dropdown
2. ✅ Selected dishes appear in order summary
3. ✅ Quantity controls work (+, -, direct input, 1-999 range)
4. ✅ Remove item button works
5. ✅ Total items and price calculate correctly
6. ✅ Submit button disabled when no items
7. ✅ Error message shows when trying to submit without items
8. ✅ Submit button enables and turns green when items added
9. ✅ Form submission calls POST /api/orders with correct payload
10. ✅ Success toast shows with order number
11. ✅ Redirect to /admin/orders works after 2 seconds
12. ✅ Loading state shows during submission
13. ✅ Error handling works for API failures
14. ✅ Form preserves data on error for retry
15. ✅ Cancel button works with confirmation
16. ✅ Manual testing confirms all flows work
17. ✅ Cross-browser testing passes (Chrome, Firefox, Safari)

### Integration with Story 1.5a

Story 1.5a created the **foundation** - customer details form, pickup time, validation.

Story 1.5b **completes** the order creation by adding:
- Menu item selector (searchable dropdown)
- Order summary panel (items list with quantity controls)
- Submit button logic (API call to POST /api/orders)
- Success/error toast notifications
- Redirect to orders list
- Complete order creation flow

**Combined Flow (1.5a + 1.5b):**
1. User navigates to `/admin/orders/new`
2. Customer name field auto-focuses (1.5a)
3. User fills: customer name, phone (optional), pickup time, notes (1.5a)
4. User selects menu items from dropdown (1.5b)
5. User adjusts quantities in order summary (1.5b)
6. User clicks "שמור הזמנה" button (1.5b)
7. Order created with `source='manual'` (1.5b)
8. Success toast shows with order number (1.5b)
9. User redirected to `/admin/orders` (1.5b)

### References

- [Source: docs/epics.md - Epic 1, Story 1.5b]
- [Source: docs/sprint-artifacts/1-5a-build-desktop-order-creation-form.md - Form Foundation]
- [Source: docs/sprint-artifacts/1-4-create-orders-database-schema-and-manual-order-entry-api.md - POST /api/orders Endpoint]
- [Source: docs/sprint-artifacts/1-3-build-desktop-menu-management-ui.md - GET /api/menu Endpoint]
- [Source: docs/architecture.md - UI/UX Guidelines]

## Dev Agent Record

### Context Reference

**Story Dependencies:**
- Story 1.5a: Order creation form foundation (customer details, pickup time, validation)
- Story 1.4: POST /api/orders endpoint for order submission
- Story 1.3: GET /api/menu endpoint for fetching active dishes
- Story 1.2: Dishes database schema and data model
- Story 1.1: Next.js project structure, shadcn/ui setup

**Key Files to Reference:**
- `app/admin/orders/new/page.tsx` - Main form page (extends with items logic)
- `lib/validation/schemas/order-form-schema.ts` - Form validation (reference for consistency)
- `app/api/orders/route.ts` - Order creation endpoint from Story 1.4
- `app/api/menu/route.ts` - Menu fetch endpoint from Story 1.3

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

<!-- Will be added during implementation -->

### Completion Notes List

<!-- Will be added during implementation -->

### File List

**Will Create:**
- `app/admin/orders/new/components/MenuItemSelector.tsx`
- `app/admin/orders/new/components/OrderSummary.tsx`
- `components/ui/command.tsx` (via shadcn)
- `components/ui/toast.tsx` (via shadcn, if not exists)
- `components/ui/sonner.tsx` (via shadcn, if not exists)
- `docs/testing/story-1-5b-test-plan.md`

**Will Modify:**
- `app/admin/orders/new/page.tsx` (add items state, menu selector, order summary, submit logic)
- `docs/sprint-artifacts/sprint-status.yaml` (status update)
- `docs/sprint-artifacts/1-5b-add-menu-item-selector-and-order-submission.md` (task completion)

**Will Reference:**
- `lib/validation/schemas/order-form-schema.ts` (validation patterns)
- `app/admin/orders/new/components/OrderFormCustomerDetails.tsx` (from 1.5a)
- `app/admin/orders/new/components/PickupTimeSelector.tsx` (from 1.5a)
