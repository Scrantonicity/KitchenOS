# Test Design: Story 1.5a - Build Desktop Order Creation Form

**Date:** 2025-12-20
**Author:** Harel (via BMad TEA Agent)
**Status:** Draft
**Story:** 1.5a - Build Desktop Order Creation Form

---

## Executive Summary

**Scope:** Epic-level test design for Story 1.5a (Desktop Order Creation Form - Customer Details & Pickup Time)

**Risk Summary:**

- Total risks identified: 8
- High-priority risks (≥6): 2
- Medium-priority risks (3-5): 4
- Low-priority risks (1-2): 2
- Critical categories: DATA, BUS, TECH

**Coverage Summary:**

- P0 scenarios: 6 tests (12 hours)
- P1 scenarios: 10 tests (10 hours)
- P2 scenarios: 12 tests (6 hours)
- P3 scenarios: 4 tests (1 hour)
- **Total effort**: 29 hours (~4 days)

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-001 | DATA | Invalid phone format allows malformed data entry bypassing API validation | 2 | 3 | 6 | Add client-side regex validation matching API schema + E2E tests for edge cases | DEV | Story 1.5a |
| R-002 | BUS | Business hours override allows orders outside operational capacity without staff awareness | 2 | 3 | 6 | Implement warning dialog with explicit confirmation + audit log for override events | DEV | Story 1.5a |

### Medium-Priority Risks (Score 3-5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-003 | TECH | Hebrew RTL rendering breaks on certain browsers or when mixed with LTR content | 2 | 2 | 4 | Cross-browser testing (Chrome, Firefox, Safari) + manual RTL validation | QA |
| R-004 | DATA | Pickup time validation allows past times due to timezone/clock skew issues | 1 | 3 | 3 | Use server time for validation + client-side pre-check with grace period | DEV |
| R-005 | BUS | Auto-focus on customer name prevents keyboard users from accessing breadcrumb navigation | 1 | 2 | 2 | Test keyboard navigation flow + skip-to-content link | QA |
| R-006 | TECH | Form state loss on accidental page refresh frustrates users mid-order entry | 2 | 2 | 4 | Implement localStorage auto-save with restoration prompt | DEV |

### Low-Priority Risks (Score 1-2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R-007 | BUS | Date picker allows far-future dates (e.g., 2030) causing operational confusion | 1 | 2 | 2 | Monitor - Add max date restriction (e.g., +30 days) if issue observed |
| R-008 | TECH | Tab order breaks when new fields added in Story 1.5b | 1 | 1 | 1 | Monitor - Document expected tab order for Story 1.5b integration |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Test Coverage Plan

### P0 (Critical) - Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Customer name validation (required, 2-100 chars) | E2E | R-001 | 3 | QA | Happy path, min/max length, whitespace trim |
| Phone number validation (Israeli format) | E2E | R-001 | 4 | QA | Valid 05XXXXXXXX, invalid formats, optional empty, edge formats |
| Pickup time future validation | API | R-004 | 2 | QA | Past time rejected, grace period within 1 minute |
| Business hours warning and override | E2E | R-002 | 3 | QA | Within hours (no warning), outside hours (warning), override accepted |

**Total P0**: 12 tests, 24 hours

### P1 (High) - Run on PR to main

**Criteria**: Important features + Medium risk (3-5) + Common workflows

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Hebrew RTL rendering (name, notes) | Component | R-003 | 3 | DEV | Text direction correct, mixed RTL/LTR, Unicode edge cases |
| Form auto-focus on load | E2E | R-005 | 1 | QA | Customer name field receives focus |
| Tab order sequence | E2E | R-005 | 2 | QA | Forward tab (name→phone→time→notes), reverse tab (shift+tab) |
| Pickup time default calculation | Unit | - | 4 | DEV | Before 8:30 same day, after 8:30 same day, edge times (8:29, 13:01), 15-min rounding |
| Error message display (Hebrew) | Component | R-001 | 3 | DEV | Error appears below field, multiple errors simultaneously, error clears on fix |
| Form state preservation on validation error | E2E | R-006 | 2 | QA | Input preserved after submit attempt, multiple validation attempts |

**Total P1**: 15 tests, 15 hours

### P2 (Medium) - Run nightly/weekly

**Criteria**: Secondary features + Low risk (1-2) + Edge cases

| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Notes field max length (500 chars) | Unit | - | 2 | DEV | Valid 500 chars, invalid 501 chars |
| Valid field checkmark indicator | Component | - | 2 | DEV | Checkmark appears on valid required field, no checkmark for optional/invalid |
| Breadcrumb navigation rendering | Component | - | 1 | DEV | Links render correctly: Admin → Orders → New Order |
| Desktop layout responsiveness | E2E | R-003 | 3 | QA | >1024px (two-column), 768-1024px (single-column), <768px (mobile compact) |
| Keyboard shortcuts (ESC to clear) | E2E | - | 2 | QA | ESC clears form with confirmation, ESC cancels dialog |
| ARIA labels for accessibility | Component | - | 3 | DEV | Labels associated with fields, required fields marked, error messages live regions |
| localStorage auto-save and restore | E2E | R-006 | 3 | QA | Save on blur, restore on load with prompt, clear on submit |

**Total P2**: 16 tests, 8 hours

### P3 (Low) - Run on-demand

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| Date picker far-future date selection | E2E | 1 | QA | Select date >30 days out (exploratory behavior) |
| Form rendering performance | E2E | 1 | QA | Time to interactive <500ms |
| Multi-language error message fallback | Unit | 1 | DEV | English fallback if Hebrew translation missing |
| Phone field LTR direction enforcement | Component | 1 | DEV | Numbers always LTR regardless of surrounding RTL |

**Total P3**: 4 tests, 1 hour

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Page loads at `/admin/orders/new` without errors (30s)
- [ ] Form renders with all required fields visible (45s)
- [ ] Submit button disabled when form invalid (30s - Story 1.5b will add button)

**Total**: 3 scenarios (~2 min)

### P0 Tests (<15 min)

**Purpose**: Critical path validation - data integrity and business rules

- [ ] Customer name required validation - empty rejected (E2E, 2min)
- [ ] Customer name min/max length validation (E2E, 2min)
- [ ] Phone number Israeli format validation - valid 05XXXXXXXX accepted (E2E, 2min)
- [ ] Phone number invalid format rejected with Hebrew error (E2E, 2min)
- [ ] Phone number optional - empty allowed (E2E, 1min)
- [ ] Pickup time past date rejected (API, 2min)
- [ ] Pickup time grace period (within 1 min) allowed (API, 2min)
- [ ] Business hours within 8:30-13:00 no warning (E2E, 2min)
- [ ] Business hours outside range shows warning dialog (E2E, 2min)
- [ ] Business hours override confirmation accepted (E2E, 2min)

**Total**: 10 scenarios (~19 min)

### P1 Tests (<20 min)

**Purpose**: Important feature coverage - UX and accessibility

- [ ] Customer name field RTL rendering (Component, 1min)
- [ ] Notes field RTL rendering (Component, 1min)
- [ ] Mixed RTL/LTR content rendering (Component, 2min)
- [ ] Customer name auto-focus on page load (E2E, 1min)
- [ ] Tab order forward: name→phone→time→notes (E2E, 2min)
- [ ] Tab order reverse with Shift+Tab (E2E, 2min)
- [ ] Pickup time defaults before 8:30 AM same day (Unit, 1min)
- [ ] Pickup time defaults after 8:30 AM next day (Unit, 1min)
- [ ] Pickup time rounds to 15-minute intervals (Unit, 1min)
- [ ] Pickup time edge cases (8:29, 13:01) (Unit, 1min)
- [ ] Validation error appears below field in Hebrew (Component, 1min)
- [ ] Multiple validation errors display simultaneously (Component, 2min)
- [ ] Validation error clears when field corrected (Component, 1min)
- [ ] Form input preserved after validation error (E2E, 2min)
- [ ] Form input preserved across multiple submit attempts (E2E, 2min)

**Total**: 15 scenarios (~21 min)

### P2/P3 Tests (<30 min)

**Purpose**: Full regression coverage - edge cases and polish

- [ ] Notes max length 500 characters valid (Unit, 30s)
- [ ] Notes max length 501 characters invalid (Unit, 30s)
- [ ] Green checkmark on valid required field (Component, 1min)
- [ ] No checkmark on optional/invalid fields (Component, 1min)
- [ ] Breadcrumb navigation renders correctly (Component, 1min)
- [ ] Desktop layout >1024px two-column (E2E, 2min)
- [ ] Tablet layout 768-1024px single-column (E2E, 2min)
- [ ] Mobile layout <768px compact (E2E, 2min)
- [ ] ESC key clears form with confirmation (E2E, 2min)
- [ ] ESC key cancels clear confirmation dialog (E2E, 2min)
- [ ] ARIA labels on all form fields (Component, 2min)
- [ ] Required fields have aria-required (Component, 1min)
- [ ] Error messages use aria-live regions (Component, 1min)
- [ ] localStorage saves form state on blur (E2E, 3min)
- [ ] localStorage restores form state with prompt (E2E, 3min)
- [ ] localStorage clears on successful submit (E2E, 2min)
- [ ] Far-future date selection exploratory (E2E, 2min)
- [ ] Form rendering performance <500ms (E2E, 2min)
- [ ] Multi-language error fallback (Unit, 1min)
- [ ] Phone field enforces LTR direction (Component, 1min)

**Total**: 20 scenarios (~33 min)

**Grand Total**: 48 test scenarios across all priorities

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 10 | 2.0 | 20 | Data integrity critical, API integration |
| P1 | 15 | 1.0 | 15 | Standard UX/accessibility coverage |
| P2 | 20 | 0.5 | 10 | Edge cases, simple validation |
| P3 | 3 | 1.0 | 3 | Exploratory and performance |
| **Total** | **48** | **-** | **48** | **~6 days** |

### Prerequisites

**Test Data:**

- `OrderFormDataFactory` - Generates valid customer details (name, phone, dates) using faker
- `BusinessHoursFixture` - Sets up test scenarios for business hours validation
- `MockDateTimeProvider` - Controls time for pickup time validation tests

**Tooling:**

- **Playwright** for E2E tests (form interaction, navigation, validation flows)
- **Vitest** for Unit/Component tests (validation logic, utilities, React components)
- **React Testing Library** for Component tests (RTL rendering, accessibility)
- **@seontechnologies/playwright-utils** (if `tea_use_playwright_utils: true` in config)
  - `apiRequest` for API validation tests
  - `interceptNetworkCall` for mock API responses
  - `authSession` for authenticated test user

**Environment:**

- Local development environment with Supabase local instance
- Test database seeded with:
  - Valid menu items (for Story 1.5b integration)
  - Test user account (Yaron role: admin)
- Browser environments: Chrome (primary), Firefox, Safari (cross-browser validation)

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions - data integrity critical)
- **P1 pass rate**: ≥95% (waivers required for UX/accessibility failures)
- **P2/P3 pass rate**: ≥90% (informational, can defer edge cases)
- **High-risk mitigations**: 100% complete (R-001, R-002 must be resolved)

### Coverage Targets

- **Critical paths** (customer details entry, validation): 100%
- **Business rules** (business hours, data formats): 100%
- **Accessibility** (ARIA, keyboard nav): ≥80%
- **Edge cases** (max lengths, unusual formats): ≥60%

### Non-Negotiable Requirements

- [ ] All P0 tests pass (10/10 scenarios)
- [ ] R-001 (phone validation) mitigated with regex + E2E tests
- [ ] R-002 (business hours override) mitigated with warning dialog + audit log
- [ ] Hebrew RTL rendering verified on Chrome, Firefox, Safari
- [ ] Accessibility tests pass (ARIA labels, keyboard navigation)

---

## Mitigation Plans

### R-001: Invalid Phone Format Allows Malformed Data (Score: 6)

**Mitigation Strategy:**
1. Implement client-side Zod validation with regex `/^05\d{8}$/` matching API schema from Story 1.4
2. Display Hebrew error message: "מספר טלפון חייב להיות בפורמט ישראלי (05XXXXXXXX)"
3. Add E2E tests covering:
   - Valid format: 0501234567
   - Invalid formats: 123, 0612345678, 05123456 (too short), 051234567890 (too long)
   - Edge case: Empty string (should be allowed as optional field)
4. Verify API rejects invalid formats with 400 error (integration test)

**Owner:** DEV (Story 1.5a implementation)
**Timeline:** Story 1.5a completion (before merge to main)
**Status:** Planned
**Verification:** E2E test suite passes + manual QA validation

### R-002: Business Hours Override Without Awareness (Score: 6)

**Mitigation Strategy:**
1. Implement business hours validation:
   - Constant: `BUSINESS_HOURS = { start: "08:30", end: "13:00" }`
   - Check selected pickup time against range
2. Display warning dialog when outside business hours:
   - Hebrew message: "מחוץ לשעות פעילות. להמשיך בכל זאת?"
   - Confirmation button: "אישור" (Confirm)
   - Cancel button: "ביטול" (Cancel)
3. Log override events for operational awareness:
   - Console warning (development)
   - Consider future enhancement: Supabase logging for audit trail
4. Add E2E tests:
   - Within business hours: no warning, form submits normally
   - Outside business hours: warning appears, can cancel
   - Override: confirmation accepts non-business-hour time

**Owner:** DEV (Story 1.5a implementation)
**Timeline:** Story 1.5a completion (before merge to main)
**Status:** Planned
**Verification:** E2E test suite passes + manual QA validation + override logged

---

## Assumptions and Dependencies

### Assumptions

1. **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+) with ES2020+ support
2. **User Role**: Only authenticated admin users (Yaron role) access `/admin/orders/new`
3. **Business Hours**: Fixed schedule (8:30 AM - 1:00 PM) - future enhancement may add configurable hours
4. **Phone Format**: Israeli phone numbers only - international formats deferred to future story
5. **Date Range**: Pickup dates limited to "reasonable future" (<1 year) - exact max date TBD
6. **Story 1.5b Integration**: Form state structure stable, menu item selector will add `items[]` field

### Dependencies

1. **Story 1.4 API** - POST /api/orders endpoint must be deployed and functional - Required by Story 1.5b
2. **shadcn/ui Components** - Form, Input, Label, Button, Calendar, Popover, Alert, Textarea - Required by Story 1.5a
3. **React Hook Form + Zod** - Already installed in Story 1.3 - Available now
4. **Supabase Client** - Initialized in Story 1.1 - Available now
5. **Test Framework** - Playwright + Vitest setup - Required by Epic 5 (deferred, manual testing for now)

### Risks to Plan

- **Risk**: Story 1.5b changes form state structure, invalidating tests
  - **Impact**: Medium - Test refactoring required (4-8 hours)
  - **Contingency**: Design form state as extensible object, add `items[]` field without breaking existing validation

- **Risk**: Business hours configuration becomes dynamic (moved to Supabase settings)
  - **Impact**: Low - Test data setup requires Supabase seeding (~2 hours)
  - **Contingency**: Parameterize business hours in test fixtures, add setup script

- **Risk**: Cross-browser RTL rendering issues discovered in production
  - **Impact**: High - User frustration, data entry errors
  - **Contingency**: Prioritize P1 RTL tests, test on actual devices before release

---

## Test Scenarios Detail

### P0 Critical Scenarios (Data Integrity & Business Rules)

#### Scenario 1: Customer Name Required Validation
- **Level**: E2E
- **Risk**: R-001 (DATA)
- **Steps**:
  1. Navigate to `/admin/orders/new`
  2. Leave customer_name field empty
  3. Tab to next field (phone) or attempt submit
  4. **Expected**: Hebrew error appears below field: "שם לקוח חייב להכיל לפחות 2 תווים"
  5. Fill customer_name with valid text (e.g., "יוסי כהן")
  6. **Expected**: Error clears, green checkmark appears

#### Scenario 2: Customer Name Length Validation
- **Level**: E2E
- **Risk**: R-001 (DATA)
- **Steps**:
  1. Enter 1 character in customer_name → Error: "שם לקוח חייב להכיל לפחות 2 תווים"
  2. Enter 2 characters → Valid (checkmark)
  3. Enter 100 characters → Valid (checkmark)
  4. Enter 101 characters → Error: "שם לקוח ארוך מדי"

#### Scenario 3-6: Phone Number Validation (E2E)
- **Scenario 3**: Valid Israeli format `0501234567` → Accepted, no error
- **Scenario 4**: Invalid format `123` → Error: "מספר טלפון חייב להיות בפורמט ישראלי (05XXXXXXXX)"
- **Scenario 5**: Invalid format `0612345678` (wrong prefix) → Error
- **Scenario 6**: Empty string → Accepted (optional field)

#### Scenario 7-8: Pickup Time Future Validation (API)
- **Scenario 7**: Select past date (e.g., yesterday) → API returns 400: `VALIDATION_ERROR`
- **Scenario 8**: Select time within 1-minute grace period (edge case: clock skew) → API accepts

#### Scenario 9-11: Business Hours Warning and Override (E2E)
- **Scenario 9**: Select time 10:00 AM (within 8:30-13:00) → No warning, form valid
- **Scenario 10**: Select time 14:00 (outside hours) → Warning dialog appears with Hebrew message
- **Scenario 11**: Click "אישור" on warning → Time accepted, override logged

### P1 High Scenarios (UX & Accessibility)

#### Scenario 12-14: Hebrew RTL Rendering (Component)
- **Scenario 12**: Customer name field with Hebrew text "יוסי כהן" → Text flows right-to-left
- **Scenario 13**: Notes field with Hebrew text → Text flows right-to-left
- **Scenario 14**: Mixed RTL/LTR (Hebrew + English) → Renders correctly without layout breaks

#### Scenario 15: Form Auto-Focus (E2E)
- **Steps**: Navigate to `/admin/orders/new` → Customer name field automatically focused (active element)

#### Scenario 16-17: Tab Order (E2E)
- **Scenario 16**: Tab key forward → name → phone → pickup_time → notes → (submit button in Story 1.5b)
- **Scenario 17**: Shift+Tab key reverse → Traverses backwards through fields

#### Scenario 18-21: Pickup Time Default Calculation (Unit)
- **Scenario 18**: Current time 7:00 AM → Default pickup time 8:30 AM same day
- **Scenario 19**: Current time 10:00 AM → Default pickup time 8:30 AM next day
- **Scenario 20**: Edge case 8:29 AM → Default 8:30 AM same day (rounds up to 8:30)
- **Scenario 21**: Edge case 13:01 PM → Default 8:30 AM next day (past business hours)

#### Scenario 22-24: Error Message Display (Component)
- **Scenario 22**: Single validation error appears below field with red text
- **Scenario 23**: Multiple errors (name empty, phone invalid) display simultaneously
- **Scenario 24**: Error clears when field corrected (reactive validation)

#### Scenario 25-26: Form State Preservation (E2E)
- **Scenario 25**: Fill form, trigger validation error → All input values preserved
- **Scenario 26**: Multiple submit attempts with errors → Input never lost

### P2 Medium Scenarios (Edge Cases & Polish)

#### Scenario 27-28: Notes Max Length (Unit)
- **Scenario 27**: Enter 500 characters in notes → Valid
- **Scenario 28**: Enter 501 characters → Error: "הערות ארוכות מדי (מקסימום 500 תווים)"

#### Scenario 29-30: Valid Field Indicator (Component)
- **Scenario 29**: Fill required field (customer_name) with valid text → Green checkmark appears
- **Scenario 30**: Leave optional field empty (phone) → No checkmark (expected)

#### Scenario 31: Breadcrumb Navigation (Component)
- **Steps**: Render breadcrumb → Links visible: "Admin" → "Orders" → "New Order"

#### Scenario 32-34: Responsive Layout (E2E)
- **Scenario 32**: Desktop >1024px → Two-column layout (customer details | pickup time)
- **Scenario 33**: Tablet 768-1024px → Single-column layout, full-width fields
- **Scenario 34**: Mobile <768px → Compact spacing, stacked fields

#### Scenario 35-36: Keyboard Shortcuts (E2E)
- **Scenario 35**: Press ESC key → Confirmation dialog: "לנקות טופס?" (Clear form?)
- **Scenario 36**: Press ESC again on confirmation → Dialog cancelled, form state preserved

#### Scenario 37-39: Accessibility (Component)
- **Scenario 37**: All form fields have associated `<label>` or `aria-label`
- **Scenario 38**: Required fields have `aria-required="true"` attribute
- **Scenario 39**: Error messages use `aria-live="polite"` for screen reader announcements

#### Scenario 40-42: localStorage Auto-Save (E2E)
- **Scenario 40**: Fill form, blur field → State saved to localStorage
- **Scenario 41**: Refresh page → Restoration prompt appears with saved data preview
- **Scenario 42**: Submit form successfully → localStorage cleared

### P3 Low Scenarios (Exploratory & Performance)

#### Scenario 43: Far-Future Date (E2E)
- **Steps**: Select date 6 months in the future → Exploratory: Does picker allow? Any warnings?

#### Scenario 44: Form Rendering Performance (E2E)
- **Steps**: Measure time from navigation to fully interactive form → Target: <500ms

#### Scenario 45: Multi-Language Fallback (Unit)
- **Steps**: Trigger error with missing Hebrew translation → Falls back to English message

#### Scenario 46: Phone Field LTR Direction (Component)
- **Steps**: Phone field surrounded by RTL content → Numbers always display LTR (0501234567)

---

## Manual Testing Checklist (Story 1.5a)

**Pre-Conditions:**
- [ ] Deployed to local environment
- [ ] Supabase connected and migrations applied
- [ ] Logged in as admin user (Yaron)

**Test Execution:**

1. **Navigation & Initial Load**
   - [ ] Navigate to `/admin/orders/new`
   - [ ] Page loads without errors
   - [ ] Form renders with all fields visible
   - [ ] Customer name field auto-focused (cursor blinking)
   - [ ] Breadcrumb shows: Admin → Orders → New Order

2. **Customer Name Field**
   - [ ] Type Hebrew text "יוסי כהן" → RTL rendering correct
   - [ ] Clear field → Error appears: "שם לקוח חייב להכיל לפחות 2 תווים"
   - [ ] Type 1 character → Error persists
   - [ ] Type 2 characters → Error clears, green checkmark appears
   - [ ] Type 100+ characters → Error: "שם לקוח ארוך מדי"

3. **Customer Phone Field**
   - [ ] Tab from name field → Phone field focused
   - [ ] Phone field shows LTR direction (numbers)
   - [ ] Type "0501234567" → Valid, no error
   - [ ] Type "123" → Error: "מספר טלפון חייב להיות בפורמט ישראלי (05XXXXXXXX)"
   - [ ] Clear field (empty) → No error (optional field)

4. **Pickup Time Field**
   - [ ] Tab to pickup time → Field focused
   - [ ] Default time is 8:30 AM (same day if before 8:30, next day if after)
   - [ ] Default time rounded to 15-minute intervals
   - [ ] Select time 10:00 AM → No warning (within business hours)
   - [ ] Select time 14:00 PM → Warning dialog appears: "מחוץ לשעות פעילות. להמשיך בכל זאת?"
   - [ ] Click "אישור" → Time accepted, warning dismissed
   - [ ] Select time 7:00 AM → Warning appears (before business hours)
   - [ ] Select yesterday's date → (API validation in Story 1.5b submit)

5. **Notes Field**
   - [ ] Tab to notes field → Textarea focused
   - [ ] Type Hebrew text "הערות מיוחדות" → RTL rendering correct
   - [ ] Type 500 characters → Valid
   - [ ] Type 501 characters → Error: "הערות ארוכות מדי (מקסימום 500 תווים)"

6. **Tab Order**
   - [ ] Tab key: name → phone → pickup_time → notes → (wraps around)
   - [ ] Shift+Tab: Reverse order works

7. **Validation Behavior**
   - [ ] Trigger multiple errors (empty name, invalid phone) → Both errors display
   - [ ] Fix name → Name error clears, phone error persists
   - [ ] Fix phone → All errors cleared
   - [ ] Validation errors appear below fields (not modal/toast)
   - [ ] Input values preserved during validation

8. **Keyboard Shortcuts**
   - [ ] Press ESC → Confirmation dialog appears
   - [ ] Press ESC again → Dialog cancelled
   - [ ] Confirm clear → Form reset to defaults

9. **Responsive Layout** (resize browser)
   - [ ] Desktop (>1024px): Two-column layout
   - [ ] Tablet (768-1024px): Single-column layout
   - [ ] Mobile (<768px): Compact spacing

10. **Accessibility**
    - [ ] All fields have visible labels
    - [ ] Required fields marked with asterisk or "(required)"
    - [ ] Error messages announced by screen reader (test with VoiceOver/NVDA)
    - [ ] Tab order logical and complete
    - [ ] Color contrast meets WCAG AA standards

**Post-Conditions:**
- [ ] No console errors in browser DevTools
- [ ] No network errors in Network tab
- [ ] Form state ready for Story 1.5b menu item selector integration

---

## Next Steps

### Immediate Actions (Story 1.5a)

1. **Implement Mitigations**:
   - [ ] R-001: Add phone regex validation + Hebrew error messages
   - [ ] R-002: Implement business hours warning dialog + override logic

2. **Manual Testing**:
   - [ ] Execute manual testing checklist above
   - [ ] Cross-browser validation (Chrome, Firefox, Safari)
   - [ ] RTL rendering verification

3. **Code Review**:
   - [ ] Run `/bmad:bmm:workflows:code-review` before merge
   - [ ] Verify all AC criteria met
   - [ ] Check test coverage for critical paths

### Story 1.5b Integration

4. **Prepare for Menu Item Selector**:
   - [ ] Ensure form state structure supports `items[]` array field
   - [ ] Document form state shape for Story 1.5b
   - [ ] Verify tab order extension when menu selector added

### Future Test Automation (Epic 5)

5. **Automated Test Implementation** (deferred):
   - [ ] Set up Playwright E2E test suite
   - [ ] Set up Vitest unit/component tests
   - [ ] Implement P0 scenarios first (10 tests, 20 hours)
   - [ ] Run `/bmad:bmm:workflows:testarch-framework` to scaffold test infrastructure
   - [ ] Run `/bmad:bmm:workflows:testarch-atdd` to generate failing tests from ACs

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: Harel Date: ___________
- [ ] Tech Lead: Harel Date: ___________
- [ ] QA Lead: (TBD - Story 1.5a uses manual testing) Date: ___________

**Comments:**

_Manual testing approach for Story 1.5a due to early-stage development. Automated test infrastructure deferred to Epic 5 (Test Automation Sprint)._

---

## Appendix

### Knowledge Base References

- `risk-governance.md` - Risk classification framework (6 categories, scoring matrix)
- `probability-impact.md` - Risk scoring methodology (probability × impact = 1-9)
- `test-levels-framework.md` - Test level selection (E2E vs API vs Component vs Unit)
- `test-priorities-matrix.md` - P0-P3 prioritization criteria

### Related Documents

- **Story File**: [docs/sprint-artifacts/1-5a-build-desktop-order-creation-form.md](docs/sprint-artifacts/1-5a-build-desktop-order-creation-form.md)
- **Epic File**: docs/epics.md (Epic 1, Story 1.5a)
- **Architecture**: docs/architecture.md (Business hours, UI/UX guidelines)
- **API Schema**: lib/validation/schemas/order-schema.ts (Story 1.4 validation)

### Test Artifacts

**To Be Created (Manual Testing):**
- `docs/testing/story-1-5a-test-plan.md` - Detailed manual test script
- `docs/testing/story-1-5a-test-results.md` - Test execution results

**To Be Created (Future Automation):**
- `tests/e2e/orders/new-order-form.spec.ts` - E2E tests (Playwright)
- `tests/unit/validation/order-form-schema.test.ts` - Unit tests (Vitest)
- `tests/unit/utils/business-hours.test.ts` - Business hours logic (Vitest)
- `tests/components/OrderFormCustomerDetails.test.tsx` - Component tests (RTL)
- `tests/components/PickupTimeSelector.test.tsx` - Component tests (RTL)

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `.bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)
**Date**: 2025-12-20
