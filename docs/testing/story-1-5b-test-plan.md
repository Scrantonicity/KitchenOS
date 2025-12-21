# Test Plan: Story 1.5b - Add Menu Item Selector and Order Submission

**Story:** 1-5b-add-menu-item-selector-and-order-submission
**Date:** 2025-12-21
**Tester:** Manual QA / Developer Testing

## Test Environment

- **Browser:** Chrome, Firefox, Safari
- **Devices:** Desktop (1920x1080), Tablet (1024x768), Mobile (375x667)
- **Test Data:** Active dishes in menu, valid customer details

## Pre-Test Setup

1. Ensure database has active dishes in `dishes` table
2. Verify `/api/menu` endpoint returns active dishes
3. Verify `/api/orders` endpoint accepts POST requests
4. Clear browser cache and local storage

## Test Cases

### TC-1: Menu Item Selector - Display and Search

**Priority:** High
**AC Reference:** Searchable Dropdown, Hebrew Display

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1.1 | Navigate to `/admin/orders/new` | Page loads with customer form | ⬜ |
| 1.2 | Click "בחר פריט מהתפריט" button | Dropdown opens with all active dishes | ⬜ |
| 1.3 | Verify dish display | Each dish shows: name (Hebrew), unit type badge, price (₪XX.XX) | ⬜ |
| 1.4 | Type "חומוס" in search | Only matching dishes appear | ⬜ |
| 1.5 | Type non-existent item | "לא נמצאו פריטים" message appears | ⬜ |
| 1.6 | Press Escape | Dropdown closes | ⬜ |
| 1.7 | Use arrow keys to navigate | Items highlight correctly | ⬜ |
| 1.8 | Press Enter on highlighted item | Item is selected and added | ⬜ |

### TC-2: Order Summary - Item Management

**Priority:** High
**AC Reference:** Real-time Updates, Quantity Controls, Remove Item

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 2.1 | View empty order summary | "טרם נוספו פריטים" message displayed | ⬜ |
| 2.2 | Add first item from menu | Item appears in order summary with quantity 1 | ⬜ |
| 2.3 | Click + button | Quantity increments to 2, price updates | ⬜ |
| 2.4 | Click - button | Quantity decrements to 1, price updates | ⬜ |
| 2.5 | Click - button when quantity is 1 | Button is disabled | ⬜ |
| 2.6 | Type "50" in quantity input | Quantity updates to 50, price recalculates | ⬜ |
| 2.7 | Type "0" in quantity input | Input ignored, quantity remains unchanged | ⬜ |
| 2.8 | Type "1000" in quantity input | Input capped at 999 | ⬜ |
| 2.9 | Click X button | Item removed from order | ⬜ |
| 2.10 | Add multiple items | All items display with individual quantities | ⬜ |
| 2.11 | Verify total items count | Sum of all quantities displayed correctly | ⬜ |
| 2.12 | Verify total price | Sum of (quantity × price) displayed correctly | ⬜ |

### TC-3: Sticky Sidebar Layout (Desktop)

**Priority:** Medium
**AC Reference:** Sticky right sidebar layout

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 3.1 | Open page on desktop (>1024px) | Two-column layout: form left, summary right | ⬜ |
| 3.2 | Scroll down the page | Order summary stays visible (sticky) | ⬜ |
| 3.3 | Resize to mobile (<1024px) | Layout switches to single column | ⬜ |
| 3.4 | Verify button placement on mobile | Submit buttons appear at bottom of form | ⬜ |

### TC-4: Form Validation and Submit Button

**Priority:** High
**AC Reference:** At Least One Item, Enabled/Disabled States

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 4.1 | View form with no items | Submit button is disabled (grayed out) | ⬜ |
| 4.2 | Add one item | Submit button becomes enabled (green) | ⬜ |
| 4.3 | Remove all items | Submit button becomes disabled again | ⬜ |
| 4.4 | Verify button text | Shows "שמור הזמנה" when idle | ⬜ |
| 4.5 | Verify button styling | Green background when enabled | ⬜ |
| 4.6 | Verify aria-label | Button has aria-label="שמור הזמנה חדשה" | ⬜ |

### TC-5: Order Submission - Happy Path

**Priority:** Critical
**AC Reference:** API Call, Success Toast, Redirect

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 5.1 | Fill customer name | "ישראל ישראלי" | ⬜ |
| 5.2 | Fill customer phone | "0501234567" | ⬜ |
| 5.3 | Select pickup time | Valid future time | ⬜ |
| 5.4 | Add notes (optional) | "אנא ללא בצל" | ⬜ |
| 5.5 | Add 2 items with quantities | Items appear in summary | ⬜ |
| 5.6 | Click "שמור הזמנה" | Button text changes to "שומר..." | ⬜ |
| 5.7 | Verify API call | POST /api/orders with correct payload including `source: 'manual'` | ⬜ |
| 5.8 | Verify success toast | Green toast: "ההזמנה נוצרה בהצלחה" with order number | ⬜ |
| 5.9 | Wait 2 seconds | Toast remains visible for user to read | ⬜ |
| 5.10 | After 2 seconds | Redirect to `/admin/orders` | ⬜ |

### TC-6: Order Submission - Error Handling

**Priority:** High
**AC Reference:** Error Handling for API Failures

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 6.1 | Attempt submit with no items | Error toast: "יש להוסיף לפחות פריט אחד להזמנה" | ⬜ |
| 6.2 | Simulate network error | Error toast: "שגיאה ביצירת הזמנה" | ⬜ |
| 6.3 | Verify form state after error | All data remains populated, not cleared | ⬜ |
| 6.4 | Simulate API validation error | Specific error message displayed | ⬜ |
| 6.5 | Verify submit button | Re-enabled after error, can retry | ⬜ |

### TC-7: Cancel Button and Navigation

**Priority:** Medium
**AC Reference:** Form Reset, Navigation

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 7.1 | Fill form with data | Form populated | ⬜ |
| 7.2 | Click "ביטול" button | Confirmation dialog appears | ⬜ |
| 7.3 | Click "Cancel" in dialog | Dialog closes, stays on page | ⬜ |
| 7.4 | Click "ביטול" button again | Confirmation dialog appears | ⬜ |
| 7.5 | Click "OK" in dialog | Redirect to `/admin/orders` | ⬜ |

### TC-8: Duplicate Item Selection

**Priority:** Medium
**AC Reference:** Multiple items can be added

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 8.1 | Select "חומוס" from menu | Item added with quantity 1 | ⬜ |
| 8.2 | Select "חומוס" again from menu | Quantity increments to 2, not duplicate entry | ⬜ |
| 8.3 | Verify quantity cap | Cannot exceed 999 even when adding same item multiple times | ⬜ |

### TC-9: Hebrew RTL Support

**Priority:** High
**AC Reference:** Hebrew text direction

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 9.1 | View all text elements | All Hebrew text is right-aligned | ⬜ |
| 9.2 | Check dropdown | Search input and items are RTL | ⬜ |
| 9.3 | Check order summary | All text right-aligned | ⬜ |
| 9.4 | Check toast notifications | Toast appears with RTL text | ⬜ |

### TC-10: Loading States

**Priority:** Medium
**AC Reference:** Loading state during submission

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 10.1 | Open menu selector initially | "טוען תפריט..." message shown | ⬜ |
| 10.2 | After dishes load | Menu items displayed | ⬜ |
| 10.3 | Click submit button | Button text changes to "שומר..." | ⬜ |
| 10.4 | During submission | All form inputs disabled | ⬜ |
| 10.5 | After submission | Form re-enabled or redirected | ⬜ |

## Cross-Browser Testing

Test all critical paths (TC-1, TC-2, TC-5) on:

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ⬜ | |
| Firefox | Latest | ⬜ | |
| Safari | Latest | ⬜ | |

## Regression Testing

Verify Story 1.5a functionality still works:

| Feature | Status | Notes |
|---------|--------|-------|
| Customer name validation | ⬜ | |
| Phone number validation | ⬜ | |
| Pickup time validation | ⬜ | |
| Business hours validation | ⬜ | |
| Form reset functionality | ⬜ | |

## Test Data

### Sample Dishes (from database)
- חומוס - Unit - ₪25.00
- פלאפל - Unit - ₪20.00
- סלט ירקות - Weight - ₪15.00
- חציל - Weight - ₪18.00

### Sample Customer Data
- Name: ישראל ישראלי
- Phone: 0501234567
- Notes: אנא ללא בצל

## Test Results Summary

**Date Tested:** _______
**Tester:** _______
**Total Test Cases:** 60+
**Passed:** _______
**Failed:** _______
**Blocked:** _______

## Issues Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| | | | |

## Sign-Off

- [ ] All critical test cases passed
- [ ] All high-priority test cases passed
- [ ] Cross-browser testing completed
- [ ] Regression testing completed
- [ ] Known issues documented

**QA Approval:** ___________
**Date:** ___________
