# Manual Test Plan - Story 1.5a: Build Desktop Order Creation Form

## Test Environment
- URL: http://localhost:3000/admin/orders/new
- Browser: Chrome, Firefox, Safari (desktop)
- Viewport: Desktop (>1024px)

## Test Scenarios

### TS-1: Page Load and Layout
**Steps:**
1. Navigate to `/admin/orders/new`
2. Verify breadcrumb navigation shows: ניהול → הזמנות → הזמנה חדשה
3. Verify page title is "הזמנה חדשה"
4. Verify three sections are visible:
   - פרטי לקוח (Customer Details)
   - זמן איסוף (Pickup Time)
   - פריטים (Menu Items - placeholder)

**Expected Results:**
- ✅ Page loads without errors
- ✅ All sections render correctly
- ✅ Hebrew text displays RTL
- ✅ Desktop-optimized layout (max-width 1200px, centered)

---

### TS-2: Customer Name Field - Auto-focus and Validation
**Steps:**
1. Load the page
2. Verify customer name field is automatically focused
3. Type "א" (single Hebrew character)
4. Tab away or blur field
5. Verify error message: "שם לקוח חייב להכיל לפחות 2 תווים"
6. Type "יוסי כהן" (valid Hebrew name)
7. Verify green checkmark (✓) appears on the right side of input

**Expected Results:**
- ✅ Customer name field has focus on page load
- ✅ Validation error appears in red below field with alert icon
- ✅ Error message is in Hebrew
- ✅ Input is preserved during validation
- ✅ Green checkmark appears when valid (16x16px, text-green-600)
- ✅ Text displays RTL

---

### TS-3: Phone Field - Optional and Format Validation
**Steps:**
1. Leave phone field empty and proceed to next field
2. Verify no error (field is optional)
3. Enter "123456" (invalid format)
4. Tab away or blur field
5. Verify error: "מספר טלפון חייב להיות בפורמט ישראלי (05XXXXXXXX)"
6. Enter "0501234567" (valid Israeli phone)
7. Verify no error appears

**Expected Results:**
- ✅ Empty phone field does not show error
- ✅ Invalid format shows Hebrew error message
- ✅ Valid phone number is accepted
- ✅ Phone numbers display LTR (left-to-right)
- ✅ No green checkmark (field is optional)

---

### TS-4: Pickup Time - Default Value and Business Hours
**Steps:**
1. Check default pickup time value
2. Verify it's set to next available business hour slot:
   - If before 8:30 AM today → 8:30 AM today
   - If after 8:30 AM today → 8:30 AM next day
3. Click on date picker
4. Select a date
5. Click on time picker
6. Select a time outside business hours (e.g., 14:00 / 2:00 PM)
7. Verify warning dialog appears with message format:
   "זמן האיסוף 14:00 הוא מחוץ לשעות הפעילות (8:30-13:00). להמשיך בכל זאת?"

**Expected Results:**
- ✅ Default pickup time is within business hours (8:30 AM - 1:00 PM)
- ✅ Date picker shows Hebrew calendar
- ✅ Time picker shows 15-minute intervals
- ✅ Warning dialog appears for times outside 8:30 AM - 1:00 PM
- ✅ Warning message includes selected time and business hours range

---

### TS-5: Business Hours Warning - Override
**Steps:**
1. Select time outside business hours (triggers warning from TS-4)
2. Click "אישור" (Confirm) button in warning dialog
3. Verify dialog closes
4. Verify selected time is preserved
5. Proceed to test form submission

**Expected Results:**
- ✅ Warning dialog closes on confirmation
- ✅ Out-of-hours time is accepted
- ✅ Form allows submission with overridden time

---

### TS-6: Business Hours Warning - Cancel
**Steps:**
1. Select time outside business hours (triggers warning)
2. Click "ביטול" (Cancel) button in warning dialog
3. Verify dialog closes
4. Verify time is reset to 08:30

**Expected Results:**
- ✅ Warning dialog closes on cancel
- ✅ Time is reset to default business hour (8:30 AM)

---

### TS-7: Notes Field - RTL and Character Limit
**Steps:**
1. Tab to notes field
2. Type Hebrew text: "הערות חשובות להזמנה זו"
3. Verify text displays RTL
4. Type 501 characters (exceeds max 500)
5. Verify error: "הערות ארוכות מדי (מקסימום 500 תווים)"

**Expected Results:**
- ✅ Notes field displays Hebrew text RTL
- ✅ Max length validation triggers at 501 characters
- ✅ Error message appears in Hebrew below field
- ✅ Input is preserved

---

### TS-8: Tab Order and Keyboard Navigation
**Steps:**
1. Focus on customer name field
2. Press Tab
3. Verify focus moves to phone field
4. Press Tab
5. Verify focus moves to pickup time date picker
6. Press Tab
7. Verify focus moves to pickup time time picker
8. Press Tab
9. Verify focus moves to notes field

**Expected Results:**
- ✅ Tab order: customer_name → customer_phone → pickup_time (date) → pickup_time (time) → notes
- ✅ All fields are keyboard accessible
- ✅ Focus indicators are visible

---

### TS-9: Form Submission Stub (Console Log)
**Steps:**
1. Fill all required fields:
   - Customer name: "משה לוי"
   - Phone: "0501234567" (optional)
   - Pickup time: Tomorrow at 9:00 AM
   - Notes: "הערות לדוגמה"
2. Open browser console (F12)
3. Click submit button (disabled - placeholder for Story 1.5b)
4. Verify button is disabled with tooltip: "שמור הזמנה (1.5b)"

**Expected Results:**
- ✅ Submit button is disabled (Story 1.5b will enable)
- ✅ Placeholder text indicates Story 1.5b
- ✅ No form submission occurs yet
- ✅ Form data would be ready for submission in Story 1.5b

---

### TS-10: Accessibility - ARIA Labels and Screen Readers
**Steps:**
1. Use browser accessibility inspector (Chrome DevTools > Accessibility)
2. Verify all form fields have proper labels:
   - Customer name: `aria-required="true"`, `aria-invalid` when error
   - Phone: `aria-required="false"`, `aria-invalid` when error
   - Notes: `aria-required="false"`
3. Verify error messages have `aria-live="polite"` (handled by FormMessage)
4. Test with keyboard-only navigation (no mouse)

**Expected Results:**
- ✅ All fields have proper ARIA attributes
- ✅ Required fields marked with `aria-required="true"`
- ✅ Error states update `aria-invalid` attribute
- ✅ Form is fully navigable with keyboard only

---

### TS-11: Cancel Button - Form Reset
**Steps:**
1. Fill form with test data:
   - Customer name: "דני כהן"
   - Phone: "0529876543"
   - Notes: "הערות בדיקה"
2. Click "ביטול" (Cancel) button
3. Verify confirmation dialog appears: "האם אתה בטוח שברצונך לבטל?"
4. Click confirm
5. Verify form is reset to default values

**Expected Results:**
- ✅ Confirmation dialog prevents accidental cancel
- ✅ Form resets on confirmation
- ✅ All fields return to default values

---

### TS-12: Visual Design - Error and Success Indicators
**Steps:**
1. Trigger validation errors for multiple fields
2. Verify error indicator design:
   - Red text (text-red-600)
   - Alert icon (⚠️ or AlertCircle)
   - Text size: 14px (text-sm)
   - Position: Directly below field (4px gap)
   - Animation: Slide down (150ms)
3. Fill required fields correctly
4. Verify green checkmark design:
   - Icon: ✓ (Check from lucide-react)
   - Color: text-green-600
   - Position: Absolute, left-3 top-3 (inside input)
   - Size: 16x16px (w-4 h-4)
   - Animation: Fade in (150ms)

**Expected Results:**
- ✅ Error messages match design specifications
- ✅ Green checkmarks appear only for valid required fields
- ✅ Animations are smooth (150ms)
- ✅ Layout pushes content down (not absolute positioning for errors)

---

## Cross-Browser Testing

### Browsers to Test
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

### Test Each Browser For:
1. Page loads without errors
2. Hebrew RTL renders correctly
3. Form validation works
4. Date/time pickers function properly
5. Dialogs (business hours warning) display correctly
6. Keyboard navigation works

---

## Regression Checks

### Verify No Breaking Changes:
- [ ] `/admin/menu` page still loads and functions
- [ ] Menu CRUD operations work
- [ ] `/api/orders` endpoint is accessible (not called from form yet)

---

## Test Results Summary

**Test Date:** _____________________
**Tester:** _____________________
**Browser:** _____________________

| Test Scenario | Pass | Fail | Notes |
|---------------|------|------|-------|
| TS-1: Page Load | ☐ | ☐ | |
| TS-2: Customer Name | ☐ | ☐ | |
| TS-3: Phone Field | ☐ | ☐ | |
| TS-4: Pickup Time | ☐ | ☐ | |
| TS-5: Warning Override | ☐ | ☐ | |
| TS-6: Warning Cancel | ☐ | ☐ | |
| TS-7: Notes Field | ☐ | ☐ | |
| TS-8: Tab Order | ☐ | ☐ | |
| TS-9: Form Submission | ☐ | ☐ | |
| TS-10: Accessibility | ☐ | ☐ | |
| TS-11: Cancel Button | ☐ | ☐ | |
| TS-12: Visual Design | ☐ | ☐ | |

---

## Known Limitations (Story 1.5a Scope)

1. **No Menu Item Selection:** Placeholder section - Story 1.5b will implement
2. **Submit Button Disabled:** Story 1.5b will enable submission
3. **No API Integration:** Form logs to console only - Story 1.5b adds POST /api/orders
4. **No Success/Error Toasts:** Story 1.5b will add notifications
5. **No Loading States:** Story 1.5b will add loading spinner during submission

---

## Story 1.5b Will Add:
- Menu item selector (searchable dropdown)
- Quantity controls
- Order summary panel
- Submit button functionality
- POST /api/orders integration
- Success/error handling
- Redirect to `/admin/orders` on success
