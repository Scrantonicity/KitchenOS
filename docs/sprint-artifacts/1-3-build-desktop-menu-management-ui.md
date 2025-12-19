# Story 1.3: Build Desktop Menu Management UI

Status: drafted

## Story

As Yaron,
I want to manage menu items (add, edit, deactivate) from my desktop,
So that I can maintain an up-to-date menu without developer help.

## Acceptance Criteria

**Given** I'm on the desktop at `/admin/menu`
**When** the page loads
**Then** I see a list of all menu items showing name, unit type, price, and active status
**And** I see an "Add Menu Item" button

**When** I click "Add Menu Item"
**Then** a form appears with fields: name (Hebrew), unit type (dropdown), price per unit
**And** I can submit the form with keyboard (Enter key)

**When** I submit a valid menu item
**Then** the item appears in the list immediately
**And** I see a success message

**When** I click "Edit" on an existing item
**Then** the form pre-fills with current values
**And** I can update and save changes

**When** I click "Deactivate" on an item
**Then** a confirmation dialog appears
**And** after confirming, the item is marked inactive (grayed out in list)

**When** any API call fails
**Then** I see a clear error message in Hebrew
**And** the form remains populated with my input

**UI Requirements:**
- Desktop-optimized layout (>1024px)
- Keyboard-friendly input with tab order
- Hebrew RTL text direction
- Form validation: required fields, positive price values
- Loading states for all async operations

## Tasks / Subtasks

### Task 1: Install Required shadcn/ui Components (AC: UI Requirements)
- [ ] Install Button component: `npx shadcn@latest add button`
- [ ] Install Table component: `npx shadcn@latest add table`
- [ ] Install Form components: `npx shadcn@latest add form`
- [ ] Install Input component: `npx shadcn@latest add input`
- [ ] Install Select component: `npx shadcn@latest add select`
- [ ] Install Dialog component: `npx shadcn@latest add dialog`
- [ ] Install Toast component: `npx shadcn@latest add toast`
- [ ] Install Label component: `npx shadcn@latest add label`
- [ ] Verify all components installed in `components/ui/`

### Task 2: Create Hebrew Error Message Translation Module (AC: Error Handling)
- [ ] Create file: `lib/errors/messages.ts`
- [ ] Define `hebrewErrorMessages` object with mappings:
  - `VALIDATION_ERROR`: "שגיאה באימות נתונים"
  - `DATABASE_ERROR`: "שגיאה בשמירת הנתונים"
  - `NOT_FOUND`: "הפריט לא נמצא"
  - `NETWORK_ERROR`: "בעיית תקשורת עם השרת"
- [ ] Export utility function: `translateError(code: string): string`
- [ ] Add fallback for unknown codes: "שגיאה כללית"

### Task 3: Create Menu Management Page Component (AC: 1-2)
- [ ] Create file: `app/admin/menu/page.tsx`
- [ ] Set as Server Component (NO 'use client' directive)
- [ ] Fetch initial menu items using `createClient()` from `@/lib/supabase/server`
- [ ] Query: `SELECT * FROM dishes ORDER BY name`
- [ ] Pass data to Client Component for interactive features
- [ ] Set page metadata:
  ```typescript
  export const metadata = {
    title: 'ניהול תפריט | KitchenOS',
    description: 'ניהול פריטי תפריט'
  }
  ```

### Task 4: Create Menu Table Client Component (AC: 1, 4, 5)
- [ ] Create file: `components/menu/menu-table.tsx`
- [ ] Add 'use client' directive (needs interactivity)
- [ ] Import shadcn/ui Table components
- [ ] Implement table columns:
  - Column 1: **שם הפריט** (name) - Hebrew RTL
  - Column 2: **סוג יחידה** (unit_type) - Display "יחידה" or "משקל"
  - Column 3: **מחיר** (price_per_unit) - Format as ₪{price}
  - Column 4: **סטטוס** (is_active) - Display "פעיל" or "לא פעיל"
  - Column 5: **פעולות** (actions) - Edit and Deactivate buttons
- [ ] Style inactive items with `opacity-50` and `line-through`
- [ ] Add `dir="rtl"` to table for Hebrew layout
- [ ] Implement Edit button click handler (opens form dialog)
- [ ] Implement Deactivate button click handler (opens confirmation)

### Task 5: Create Menu Item Form Component (AC: 2-3, 4)
- [ ] Create file: `components/menu/menu-item-form.tsx`
- [ ] Add 'use client' directive
- [ ] Use React Hook Form with Zod validation
- [ ] Import `dishSchema` from `@/lib/validation/schemas/dish-schema`
- [ ] Implement form fields:
  - **שם הפריט** (name): Input with Hebrew placeholder
  - **סוג יחידה** (unit_type): Select dropdown with options:
    - "יחידה" (unit)
    - "משקל" (weight)
  - **מחיר ליחידה** (price_per_unit): Number input with ₪ prefix
- [ ] Add form validation:
  - name: required, min 1 character
  - unit_type: required enum
  - price_per_unit: required, positive number, max 2 decimals
- [ ] Display validation errors in Hebrew below each field
- [ ] Implement keyboard submit (Enter key triggers form submit)
- [ ] Add loading state during submission (disable form, show spinner)
- [ ] Clear form after successful creation
- [ ] Maintain form values after error (don't clear on failure)

### Task 6: Implement Create Menu Item Logic (AC: 3)
- [ ] Create file: `lib/api/menu.ts` for client-side API calls
- [ ] Implement `createMenuItem(data: DishInsert)` function:
  - POST to `/api/menu` with validated data
  - Return `{ data, error }` structure
  - Handle network errors gracefully
- [ ] In form component, call `createMenuItem` on submit
- [ ] On success:
  - Show success toast in Hebrew: "הפריט נוסף בהצלחה"
  - Invalidate React Query cache (or trigger re-fetch)
  - Clear form fields
  - Close dialog
- [ ] On error:
  - Translate error code to Hebrew using `translateError()`
  - Display error message in toast
  - Keep form populated
  - Re-enable form for retry

### Task 7: Implement Update Menu Item Logic (AC: 4)
- [ ] In `lib/api/menu.ts`, add `updateMenuItem(id: string, data: DishUpdate)` function:
  - PATCH to `/api/menu/${id}` with validated data
  - Return `{ data, error }` structure
- [ ] In Menu Table component:
  - Add state for selected item: `const [selectedItem, setSelectedItem] = useState<Dish | null>(null)`
  - On Edit click, set `selectedItem` to current row data
  - Pass `selectedItem` to form component as initial values
- [ ] In form component:
  - Detect edit mode: `const isEdit = !!selectedItem`
  - Pre-fill form fields with `selectedItem` values
  - Change submit button text to "עדכן" (Update) in edit mode
  - Call `updateMenuItem` instead of `createMenuItem`
- [ ] On success:
  - Show success toast: "הפריט עודכן בהצלחה"
  - Update table row without full refresh
  - Close dialog
- [ ] On error:
  - Translate and display error
  - Keep form populated for retry

### Task 8: Implement Deactivate (Soft Delete) Logic (AC: 5)
- [ ] In `lib/api/menu.ts`, add `deactivateMenuItem(id: string)` function:
  - DELETE to `/api/menu/${id}`
  - Return `{ success, error }` structure
- [ ] Create confirmation dialog component:
  - Use shadcn/ui AlertDialog
  - Title: "האם אתה בטוח?" (Are you sure?)
  - Description: "פריט זה יסומן כלא פעיל ולא יופיע בהזמנות חדשות" (This item will be marked inactive and won't appear in new orders)
  - Actions: "ביטול" (Cancel) and "אישור" (Confirm)
- [ ] In Menu Table:
  - Add state: `const [itemToDeactivate, setItemToDeactivate] = useState<string | null>(null)`
  - On Deactivate click, set `itemToDeactivate` to item id
  - On confirm, call `deactivateMenuItem(itemToDeactivate)`
- [ ] On success:
  - Show success toast: "הפריט הושבת בהצלחה"
  - Update table to show item as inactive (grayed out)
- [ ] On error:
  - Translate and display error
  - Keep dialog open for retry

### Task 9: Add React Query for Data Fetching (AC: 3, 4, 5 - Immediate Updates)
- [ ] Install @tanstack/react-query: `npm install @tanstack/react-query`
- [ ] Create file: `app/providers.tsx`
- [ ] Set up QueryClientProvider:
  ```typescript
  'use client'
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
  import { useState } from 'react'

  export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
  ```
- [ ] Wrap app in `app/layout.tsx` with `<Providers>`
- [ ] Create custom hook: `hooks/use-menu-items.ts`
- [ ] Implement `useMenuItems()` hook:
  - Use `useQuery` to fetch menu items from `/api/menu`
  - Query key: `['menu-items']`
  - Enable automatic refetching on window focus
- [ ] Implement `useCreateMenuItem()` mutation hook:
  - Use `useMutation` with `createMenuItem` function
  - On success, invalidate `['menu-items']` query
- [ ] Implement `useUpdateMenuItem()` mutation hook
- [ ] Implement `useDeactivateMenuItem()` mutation hook
- [ ] Use hooks in Menu Table component for automatic updates

### Task 10: Add Toaster Component for User Feedback (AC: 3, 4, 5, 6)
- [ ] Create file: `components/ui/toaster.tsx` (if not auto-created by shadcn)
- [ ] Add Toaster component to root layout: `app/layout.tsx`
- [ ] Import and render `<Toaster />` before closing body tag
- [ ] Configure toast defaults:
  - Duration: 3000ms (3 seconds)
  - Position: bottom-right (RTL-friendly)
- [ ] Use `toast()` function in all success/error scenarios:
  - Success: `toast.success('הפריט נוסף בהצלחה')`
  - Error: `toast.error(translateError(error.code))`

### Task 11: Implement RTL Layout and Hebrew Typography (AC: UI Requirements)
- [ ] In `app/admin/menu/page.tsx`:
  - Add `dir="rtl"` to main container
  - Add `lang="he"` attribute
- [ ] In `app/globals.css`, add RTL utility classes:
  ```css
  [dir="rtl"] {
    text-align: right;
  }
  ```
- [ ] In Menu Table:
  - Ensure table headers and cells align right
  - Mirror action buttons to left side of row
  - Use `text-right` for all text content
- [ ] In Menu Item Form:
  - Align labels to right
  - Position input text to right
  - Use Hebrew placeholders:
    - שם: "למשל: קובנה, חלה..."
    - מחיר: "למשל: 8.00"

### Task 12: Add Loading States (AC: UI Requirements)
- [ ] In Menu Table:
  - Show skeleton rows while React Query is loading
  - Use shadcn/ui Skeleton component
  - Display 5 skeleton rows with shimmer animation
- [ ] In Menu Item Form:
  - Disable all form fields during submission
  - Show spinner icon on submit button
  - Change button text to "שומר..." (Saving...)
- [ ] In Deactivate Dialog:
  - Disable confirm button during API call
  - Show spinner on button
  - Prevent dialog close during operation

### Task 13: Add "Add Menu Item" Button and Dialog (AC: 2)
- [ ] In Menu Table component:
  - Add header section above table
  - Add "הוסף פריט חדש" (Add Menu Item) button
  - Use shadcn/ui Button with variant="default"
  - Position button in top-left (RTL: top-right)
- [ ] Wrap Menu Item Form in shadcn/ui Dialog:
  - DialogTrigger: "Add Menu Item" button
  - DialogContent: Form component
  - DialogHeader: "הוסף פריט חדש" (Add) or "ערוך פריט" (Edit)
  - DialogDescription: Context-appropriate text
- [ ] Implement dialog open/close state:
  - Open on "Add" button click
  - Open on "Edit" button click (with pre-filled data)
  - Close on successful submit
  - Close on cancel button
  - Keep open on error

### Task 14: Implement Keyboard Navigation (AC: UI Requirements)
- [ ] In Menu Item Form:
  - Ensure natural tab order: name → unit_type → price_per_unit → submit
  - Add `autoFocus` to name field when dialog opens
  - Enable Enter key submit (already handled by form component)
  - Enable Escape key to close dialog
- [ ] In Menu Table:
  - Make action buttons focusable with keyboard
  - Add visible focus rings: `focus:ring-2 focus:ring-blue-500`
  - Support Tab navigation through table rows

### Task 15: Add Form Validation Error Display (AC: 6)
- [ ] In Menu Item Form component:
  - Use React Hook Form's error state
  - Display field-specific errors below each input
  - Use Hebrew error messages:
    - name required: "שם הפריט הוא שדה חובה"
    - unit_type required: "יש לבחור סוג יחידה"
    - price_per_unit required: "מחיר הוא שדה חובה"
    - price_per_unit positive: "המחיר חייב להיות מספר חיובי"
    - price_per_unit decimals: "המחיר יכול לכלול עד 2 ספרות אחרי הנקודה"
- [ ] Style error text: `text-red-500 text-sm mt-1`
- [ ] Add error icon next to invalid fields
- [ ] Validate on blur and on submit (not on every keystroke)

### Task 16: Test All CRUD Operations (AC: All)
- [ ] Manual testing checklist:
  - [ ] Page loads and displays existing menu items
  - [ ] "Add Menu Item" button opens form dialog
  - [ ] Form validation works for all fields
  - [ ] Creating new item succeeds and shows in table immediately
  - [ ] Success toast appears after creation
  - [ ] Form clears after successful creation
  - [ ] Edit button pre-fills form with correct data
  - [ ] Updating item succeeds and reflects in table
  - [ ] Deactivate button shows confirmation dialog
  - [ ] Confirming deactivation grays out item in table
  - [ ] All operations show loading states
  - [ ] Error handling works (test by disconnecting network)
  - [ ] Error messages appear in Hebrew
  - [ ] Form retains data after error
  - [ ] Keyboard navigation works throughout
  - [ ] RTL layout displays correctly
  - [ ] All text is in Hebrew except internal codes

## Dev Notes

### Project Structure Notes

**New Files to Create:**
```
app/
├── admin/
│   └── menu/
│       └── page.tsx                    # Server Component - Menu Management Page
├── providers.tsx                       # React Query Provider
components/
├── menu/
│   ├── menu-table.tsx                  # Client Component - Table Display
│   └── menu-item-form.tsx              # Client Component - Create/Edit Form
├── ui/                                 # shadcn/ui components (installed via CLI)
│   ├── button.tsx
│   ├── table.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── dialog.tsx
│   ├── toast.tsx
│   ├── toaster.tsx
│   ├── label.tsx
│   └── skeleton.tsx
lib/
├── api/
│   └── menu.ts                         # Client-side API wrapper functions
├── errors/
│   └── messages.ts                     # Hebrew error message translations
hooks/
└── use-menu-items.ts                   # React Query hooks for menu data
```

**File Modified:**
```
app/
└── layout.tsx                          # Add Providers wrapper and Toaster
```

### Architecture Guardrails (CRITICAL - Read Before Implementation)

**1. Server vs Client Components (Next.js 15 App Router)**

From [project_context.md](project_context.md#L55-L73):

```typescript
// ✅ CORRECT - Server Component (app/admin/menu/page.tsx)
export default async function MenuPage() {
  const supabase = await createClient() // Server client (async)
  const { data: initialData } = await supabase.from('dishes').select('*')

  return <MenuTable initialData={initialData} />
}

// ✅ CORRECT - Client Component (components/menu/menu-table.tsx)
'use client'
export function MenuTable({ initialData }: { initialData: Dish[] }) {
  const { data, isLoading } = useMenuItems() // Can use hooks
  return <Table>...</Table>
}

// ❌ WRONG - Server Component trying to use client features
export default function MenuPage() {
  const [items, setItems] = useState() // ERROR - can't use hooks in Server Component
}
```

**WHY THIS MATTERS:**
- Server Components load initial data WITHOUT client-side JavaScript
- Client Components handle interactivity (forms, buttons, mutations)
- Mixing them incorrectly breaks the entire page

**2. Supabase Client Usage (CRITICAL)**

From [project_context.md](project_context.md#L93-L97):

```typescript
// ✅ CORRECT - Server Component/API Route
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient() // Async function, has cookies access

// ✅ CORRECT - Client Component (browser)
import { createClient } from '@/lib/supabase/client'
const supabase = createClient() // Sync function, uses localStorage

// ❌ WRONG - Using browser client in Server Component
import { createClient } from '@/lib/supabase/client' // Will fail - no localStorage on server
```

**WHY THIS MATTERS:**
- Wrong client = authentication failures and empty data
- Server client requires cookies (only available server-side)
- Browser client requires localStorage (only available client-side)

**3. Hebrew RTL and Error Handling**

From [project_context.md](project_context.md#L149-L165):

```typescript
// ✅ CORRECT - API returns English codes
// app/api/menu/route.ts
return NextResponse.json({
  error: { code: 'VALIDATION_ERROR', details: {...} }
})

// ✅ CORRECT - Client translates to Hebrew
// lib/errors/messages.ts
export const hebrewErrorMessages = {
  'VALIDATION_ERROR': 'שגיאה באימות נתונים',
  'DATABASE_ERROR': 'שגיאה בשמירת הנתונים',
  'NOT_FOUND': 'הפריט לא נמצא'
}

// components/menu/menu-item-form.tsx
toast.error(translateError(error.code)) // Shows Hebrew to user

// ❌ WRONG - Returning Hebrew from API
return NextResponse.json({ error: 'שגיאה באימות' }) // Breaks future i18n
```

**WHY THIS MATTERS:**
- APIs must be language-agnostic for future internationalization
- Hebrew text ONLY in client-side components
- Error codes allow consistent translation

**4. Database Naming Convention (ENFORCED)**

From [project_context.md](project_context.md#L117-L122):

```typescript
// ✅ CORRECT - snake_case in database, API, and queries
const { data } = await supabase.from('dishes').select('name, price_per_unit')

// ✅ CORRECT - TypeScript types use database names
type Dish = {
  name: string
  price_per_unit: number
  is_active: boolean
}

// ❌ WRONG - camelCase doesn't match database
type Dish = {
  name: string
  pricePerUnit: number  // Database column is 'price_per_unit'
  isActive: boolean
}
```

**WHY THIS MATTERS:**
- Supabase auto-generates types with snake_case
- Mismatched names = runtime errors and data loss
- ESLint will FAIL the build if you violate this

**5. Multi-Layer Validation (REQUIRED)**

From [project_context.md](project_context.md#L123-L144):

```typescript
// Layer 1: Client-side validation (immediate feedback)
// components/menu/menu-item-form.tsx
const form = useForm({
  resolver: zodResolver(dishSchema) // Uses same schema as API
})

// Layer 2: API validation (security boundary)
// app/api/menu/route.ts
const result = dishSchema.safeParse(await req.json())
if (!result.success) {
  return NextResponse.json({ error: { code: 'VALIDATION_ERROR' }}, { status: 400 })
}

// Layer 3: Database constraints (data integrity)
// supabase/migrations/001_create_dishes_table.sql
CHECK (price_per_unit > 0)
```

**WHY THIS MATTERS:**
- Client validation = UX (instant feedback)
- API validation = security (can't trust client)
- Database validation = integrity (absolute guarantee)

**6. Touch Targets and Accessibility (Desktop, but still important)**

From [project_context.md](project_context.md#L170-L188):

```tsx
// ✅ CORRECT - Sufficient click targets
<Button className="min-h-10 px-4"> {/* 40px minimum for desktop */}
  ערוך
</Button>

// ✅ CORRECT - Keyboard accessibility
<Button
  onClick={handleEdit}
  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
  className="focus:ring-2 focus:ring-blue-500"
>
  ערוך
</Button>

// ❌ WRONG - Too small for comfortable clicking
<Button className="p-1"> {/* Only 4px */}
  ערוך
</Button>
```

**WHY THIS MATTERS:**
- Desktop users expect standard 40px+ click targets
- Keyboard navigation is accessibility requirement
- Proper focus indicators prevent confusion

### React Query Integration Pattern

**Why React Query?**
- Automatic cache invalidation after mutations
- Optimistic updates for instant UI feedback
- Built-in loading and error states
- Eliminates manual refetch logic

**Standard Pattern:**
```typescript
// hooks/use-menu-items.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createMenuItem, updateMenuItem } from '@/lib/api/menu'

export function useMenuItems() {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const res = await fetch('/api/menu')
      if (!res.ok) throw new Error('Failed to fetch menu items')
      return res.json()
    }
  })
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      // Automatically refetch menu items
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('הפריט נוסף בהצלחה')
    },
    onError: (error: any) => {
      toast.error(translateError(error.code))
    }
  })
}
```

**Usage in Component:**
```typescript
'use client'
export function MenuTable() {
  const { data: menuItems, isLoading } = useMenuItems()
  const createMutation = useCreateMenuItem()

  const handleSubmit = (data: DishInsert) => {
    createMutation.mutate(data)
  }

  if (isLoading) return <Skeleton />
  return <Table data={menuItems} />
}
```

### shadcn/ui Component Usage

**Form Pattern (React Hook Form + Zod):**
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { dishSchema } from '@/lib/validation/schemas/dish-schema'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function MenuItemForm({ defaultValues }: { defaultValues?: Dish }) {
  const form = useForm({
    resolver: zodResolver(dishSchema),
    defaultValues: defaultValues || {
      name: '',
      unit_type: 'unit',
      price_per_unit: 0
    }
  })

  const onSubmit = (data: DishInsert) => {
    // Call mutation
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם הפריט</FormLabel>
              <FormControl>
                <Input placeholder="למשל: קובנה, חלה..." {...field} />
              </FormControl>
              <FormMessage /> {/* Auto-displays Hebrew error from Zod */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>סוג יחידה</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר סוג יחידה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">יחידה</SelectItem>
                  <SelectItem value="weight">משקל</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_per_unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מחיר ליחידה (₪)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="8.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'שומר...' : 'שמור'}
        </Button>
      </form>
    </Form>
  )
}
```

**Dialog Pattern (for Add/Edit):**
```typescript
'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MenuItemForm } from './menu-item-form'

export function MenuItemDialog({ dish }: { dish?: Dish }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{dish ? 'ערוך' : 'הוסף פריט חדש'}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dish ? 'ערוך פריט' : 'הוסף פריט חדש'}</DialogTitle>
        </DialogHeader>
        <MenuItemForm
          defaultValues={dish}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
```

**Confirmation Dialog Pattern (for Deactivate):**
```typescript
'use client'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export function DeactivateConfirmation({ dishId, onConfirm }: { dishId: string, onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">השבת</Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
          <AlertDialogDescription>
            פריט זה יסומן כלא פעיל ולא יופיע בהזמנות חדשות
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ביטול</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>אישור</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

### Hebrew RTL Layout Specifics

**Page-Level RTL:**
```tsx
// app/admin/menu/page.tsx
export default async function MenuPage() {
  return (
    <div dir="rtl" lang="he" className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-right mb-6">ניהול תפריט</h1>
      <MenuTable />
    </div>
  )
}
```

**Table RTL:**
```tsx
// components/menu/menu-table.tsx
<Table dir="rtl">
  <TableHeader>
    <TableRow>
      <TableHead className="text-right">שם הפריט</TableHead>
      <TableHead className="text-right">סוג יחידה</TableHead>
      <TableHead className="text-right">מחיר</TableHead>
      <TableHead className="text-right">סטטוס</TableHead>
      <TableHead className="text-left">פעולות</TableHead> {/* Actions on left in RTL */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {menuItems.map((dish) => (
      <TableRow key={dish.id} className={!dish.is_active ? 'opacity-50' : ''}>
        <TableCell className="text-right">{dish.name}</TableCell>
        <TableCell className="text-right">
          {dish.unit_type === 'unit' ? 'יחידה' : 'משקל'}
        </TableCell>
        <TableCell className="text-right">₪{dish.price_per_unit.toFixed(2)}</TableCell>
        <TableCell className="text-right">
          {dish.is_active ? 'פעיל' : 'לא פעיל'}
        </TableCell>
        <TableCell className="text-left space-x-2 space-x-reverse">
          <Button variant="outline" size="sm">ערוך</Button>
          <Button variant="destructive" size="sm">השבת</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Note on `space-x-reverse`:**
- Tailwind's `space-x-*` utilities add margin-left by default
- `space-x-reverse` flips it to margin-right for RTL layouts
- Use for horizontal button groups, breadcrumbs, etc.

### Client-Side API Wrapper Pattern

```typescript
// lib/api/menu.ts
import type { DishInsert, DishUpdate } from '@/lib/types/supabase'

export async function createMenuItem(data: DishInsert) {
  const res = await fetch('/api/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const json = await res.json()

  if (!res.ok) {
    throw { code: json.error?.code || 'NETWORK_ERROR', message: json.error?.message }
  }

  return json.data
}

export async function updateMenuItem(id: string, data: DishUpdate) {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })

  const json = await res.json()

  if (!res.ok) {
    throw { code: json.error?.code || 'NETWORK_ERROR', message: json.error?.message }
  }

  return json.data
}

export async function deactivateMenuItem(id: string) {
  const res = await fetch(`/api/menu/${id}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    const json = await res.json()
    throw { code: json.error?.code || 'NETWORK_ERROR', message: json.error?.message }
  }

  return { success: true }
}
```

**WHY THIS PATTERN:**
- Centralized error handling
- Type-safe request/response
- Easy to mock for testing
- Separates API logic from UI logic

### Error Translation Utility

```typescript
// lib/errors/messages.ts

export const hebrewErrorMessages: Record<string, string> = {
  // API Error Codes
  'VALIDATION_ERROR': 'שגיאה באימות נתונים. אנא בדוק את הפרטים שהזנת.',
  'DATABASE_ERROR': 'שגיאה בשמירת הנתונים. אנא נסה שוב.',
  'NOT_FOUND': 'הפריט לא נמצא במערכת.',
  'NETWORK_ERROR': 'בעיית תקשורת עם השרת. אנא בדוק את החיבור לאינטרנט.',

  // Validation Error Messages (for forms)
  'name_required': 'שם הפריט הוא שדה חובה',
  'unit_type_required': 'יש לבחור סוג יחידה',
  'price_required': 'מחיר הוא שדה חובה',
  'price_positive': 'המחיר חייב להיות מספר חיובי',
  'price_decimals': 'המחיר יכול לכלול עד 2 ספרות אחרי הנקודה'
}

export function translateError(code: string): string {
  return hebrewErrorMessages[code] || 'שגיאה כללית. אנא נסה שוב.'
}
```

### Loading State Patterns

**Table Loading (Skeleton):**
```tsx
// components/menu/menu-table.tsx
import { Skeleton } from '@/components/ui/skeleton'

function MenuTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>שם הפריט</TableHead>
          <TableHead>סוג יחידה</TableHead>
          <TableHead>מחיר</TableHead>
          <TableHead>סטטוס</TableHead>
          <TableHead>פעולות</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-8 w-24" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function MenuTable() {
  const { data: menuItems, isLoading } = useMenuItems()

  if (isLoading) return <MenuTableSkeleton />

  return <Table>...</Table>
}
```

**Button Loading (Spinner):**
```tsx
// components/menu/menu-item-form.tsx
import { Loader2 } from 'lucide-react'

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
  {isSubmitting ? 'שומר...' : 'שמור'}
</Button>
```

### Testing Checklist (Manual for MVP)

**Functional Testing:**
1. Navigate to `/admin/menu` - page loads without errors
2. Click "הוסף פריט חדש" - dialog opens
3. Fill form with valid data - form accepts input
4. Submit form - new item appears in table immediately
5. Success toast appears in Hebrew
6. Form clears after submission
7. Click "ערוך" on existing item - form pre-fills
8. Update data and submit - table updates
9. Click "השבת" on item - confirmation dialog appears
10. Confirm deactivation - item grays out in table
11. Test validation errors:
    - Empty name → error appears in Hebrew
    - Negative price → error appears
    - Non-numeric price → error appears
12. Test error handling:
    - Disconnect network → error toast appears in Hebrew
    - Form retains data after error
13. Test keyboard navigation:
    - Tab through form fields
    - Enter key submits form
    - Escape key closes dialog
14. Test RTL layout:
    - All text aligns right
    - Action buttons on left side of rows
    - Dialog text flows right-to-left

**Visual Testing:**
1. Inactive items show `opacity-50` and grayed out
2. Loading skeletons appear during data fetch
3. Submit buttons show spinner during operation
4. Toast notifications appear in bottom-right
5. Form validation errors appear below fields
6. Focus rings visible on keyboard navigation

### References

- [Epic 1, Story 1.3 - docs/epics.md:547-583](docs/epics.md#L547-L583)
- [FR15-FR19: Menu & Item Management - docs/epics.md:43-49](docs/epics.md#L43-L49)
- [Server vs Client Components - docs/project_context.md:55-73](docs/project_context.md#L55-L73)
- [Hebrew RTL & i18n Rules - docs/project_context.md:149-165](docs/project_context.md#L149-L165)
- [Database Naming Convention - docs/project_context.md:117-122](docs/project_context.md#L117-L122)
- [Multi-Layer Validation - docs/project_context.md:123-144](docs/project_context.md#L123-L144)
- [Story 1.2 Implementation - docs/sprint-artifacts/1-2-create-menu-management-database-schema-and-api.md](docs/sprint-artifacts/1-2-create-menu-management-database-schema-and-api.md)
- [shadcn/ui Documentation - https://ui.shadcn.com](https://ui.shadcn.com)
- [React Hook Form Documentation - https://react-hook-form.com](https://react-hook-form.com)
- [TanStack Query Documentation - https://tanstack.com/query](https://tanstack.com/query)

## Dev Agent Record

### Context Reference

**Previous Story:** 1.2 - Create Menu Management Database Schema and API
**Dependencies:**
- Story 1.2 MUST be complete (dishes table, API endpoints)
- Supabase connection working
- `@/lib/supabase/server` and `@/lib/supabase/client` exist
- `@/lib/validation/schemas/dish-schema.ts` exists
- `/api/menu` endpoints (GET, POST, PATCH, DELETE) working

**Epic:** Epic 1 - WhatsApp Order Capture & Display
**Epic Status:** in-progress

### Architecture Decision Integration

**ADR-003: Data Validation (Multi-Layer)**
- Client: React Hook Form + Zod for instant feedback
- API: Already implemented in Story 1.2
- Database: Constraints in place from migration

**ADR-004: Error Handling (Structured System)**
- English codes from API (existing)
- Hebrew translation layer (NEW in this story)
- Toast notifications for user feedback (NEW)

**ADR-007: User Experience Patterns**
- shadcn/ui for consistent component library
- Hebrew RTL layout throughout
- Keyboard-first navigation for desktop

**UX Design Integration:**
- Classic Kanban Theater color palette (NOT used in this story - menu is CRUD UI)
- Inter font family (already configured)
- 8px grid spacing system
- WCAG 2.1 AA compliance (color contrast, keyboard nav)

### Implementation Sequence (CRITICAL ORDER)

**Phase 1: Foundation (Tasks 1-3)**
1. Install shadcn/ui components (required for UI)
2. Create error translation module (required for error handling)
3. Create menu page server component (entry point)

**Phase 2: Core UI (Tasks 4-5)**
4. Create menu table client component (display)
5. Create menu item form component (input)

**Phase 3: Mutations (Tasks 6-8)**
6. Implement create logic (C in CRUD)
7. Implement update logic (U in CRUD)
8. Implement deactivate logic (D in CRUD)

**Phase 4: State Management (Task 9)**
9. Add React Query (automatic updates and caching)

**Phase 5: Polish (Tasks 10-16)**
10. Add toast notifications
11. Implement RTL layout
12. Add loading states
13. Add dialog wrapper
14. Keyboard navigation
15. Validation error display
16. Manual testing

**WHY THIS ORDER:**
- Foundation first (can't build UI without components)
- UI before logic (can't test mutations without forms)
- Mutations before state management (need API calls before caching)
- Polish last (UX improvements after functionality works)

### Common Pitfalls to Avoid

**❌ DON'T:**
1. Use browser client in Server Components (`createClient` from `@/lib/supabase/client`)
2. Return Hebrew text from API endpoints (use English codes)
3. Use camelCase for database fields (must be snake_case)
4. Skip validation on client side (need instant feedback)
5. Forget `dir="rtl"` on containers with Hebrew text
6. Use `useState` for data fetching (use React Query instead)
7. Clear form on error (user loses their input)
8. Hard delete menu items (use soft delete with `is_active = false`)
9. Skip loading states (user sees instant UI jumps)
10. Use English placeholders (all UI text must be Hebrew)

**✅ DO:**
1. Use server client in Server Components (`createClient` from `@/lib/supabase/server`)
2. Translate error codes to Hebrew on client side
3. Match database column names exactly (snake_case)
4. Implement multi-layer validation (client + API + database)
5. Add `dir="rtl"` and `lang="he"` to Hebrew content
6. Use React Query for automatic cache invalidation
7. Keep form populated after errors for retry
8. Soft delete with `is_active` flag
9. Show skeleton loaders and spinners
10. Use Hebrew for all user-facing text

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Completion Checklist

Story is complete when:
- [ ] All shadcn/ui components installed in `components/ui/`
- [ ] Error translation module created with Hebrew messages
- [ ] Menu page loads and displays dishes from database
- [ ] "Add Menu Item" button opens dialog with form
- [ ] Form validates all fields with Hebrew error messages
- [ ] Creating new menu item works and shows immediately in table
- [ ] Success toast appears in Hebrew after creation
- [ ] Edit button pre-fills form with existing data
- [ ] Updating menu item works and reflects in table
- [ ] Deactivate button shows confirmation dialog
- [ ] Confirming deactivation grays out item (opacity-50)
- [ ] All operations show loading states (skeletons, spinners)
- [ ] Error handling works (network disconnected = Hebrew error toast)
- [ ] Form retains data after error (doesn't clear)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] RTL layout correct (text right-aligned, buttons on left)
- [ ] All text in Hebrew except internal error codes
- [ ] Manual testing checklist fully completed
- [ ] Code follows project conventions (snake_case, proper clients)
- [ ] No ESLint errors or warnings
- [ ] Sprint status updated to "ready-for-dev"

### Success Criteria

**User Value Delivered:**
Yaron can now manage menu items independently without developer assistance:
- Add new dishes as menu changes
- Update prices when costs change
- Deactivate seasonal items without deletion
- All operations in Hebrew with clear feedback

**Technical Quality:**
- Server/Client component split correct
- Multi-layer validation working
- Error handling comprehensive
- RTL layout proper
- Loading states smooth
- Keyboard accessible
- Type-safe throughout

**Next Story Dependency:**
Story 1.4 (Orders Database Schema) can begin - no dependencies on menu UI.
