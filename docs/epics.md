---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - /Users/harel/Desktop/projects/lacomida-bot/kitchenos/docs/prd.md
  - /Users/harel/Desktop/projects/lacomida-bot/kitchenos/docs/architecture.md
  - /Users/harel/Desktop/projects/lacomida-bot/kitchenos/docs/ux-design-specification.md
lastStep: 4
workflowComplete: true
project_name: kitchenos
user_name: Harel
date: 2025-12-15
totalEpics: 8
totalStories: 66
requirementsCoverage: 100%
---

# KitchenOS - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for KitchenOS, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Order Capture & Management (FR1-FR14)**
- FR1: Auto-capture WhatsApp orders
- FR2: Send instant order confirmation via WhatsApp with order number
- FR3: Manual order creation via desktop (customer name, items, quantities, pickup time, notes)
- FR4: View complete order queue from any device
- FR5: Assign sequential order numbers
- FR6: Calculate total daily prep quantities across all orders
- FR7: Filter orders by status (Created, Packing, Ready, Complete, Collected)
- FR8: Filter orders by date and pickup time
- FR9: Search orders by customer name or order number
- FR10: Track order source (WhatsApp, email, phone, manual)
- FR11: Edit existing orders (items, quantities, pickup time, customer name)
- FR12: Cancel orders with confirmation dialog
- FR13: Search historical orders by customer name, order number, or date range
- FR14: Restore cancelled orders within 24 hours

**Menu & Item Management (FR15-FR19)**
- FR15: View complete menu with current prices
- FR16: Add new menu items (name, unit type, price per unit/weight)
- FR17: Edit menu items (name, price, unit type)
- FR18: Deactivate menu items (hide without deletion)
- FR19: Display available menu items during manual order creation

**Kitchen Operations - Packing & Fulfillment (FR20-FR30)**
- FR20: View order queue on tablet filtered by status
- FR21: Select order to begin packing (auto-marks status as "Packing")
- FR22: View order details (customer name, items, quantities, pickup time, special notes)
- FR23: Enter actual weights for each item
- FR24: Calculate order price based on actual weights and current menu prices
- FR25: Mark order status as "Ready" when packing complete
- FR26: Send payment link to customer via WhatsApp when marked "Ready"
- FR27: Consistent order status across all devices (no concurrent edit conflicts)
- FR28: Undo "Mark as Collected" within 5-second timeout
- FR29: Prevent concurrent modification with optimistic locking
- FR30: Add special notes during packing (e.g., "extra crispy kubana")

**Payment & Checkout (FR31-FR40)**
- FR31: View orders ready for pickup on tablet
- FR32: Search pickup queue by customer name or order number
- FR33: Display payment status (Paid, Pending, Unpaid)
- FR34: Generate Meshulam payment link
- FR35: Display payment link QR code to customers
- FR36: Mark orders as "Collected" with confirmation
- FR37: Auto-mark "No-Show" after configurable cutoff time
- FR38: Track payment method (card via Meshulam, cash, unpaid)
- FR39: Generate end-of-day payment reconciliation report
- FR40: Export payment data as CSV for accounting

**Inventory Management (FR41-FR47)**
- FR41: Set daily prep quantities for each menu item
- FR42: Track available vs allocated inventory in real-time
- FR43: Calculate inventory consumption as orders created
- FR44: Display low stock warnings (configurable threshold, default 10 units or 15%)
- FR45: Prevent order creation when available inventory < order quantity
- FR46: View current inventory status on tablet
- FR47: Adjust inventory quantities via desktop with audit trail

**Customer Experience (FR48-FR54)**
- FR48: Instant WhatsApp confirmation when customers place orders
- FR49: Display order number in confirmation message
- FR50: Receive payment link via WhatsApp when order marked "Ready"
- FR51: View real-time order status on TV dashboard in store
- FR52: Color-coded TV dashboard (🟡 Packing, 🟢 Ready)
- FR53: Display order number, customer first name, pickup time (sanitized data, no prices)
- FR54: TV auto-refresh every 5 seconds

**Owner/Admin Management (FR55-FR64)**
- FR55: Desktop access to all order management features
- FR56: Keyboard-optimized input for rapid order entry
- FR57: Review complete order queue before end of day
- FR58: Verify WhatsApp auto-capture accuracy and completeness
- FR59: Monitor system health, device connections, performance metrics
- FR60: View event logs for order lifecycle tracking
- FR61: Export weekly KPI data as CSV
- FR62: Browser notifications with sound alerts for order status changes (desktop)
- FR63: Mute notifications during non-peak hours
- FR64: Export complete order database for backup

**System Reliability & Error Handling (FR65-FR74)**
- FR65: Queue mutations locally when offline (IndexedDB)
- FR66: Auto-sync queued mutations when connection restored (FIFO)
- FR67: Display connection status indicator (🟢 Online, 🟡 Syncing, 🔴 Offline)
- FR68: Fallback to 5-second polling when WebSocket fails
- FR69: Resolve offline conflicts using priority-based model (Complete > Ready > Packing > Created)
- FR70: Validate queued operations, skip invalid mutations with error logging
- FR71: Display clear error messages for failures
- FR72: Visual loading indicators for operations >200ms
- FR73: Queue failed external API calls for retry with exponential backoff
- FR74: Handle burst order creation (50 orders in 60 seconds) without failure

**Audit & Logging (FR75-FR79)**
- FR75: Log all order lifecycle events with timestamps
- FR76: Log order modifications with actor identification (device ID)
- FR77: Track system uptime and offline events
- FR78: Cache active orders and last 7 days history in IndexedDB
- FR79: Auto-purge orders >7 days from local cache

**Multi-Device Coordination (FR80-FR86)**
- FR80: Support 7 concurrent device connections (4 tablets, 2 desktops, 1 TV)
- FR81: Synchronize order status with <500ms target latency (<1s acceptable under load)
- FR82: Display same order state on all devices simultaneously
- FR83: Tablet view switching (packing/cashier modes via bottom tab navigation)
- FR84: Desktop complete visibility into all kitchen operations
- FR85: TV read-only customer-facing order status view
- FR86: Handle network partition with graceful degradation

**User Experience & Feedback (FR87-FR95)**
- FR87: Immediate visual feedback on tap actions (color change, animation)
- FR88: 48px minimum touch targets for elderly-accessible design
- FR89: 18px base font size on tablets for readability
- FR90: Hebrew RTL layout with proper text flow
- FR91: Zero-configuration operation (no user accounts, no preferences)
- FR92: New staff complete 3 test orders without assistance within 15 minutes
- FR93: Prevent accidental destructive actions with forgiving tap zones and confirmations
- FR94: Full keyboard navigation on desktop with RTL-aware tab order
- FR95: Audible sound notifications for critical events (new order, order ready, low stock)

**Total: 95 Functional Requirements**

### Non-Functional Requirements

**Performance (NFR-P1 to NFR-P9)**
- NFR-P1: UI actions complete in 100ms (target) to 150ms (acceptable)
- NFR-P2: Order list renders in <100ms for up to 50 active orders
- NFR-P3: Real-time sync latency <500ms target, <1s acceptable under load
- NFR-P4: Initial page load <2s target, <3s acceptable on tablets
- NFR-P5: Touch response feedback <100ms target, <150ms acceptable
- NFR-P6: Handle peak load of 7 concurrent devices during Friday rush
- NFR-P7: Process burst order creation (25 orders/60s) without delivery failure
- NFR-P8: Database queries return in <200ms for datasets up to 10,000 orders
- NFR-P9: Under peak load, maintain 95% of baseline performance metrics

**Reliability & Availability (NFR-R1 to NFR-R12)**
- NFR-R1: 95% uptime during business hours (Thursday 6pm - Friday 2pm)
- NFR-R2: Auto-recover from WebSocket failures within 5 seconds
- NFR-R3: Offline mutation queue sync <5s when connection restored
- NFR-R4: Prevent data loss with IndexedDB persistence + automatic retry
- NFR-R5: Deterministic conflict resolution (priority-based model)
- NFR-R6: Eventual consistency <5 seconds under normal network conditions
- NFR-R7: Failed API calls retry with exponential backoff, alert after 3 failures
- NFR-R8: Cache active orders + 7 days history, auto-purge >7 days
- NFR-R9: Connection status indicator updates <500ms
- NFR-R10: Daily backups with 7-day retention, <1h recovery time
- NFR-R11: Gracefully handle IndexedDB quota exhaustion
- NFR-R12: Deployments complete in <10 minutes with auto-rollback

**Security (NFR-S1 to NFR-S8)**
- NFR-S1: All communication uses TLS 1.3 encryption
- NFR-S2: No credit card data storage (Meshulam handles all card data)
- NFR-S3: API keys stored in environment variables (never in version control)
- NFR-S4: Supabase RLS policies enforce data isolation for multi-tenant future
- NFR-S5: Sanitized customer data on TV (first name only, no prices/addresses)
- NFR-S6: IndexedDB stores only non-sensitive data (no payment info)
- NFR-S7: Event logs record actor ID for all modifications
- NFR-S8: Desktop auth with 8-hour session timeout

**Usability (NFR-U1 to NFR-U18)**
- NFR-U1: Malka (80 years old) <5% error rate after 4 Fridays
- NFR-U2: 48px × 48px minimum touch targets (exceeds WCAG AAA 44px)
- NFR-U3: 8px minimum spacing between interactive elements
- NFR-U4: 18px base font on tablets, 16px on desktop
- NFR-U5: 7:1 color contrast ratio (WCAG AAA), never color alone
- NFR-U6: Color-coded status maintains 7:1 contrast across all states
- NFR-U7: 5-second undo window for destructive actions with toast notification
- NFR-U8: Immediate visual confirmation <100ms for successful actions
- NFR-U9: Dual-mode confirmation (visual + auditory) for critical actions
- NFR-U10: Error messages: 18px font, icon, plain Hebrew, actionable guidance
- NFR-U11: Hebrew RTL layout with mirrored UI chrome
- NFR-U12: Hebrew locale number formatting (₪ symbol, DD/MM/YYYY)
- NFR-U13: Zero-configuration operation (no accounts, no preferences)
- NFR-U14: Loading indicators for operations >200ms
- NFR-U15: Critical info 2x visual weight vs secondary info
- NFR-U16: 3-5 primary elements per tablet screen (reduced cognitive load)
- NFR-U17: Positive reinforcement for completed orders (animation, sound)
- NFR-U18: Touch works with wet/flour-covered fingers

**Maintainability (NFR-M1 to NFR-M11)**
- NFR-M1: TypeScript strict mode with 100% type coverage for domain logic
- NFR-M2: Versioned database migrations with rollback capability
- NFR-M3: Event logging captures all order lifecycle events with timestamps
- NFR-M4: Capture user error events with device ID and timestamp
- NFR-M5: CSV export for weekly KPI data
- NFR-M6: Critical bugs: 4h acknowledge, 24h resolution during business hours
- NFR-M7: Zero-downtime deployments with rollback capability
- NFR-M8: Admin dashboard displays device status, latency, errors (5s refresh)
- NFR-M9: Architecture Decision Records (ADRs) for key technical choices
- NFR-M10: Test data reset for dev/staging environments
- NFR-M11: Health check endpoint (200 OK when all services operational)

**Integration Reliability (NFR-I1 to NFR-I8)**
- NFR-I1: 98% WhatsApp auto-capture accuracy with manual fallback
- NFR-I2: Failed WhatsApp parse alerts owner within 30 seconds
- NFR-I3: WhatsApp confirmation delivers within 3 seconds with retry
- NFR-I4: Meshulam payment link generation <2s with manual fallback
- NFR-I5: Payment link generation failure rate <1%
- NFR-I6: n8n workflow queues failed sends, alerts after 3 failures
- NFR-I7: Supabase Realtime reconnects within 5 seconds automatically
- NFR-I8: Payment status updates sync to all devices within 5 seconds

**Compliance (NFR-C1 to NFR-C2)**
- NFR-C1: Israeli data protection regulation compliance
- NFR-C2: PCI-DSS compliance via Meshulam proxy (no card data stored)

**Total: 42 Non-Functional Requirements**

### Additional Requirements

**Architecture Implementation Requirements:**

1. **Starter Template (Critical for Epic 1, Story 1):**
   - Use Official Next.js CLI: `npx create-next-app@latest kitchenos --typescript --tailwind --eslint --app`
   - Initialize shadcn/ui: `npx shadcn@latest init`
   - Next.js 15+ with App Router, TypeScript, Tailwind CSS, ESLint

2. **Infrastructure & Deployment:**
   - Vercel hosting (serverless, zero-config)
   - Supabase database + Realtime (PostgreSQL)
   - PostgreSQL snake_case naming conventions (tables, columns, constraints)

3. **API Design Standards:**
   - RESTful API with kebab-case endpoints
   - Next.js App Router route handlers (`app/api/*/route.ts`)
   - TypeScript interfaces with camelCase
   - Query parameters in snake_case (matches database)

4. **Database Schema:**
   - Tables: orders, order_items, customers, dishes, inventory, system_events
   - Foreign keys: `{referenced_table}_id` convention
   - Indexes: `idx_{table}_{column(s)}` convention
   - RLS policies for data isolation
   - Versioned migrations with rollback capability

5. **Security Implementation:**
   - Supabase Auth for desktop users (session-based)
   - Environment variables for secrets (NEVER in version control)
   - TLS 1.3 encryption (enforced by Supabase/Vercel)
   - Row Level Security policies

6. **Monitoring & Logging:**
   - Event logging for order lifecycle (system_events table)
   - Error tracking for debugging
   - Performance metrics monitoring
   - Weekly KPI CSV export functionality

**UX Design Requirements:**

1. **Visual Design Standards (Classic Kanban Theater):**
   - Color palette: Gray (New), Blue (Started), Orange (Ready), Green (Complete)
   - HSL color format: `hsl(0 0% 85%)` for easy manipulation
   - Inter font family with excellent Hebrew support
   - 8px base grid spacing system (all spacing multiples of 8px)
   - Typography: 16px minimum body text, 18px button text, 24px TV minimum

2. **8 Custom Components (Beyond shadcn/ui Base):**
   - **KanbanBoard**: Horizontal scroll-snap container with `scroll-snap-type: x mandatory`
   - **OrderCard**: Multi-state card with shimmer sync animation (0.7-1.0 opacity)
   - **KanbanColumn**: Column header with dynamic count badges
   - **TVOrderDisplay**: Large-format for 40" TV viewing (24px minimum text)
   - **SyncIndicator**: Real-time WebSocket status (🟢 Connected, 🟡 Degraded, 🔴 Offline)
   - **StatusButton**: Touch-optimized 44px × 44px with 500ms debounce
   - **TimeElapsed**: Color escalation (0-10min gray, 10-20min amber, 20+ amber + ⏱️)
   - **OfflineQueueIndicator**: Network state with pending mutation count

3. **Accessibility Standards (WCAG 2.1 Level AA + Enhancements):**
   - **Touch targets**: 44px × 44px minimum (upgraded from PRD's 48px, WCAG AAA)
   - **Spacing**: 8px minimum between interactive elements
   - **Color contrast**: 4.5:1 text, 3:1 UI components
   - **Redundant encoding**: Color + Text + Icon (never color alone)
   - **Hebrew RTL**: Full `dir="rtl"` with logical CSS properties (`margin-inline-start`)
   - **Screen reader**: Semantic HTML, ARIA labels, live regions
   - **Keyboard navigation**: Full Tab support, visible focus (2px blue outline)
   - **Reduced motion**: Respect `prefers-reduced-motion` media query

4. **Responsive Breakpoint Strategy (Portrait-First, NOT Mobile-First):**
   - **Portrait Tablet (PRIMARY)**: 768px × 1024px - Single-column Kanban, horizontal scroll
   - **Landscape Tablet**: Show rotation warning "Please rotate to portrait mode"
   - **TV Display**: 1920px × 1080px - Grid layout (3-4 columns)
   - **Desktop**: >1024px - Degraded experience with advisory message
   - **Mobile**: <767px - Unsupported, show "Please use iPad" message

5. **UX Pattern Implementation Rules (6 Critical Patterns):**
   - **Button Hierarchy**: Primary (blue, 44px, full-width), Secondary (outline, 44px)
   - **Feedback Patterns**: Multi-level (optimistic UI → server → shimmer → TV update)
   - **Status Indication**: Color + Text + Icon redundancy (Gray/Blue/Orange/Green)
   - **Touch Interaction**: Entire card tappable (not just button), 500ms debounce, scale-98 on active
   - **Empty & Loading States**: Skeleton placeholders matching layout, positive messaging
   - **Offline & Sync**: Shimmer timeout (0-150ms none, 150-500ms subtle, >500ms clear)

### FR Coverage Map

**Epic 1: WhatsApp Order Capture & Display**
- FR1, FR2, FR3, FR4, FR5 (Order Capture & Management)
- FR15, FR16, FR17, FR18, FR19 (Menu & Item Management)
- FR42, FR43, FR44, FR45, FR46 (WhatsApp Integration - mapped from Customer Experience FR48-FR54)

**Epic 2: Order Status Management & Customer Updates**
- FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14 (Order Management)
- FR20, FR21, FR22, FR23 (Kitchen Operations)
- FR47, FR48, FR49, FR50, FR51 (Customer WhatsApp - mapped from Customer Experience)

**Epic 3: Packing Workflow & Quality Assurance**
- FR24, FR25, FR26, FR27, FR28 (Kitchen Operations - Packing)
- FR29, FR30 (Kitchen Operations - Special Notes)
- FR31, FR32, FR33 (Payment & Checkout - Display/Search)

**Epic 4: Multi-Station Operations & Real-Time Sync**
- FR34, FR35, FR36, FR37, FR38 (Payment & Checkout - Payment Links/Collection)
- FR39, FR40 (Payment Reconciliation)
- FR80, FR81, FR82, FR83, FR84, FR85, FR86 (Multi-Device Coordination)

**Epic 5: Production Analytics & Business Intelligence**
- FR52, FR53, FR54 (Customer Experience - TV Dashboard)
- FR55, FR56, FR57, FR58, FR59 (Owner/Admin Management - Monitoring)
- FR60, FR61 (Owner/Admin - KPI/Logs)
- FR75, FR76, FR77, FR78, FR79 (Audit & Logging)

**Epic 6: Advanced Customer Features**
- FR41, FR42, FR43, FR44, FR45, FR46, FR47 (Inventory Management)
- FR62, FR63, FR64 (Owner/Admin - Notifications/Export)

**Epic 7: Administrative & Configuration Management**
- FR87, FR88, FR89, FR90, FR91, FR92, FR93, FR94, FR95 (User Experience & Feedback)

**Epic 8: System Resilience & Edge Cases**
- FR65, FR66, FR67, FR68, FR69, FR70, FR71, FR72, FR73, FR74 (System Reliability & Error Handling)

**Total Coverage:** 95 FRs mapped across 8 epics

## Epic List

### Epic 1: WhatsApp Order Capture & Display
**User Value:** Yaron can receive WhatsApp orders that automatically appear on kitchen tablets, eliminating manual Thursday night order entry ritual.

**Requirements Coverage:**
- FR1-FR5: Order capture, confirmation, numbering
- FR15-FR19: Basic kitchen display, tablet layout
- FR42-FR46: WhatsApp integration
- NFR-P1, NFR-P2: Performance targets
- NFR-SEC1-SEC3: Basic security
- Architecture Req 1: Next.js starter template
- UX Req 1: Visual design standards

**Deliverable:** Working system where WhatsApp orders flow automatically to kitchen tablets with basic Kanban display.

---

### Epic 2: Order Status Management & Customer Updates
**User Value:** Malka can update order status with simple taps, and customers receive automatic progress notifications, building trust and reducing "where's my order?" calls.

**Requirements Coverage:**
- FR6-FR14: Status transitions, validation, notifications
- FR20-FR23: Status workflow, visual indicators
- FR47-FR51: Customer WhatsApp notifications
- NFR-P3: Status update performance
- NFR-REL1-REL3: Reliability requirements
- UX Req 2: Classic Kanban Theater colors

**Deliverable:** Complete order lifecycle management with automatic customer communication.

---

### Epic 3: Packing Workflow & Quality Assurance
**User Value:** Malka can efficiently pack orders with guided workflow, ensuring nothing is forgotten and every order meets quality standards.

**Requirements Coverage:**
- FR24-FR28: Packing checklist, item verification, validation
- FR29-FR33: Quality checks, special requirements
- NFR-P4: Packing workflow performance
- NFR-ACC1-ACC4: Accessibility for 80-year-old user
- UX Req 3: 44px touch targets, high contrast

**Deliverable:** Zero-training packing workflow that prevents mistakes and ensures quality.

---

### Epic 4: Multi-Station Operations & Real-Time Sync
**User Value:** Kitchen team (cooking, packing, expediting stations) can work simultaneously with instant synchronization, eliminating coordination confusion.

**Requirements Coverage:**
- FR34-FR38: Multi-tablet sync, real-time updates, conflict resolution
- FR39-FR41: Offline handling, queue management
- NFR-P5-P9: Real-time sync performance (<100ms ideal)
- NFR-REL4-REL6: Sync reliability
- UX Req 4: Shimmer loading states

**Deliverable:** Multi-station kitchen operations with bulletproof synchronization.

---

### Epic 5: Production Analytics & Business Intelligence
**User Value:** Yaron can understand kitchen performance, identify bottlenecks, and make data-driven decisions about staffing and process improvements.

**Requirements Coverage:**
- FR52-FR57: Time tracking, metrics, reporting
- FR58-FR62: Analytics dashboard, trends, insights
- NFR-P6: Reporting performance
- NFR-MAINT1-MAINT3: Code quality and maintainability

**Deliverable:** Comprehensive analytics showing order flow, station performance, and business trends.

---

### Epic 6: Advanced Customer Features
**User Value:** Customers can track orders in real-time, provide feedback, and enjoy transparent communication, building loyalty and trust.

**Requirements Coverage:**
- FR63-FR68: Order tracking page, ETA, feedback
- FR69-FR73: Customer portal, rating system
- NFR-P7: Customer portal performance
- NFR-SEC4-SEC6: Customer data security

**Deliverable:** Customer-facing features for tracking and feedback.

---

### Epic 7: Administrative & Configuration Management
**User Value:** Yaron can configure business rules, manage users, and adjust system behavior without developer intervention.

**Requirements Coverage:**
- FR74-FR79: Business hours, settings, user management
- FR80-FR84: Menu sync, configuration panel
- NFR-SEC7-SEC9: Admin security, audit logging
- NFR-MAINT4-MAINT6: Deployment and monitoring

**Deliverable:** Complete administrative control panel with security and audit trails.

---

### Epic 8: System Resilience & Edge Cases
**User Value:** System works reliably in real-world conditions including poor connectivity, tablet wake-up, and error recovery, ensuring zero order loss.

**Requirements Coverage:**
- FR85-FR89: Error handling, offline mode, recovery
- FR90-FR95: System health, diagnostics, edge cases
- NFR-REL7-REL9: Offline resilience, error recovery
- Architecture Req 2-6: Supabase setup, real-time infrastructure
- UX Req 5: Error handling patterns

**Deliverable:** Production-hardened system that handles all edge cases gracefully.

---

## Epic 1: WhatsApp Order Capture & Display - Stories

### Story 1.1: Initialize Next.js Project with Supabase and shadcn/ui

As a developer,
I want to set up the foundational Next.js project with Supabase backend and shadcn/ui component library,
So that we have a production-ready foundation for building KitchenOS features.

**Acceptance Criteria:**

**Given** a new project needs to be created
**When** running the official Next.js CLI and shadcn/ui initialization
**Then** the project structure includes:
- Next.js 15+ with App Router, TypeScript, Tailwind CSS, ESLint
- Supabase client configured with environment variables
- shadcn/ui initialized with Inter font family
- Base Tailwind config with 8px spacing system and HSL color variables
**And** the project runs locally at `localhost:3000` without errors
**And** Supabase connection is verified with a test query
**And** Environment variables template (`.env.example`) includes `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Technical Requirements:**
- Command: `npx create-next-app@latest kitchenos --typescript --tailwind --eslint --app`
- Command: `npx shadcn@latest init`
- TypeScript strict mode enabled
- Tailwind config (`tailwind.config.ts`) must include:
```typescript
theme: {
  extend: {
    spacing: { /* 8px base grid: 1: '8px', 2: '16px', etc */ },
    colors: {
      status: {
        new: 'hsl(0 0% 85%)',      // Gray
        started: 'hsl(217 91% 85%)', // Blue
        ready: 'hsl(25 95% 85%)',    // Orange
        complete: 'hsl(142 76% 85%)' // Green
      }
    }
  }
}
```

---

### Story 1.2: Create Menu Management Database Schema and API

As a developer,
I want to create the database schema and API endpoints for menu item management,
So that the system can store and retrieve available menu items for orders.

**Acceptance Criteria:**

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

**Database Requirements:**
- Migration file: `001_create_dishes_table.sql`
- Create ENUM first: `CREATE TYPE unit_type AS ENUM ('unit', 'weight');`
- Table name: `dishes` (snake_case)
- Index: `idx_dishes_is_active` on `is_active` column
- Versioned migration with rollback capability

---

### Story 1.3: Build Desktop Menu Management UI

As Yaron,
I want to manage menu items (add, edit, deactivate) from my desktop,
So that I can maintain an up-to-date menu without developer help.

**Acceptance Criteria:**

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

---

### Story 1.4: Create Orders Database Schema and Manual Order Entry API

As a developer,
I want to create the orders database schema and API endpoints,
So that orders can be stored and retrieved from the system.

**Acceptance Criteria:**

**Given** the dishes table exists
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

**Database Requirements:**
- Migration file: `002_create_orders_tables.sql`
- Create ENUMs first:
  - `CREATE TYPE order_status AS ENUM ('created', 'packing', 'ready', 'collected', 'cancelled', 'no_show');`
  - `CREATE TYPE order_source AS ENUM ('whatsapp', 'manual', 'email', 'phone');`
- `order_number` is SERIAL (auto-incrementing, never resets - global unique sequence)
- Foreign keys: `order_items.order_id` → `orders.id`, `order_items.dish_id` → `dishes.id`
- Indexes: `idx_orders_status`, `idx_orders_pickup_time`
- Constraint: `quantity` must be > 0

---

### Story 1.5a: Build Desktop Order Creation Form

As Yaron,
I want to enter customer details and pickup time for manual orders,
So that I can start creating phone/email orders in the system.

**Acceptance Criteria:**

**Given** I'm on the desktop at `/admin/orders/new`
**When** the page loads
**Then** I see a form with fields: customer name, phone (optional), pickup time, notes
**And** customer name field is auto-focused
**When** I fill customer name and pickup time
**Then** form validation shows these fields as valid (green checkmark)
**When** validation fails (missing customer name, past pickup time)
**Then** I see specific error messages for each issue
**And** my input is preserved
**When** pickup time is within business hours
**Then** it's accepted normally
**When** pickup time is outside business hours
**Then** a warning appears: "מחוץ לשעות פעילות. להמשיך בכל זאת?" with override option

**UI Requirements:**
- Desktop-optimized layout (>1024px)
- Hebrew RTL for customer name and notes
- Date/time picker for pickup time (defaults to next available slot based on business hours)
- Auto-focus on customer name field
- Tab order: customer name → phone → pickup time → notes

---

### Story 1.5b: Add Menu Item Selector and Order Submission

As Yaron,
I want to select menu items and submit manual orders,
So that I can complete phone/email order entry.

**Acceptance Criteria:**

**Given** I've filled customer details in Story 1.5a form
**When** I see the menu item selector
**Then** all active dishes are shown in a searchable dropdown
**When** I select a menu item
**Then** it appears in the order summary with a quantity input (default: 1)
**And** I can adjust quantity using +/- buttons or direct input
**And** I can remove the item with an X button
**When** I add multiple items
**Then** the order summary shows all items with total item count
**When** I have at least one item and valid customer details
**Then** the "Create Order" button becomes enabled (green, prominent)
**When** I submit the form
**Then** the order is created with `source='manual'` and `status='created'`
**And** I see a confirmation toast with the assigned order number
**And** I'm redirected to `/admin/orders`
**When** I try to submit with no items
**Then** "Create Order" button remains disabled
**And** I see message: "יש להוסיף לפחות פריט אחד" (Must add at least one item)

**UI Requirements:**
- Searchable menu selector with Hebrew text support
- Real-time order summary panel (sticky on right side)
- Quantity controls: +/- buttons (44px touch targets for future tablet use)
- Keyboard shortcuts: Ctrl+Enter to submit
- Loading state during order creation

---

### Story 1.6: Build Tablet Kanban Order Display

As Malka,
I want to see all orders displayed on a tablet in a Kanban-style board,
So that I can view the current order queue at a glance.

**Acceptance Criteria:**

**Given** I'm on a tablet at `/kitchen`
**When** the page loads
**Then** I see a horizontal scrolling Kanban board with 4 columns: "Created", "Packing", "Ready", "Collected"
**And** each column shows a count badge with the number of orders in that status
**And** orders are displayed as cards showing: order number, customer name, pickup time, item count
**When** there are multiple orders in a column
**Then** they are sorted by pickup time (earliest first)
**And** I can scroll vertically within each column independently
**When** an order's pickup time is within 30 minutes
**Then** it displays with a subtle highlight
**When** there are no orders in a column
**Then** I see a friendly empty state message: "אין הזמנות" (No orders)
**And** the page refreshes order data every 5 seconds automatically (configurable for testing)

**UI Requirements:**
- Portrait tablet optimization (768px × 1024px)
- Horizontal scroll with scroll-snap (`scroll-snap-type: x mandatory`)
- Classic Kanban Theater colors per status (Gray/Blue/Orange/Green)
- 18px minimum font size for readability
- Touch-optimized card spacing (8px minimum)
- Pull-to-refresh gesture support
- Hebrew RTL for customer names and text

**Technical Requirements:**
- Refresh interval configurable via environment variable (default: 5000ms, min: 1000ms for testing)

---

### Story 1.7a: Implement WhatsApp Webhook and Message Parser

As Yaron,
I want WhatsApp messages to automatically create orders in the system,
So that I eliminate manual Thursday night order entry.

**Acceptance Criteria:**

**Given** n8n workflow is configured with WhatsApp webhook
**When** a WhatsApp message arrives in the expected format
**Then** the webhook calls `/api/orders/whatsapp` with message content
**And** the API parses the message to extract: customer name, items with quantities, pickup time
**And** a new order is created with `source='whatsapp'` and `status='created'`
**And** an auto-assigned order number is generated
**When** message parsing fails (unrecognized format, missing info)
**Then** the system logs the error with full message content to `system_events`
**And** the failed message is stored in `failed_whatsapp_messages` table
**And** an email alert is sent to Yaron with message details and parse error
**And** email subject: "⚠️ WhatsApp Order Failed - {customer_phone}"
**When** parsing partially succeeds (e.g., name found but no items)
**Then** the message is still marked as failed
**And** the email includes the partially parsed data

**Technical Requirements:**
- API endpoint: `POST /api/orders/whatsapp`
- Message parser handles Hebrew text and numeric quantities
- Validation: customer name required, at least one item, future pickup time
- Create table: `failed_whatsapp_messages` with columns: `id`, `phone`, `message_text`, `parse_error`, `received_at`
- Email integration (SendGrid or similar) for failure alerts
- Event logging: all attempts logged to `system_events`

---

### Story 1.7b: Add WhatsApp Order Confirmation with Retry

As a system,
I want to send automatic WhatsApp confirmations when orders are successfully captured,
So that customers receive immediate feedback.

**Acceptance Criteria:**

**Given** an order is created from WhatsApp (Story 1.7a)
**When** order creation succeeds
**Then** a WhatsApp confirmation is queued to be sent to the customer
**And** the confirmation message format: "הזמנה מספר {number} התקבלה! מספר פריטים: {count}. זמן איסוף: {time}"
**When** the n8n WhatsApp API call succeeds
**Then** confirmation status is logged as 'sent' in `system_events`
**When** the WhatsApp API is unavailable or returns error
**Then** the confirmation is queued for retry with exponential backoff (1s, 5s, 15s - max 3 attempts)
**And** retry attempts are logged to `system_events`
**When** all 3 retry attempts fail
**Then** the confirmation is marked as 'failed'
**And** Yaron sees an alert in the admin dashboard (will be built in future story)
**When** customer_phone is null (phone order entered manually)
**Then** no confirmation is sent and no error is logged

**Technical Requirements:**
- n8n workflow handles confirmation sending
- Retry logic with exponential backoff
- Event logging for all confirmation attempts (success/failure)
- Graceful handling when phone number is missing

---

### Story 1.8: Add Order Search and Filtering on Desktop

As Yaron,
I want to search and filter orders by customer name, order number, status, and date,
So that I can quickly find specific orders.

**Acceptance Criteria:**

**Given** I'm on the desktop at `/admin/orders`
**When** the page loads
**Then** I see all orders from today sorted by pickup time
**And** I see filter controls: status dropdown, date range picker, search input
**When** I type in the search input
**Then** results filter in real-time by customer name or order number (partial match)
**When** I select a status filter
**Then** only orders with that status are shown
**And** the count updates to reflect filtered results
**When** I select a date range
**Then** only orders within that range are shown
**When** I combine multiple filters
**Then** all filters apply together (AND logic)
**And** the URL updates with query parameters to preserve filter state
**When** I bookmark or share the URL
**Then** the filters are restored when opening the link
**When** there are no results
**Then** I see a message: "לא נמצאו הזמנות" (No orders found) with a "Clear Filters" button

**UI Requirements:**
- Desktop-optimized layout
- Debounced search input (300ms delay)
- Keyboard shortcuts: Ctrl+F focuses search, Esc clears search
- Loading indicator during filter operations
- Filter state persisted in URL query params

---

## Epic 2: Order Status Management & Customer Updates - Stories

### Story 2.1: Implement Order Status Transition Logic and API

As a developer,
I want to implement status transition logic with validation rules,
So that orders move through the correct workflow states without invalid transitions.

**Acceptance Criteria:**

**Given** an order exists with current status
**When** a status update is requested via `/api/orders/[id]/status`
**Then** the system validates the transition is allowed:
- `created` → `packing` ✓
- `packing` → `ready` ✓
- `ready` → `collected` ✓
- `collected` → `created` ✗ (invalid)
- Any status → `cancelled` ✓
**And** valid transitions update the `status` and `updated_at` fields
**And** invalid transitions return HTTP 400 with error message
**When** transitioning to `packing`
**Then** the `packing_started_at` timestamp is recorded
**When** transitioning to `ready`
**Then** the `ready_at` timestamp is recorded
**And** the system triggers WhatsApp notification workflow
**When** transitioning to `collected`
**Then** the `collected_at` timestamp is recorded
**And** concurrent updates are prevented using optimistic locking (version field)

**Database Requirements:**
- Migration file: `003_add_status_timestamps.sql`
- Alters table: `orders` (from migration 002)
- Add columns: `packing_started_at` (TIMESTAMP), `ready_at` (TIMESTAMP), `collected_at` (TIMESTAMP), `version` (INTEGER DEFAULT 1)
- Add index: `idx_orders_version` on `version` for optimistic locking queries

---

### Story 2.2: Add Tablet Order Card Tap-to-Update Status

As Malka,
I want to tap an order card on the tablet to update its status,
So that I can move orders through the workflow with simple touches.

**Acceptance Criteria:**

**Given** I'm viewing the Kanban board at `/kitchen`
**When** I tap an order card in the "Created" column
**Then** the order status immediately changes to "Packing" (optimistic UI)
**And** the card smoothly animates to the "Packing" column
**And** the column count badges update instantly
**When** the server confirms the update
**Then** the card displays normally
**When** the server rejects the update (conflict)
**Then** the card animates back to "Created" column
**And** I see a toast notification: "ההזמנה עודכנה ע"י מישהו אחר" (Order updated by someone else)
**When** I tap an order in "Packing" column
**Then** it moves to "Ready"
**When** I tap an order in "Ready" column
**Then** it moves to "Collected"
**When** I tap an order in "Collected" column
**Then** nothing happens (final state)

**UI Requirements:**
- Entire card is tappable (44px × 44px minimum touch target)
- 500ms debounce to prevent accidental double-taps (configurable via prop for testing)
- Scale animation (scale-98) on active touch
- Shimmer loading state during server roundtrip (<150ms subtle, >500ms clear)
- Touch works with wet/flour-covered fingers

**Technical Requirements:**
- Debounce delay configurable via component prop (default: 500ms, test: 0ms)

---

### Story 2.3: Build WhatsApp Notification Service for Status Updates

As a developer,
I want to create a notification service that sends WhatsApp messages on status changes,
So that customers receive automatic updates about their orders.

**Acceptance Criteria:**

**Given** an order transitions to "Ready" status
**When** the status update is saved
**Then** a notification job is queued with order details
**And** the n8n webhook is called with payload: `{order_number, customer_phone, customer_name, status}`
**When** n8n successfully sends the WhatsApp message
**Then** a confirmation is logged in `system_events` table
**When** n8n fails to send (network error, invalid phone)
**Then** the job is retried with exponential backoff (3 attempts: 1s, 5s, 15s)
**And** after 3 failures, the job is marked as failed
**And** an alert appears in Yaron's admin dashboard
**When** customer_phone is null
**Then** no notification is sent and no error is logged (phone orders scenario)

**Technical Requirements:**
- Create `notification_queue` table with columns: `id`, `order_id`, `status`, `attempts`, `last_attempt_at`, `created_at`
- API endpoint: `POST /api/notifications/send`
- WhatsApp message template: "הזמנה {order_number} מוכנה לאיסוף! {customer_name}, ניתן להגיע לאסוף את ההזמנה."
- Event logging for all notification attempts

---

### Story 2.4: Implement 5-Second Undo for "Mark as Collected"

As Malka,
I want a 5-second window to undo accidental "Mark as Collected" actions,
So that I can recover from mistakes without Yaron's help.

**Acceptance Criteria:**

**Given** I tap an order in the "Ready" column
**When** it transitions to "Collected"
**Then** a toast notification appears: "ההזמנה סומנה כנאספה. [בטל]" with countdown timer
**And** the card remains visible in "Collected" column with dimmed opacity
**And** a countdown (5... 4... 3... 2... 1...) is displayed
**When** I tap the "בטל" (Undo) button within 5 seconds
**Then** the order status reverts to "Ready"
**And** the card animates back to "Ready" column
**And** I see confirmation: "הפעולה בוטלה" (Action cancelled)
**When** 5 seconds elapse without undo
**Then** the toast disappears
**And** the card displays with full opacity
**And** the status change is finalized
**When** I navigate away or refresh during the undo window
**Then** the undo opportunity is lost (status remains "Collected")

**UI Requirements:**
- Toast notification with 44px × 44px "Undo" button
- Visual countdown timer (progress bar or seconds remaining)
- Toast auto-dismisses after 5 seconds (configurable for testing)
- Hebrew RTL text in toast

**Technical Requirements:**
- Undo window duration configurable via environment variable (default: 5000ms, test: 100ms)
- Use mock-friendly timer implementation (React useEffect with cleanup)

---

### Story 2.5: Add Order Detail Modal on Desktop

As Yaron,
I want to click an order on desktop to see complete details,
So that I can review order information without navigating away.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/orders`
**When** I click any order row
**Then** a modal appears showing:
- Order number (large, prominent)
- Customer name and phone
- Pickup time
- Current status with visual indicator
- All ordered items with quantities
- Source (WhatsApp/Manual/Email/Phone)
- Notes (if any)
- Timestamps: created, packing started, ready, collected
**And** the modal has a "Close" button (X in top-right)
**When** I press Escape key
**Then** the modal closes
**When** I click outside the modal
**Then** the modal closes
**When** I click "Edit Order" button in modal
**Then** I'm navigated to `/admin/orders/[id]/edit` with form pre-filled

**UI Requirements:**
- Desktop-optimized modal (max-width 600px)
- Keyboard accessible (focus trap, Esc to close)
- Status shown with Classic Kanban Theater color
- Hebrew RTL for customer name and notes
- Copy order number button (clipboard functionality)

---

### Story 2.6: Implement Real-Time Supabase Subscription for Order Updates

As Malka,
I want the tablet to automatically update when anyone changes order status,
So that I always see the current state without manual refresh.

**Acceptance Criteria:**

**Given** the tablet Kanban board is open at `/kitchen`
**When** Supabase Realtime subscription is established
**Then** I see a connection indicator: 🟢 "מחובר" (Connected)
**When** another user (Yaron on desktop, another tablet) updates order status
**Then** my tablet receives the update via WebSocket within 500ms
**And** the affected order card smoothly animates to the new column
**And** column count badges update automatically
**When** I update an order locally and another user updates the same order simultaneously (race condition)
**Then** the system uses last-write-wins conflict resolution (based on `updated_at` timestamp)
**And** my update may be overwritten by the other user's update if theirs arrives later
**And** I see a toast notification: "ההזמנה עודכנה ע"י מישהו אחר" (Order updated by someone else)
**And** the order displays the final server state
**When** the WebSocket connection drops
**Then** the indicator changes to 🟡 "מחדש חיבור..." (Reconnecting)
**And** the system falls back to 5-second polling automatically
**When** the connection is restored
**Then** the indicator returns to 🟢 and WebSocket resumes
**And** any missed updates are fetched and applied
**When** the tablet is offline entirely
**Then** the indicator shows 🔴 "לא מחובר" (Offline)
**And** a banner appears: "אין חיבור לאינטרנט. שינויים יישמרו מקומית."

**Technical Requirements:**
- Supabase Realtime channel: `orders:*`
- Subscribe to INSERT, UPDATE, DELETE events on `orders` table
- Fallback polling interval: 5 seconds
- Automatic reconnection with exponential backoff (max 30s)
- Connection status persisted in React state
- Basic conflict handling: last-write-wins using `updated_at` timestamp
- **Note:** Epic 4, Story 4.1 will enhance this to priority-based conflict resolution

---

### Story 2.7: Add Status Change History Log

As Yaron,
I want to see a history of all status changes for each order,
So that I can track who did what and when for accountability.

**Acceptance Criteria:**

**Given** order status is updated
**When** the status transition is saved
**Then** an entry is added to `system_events` table with:
- `event_type`: 'status_change'
- `order_id`: the affected order
- `old_status`: previous status
- `new_status`: new status
- `actor_id`: device identifier or user ID
- `timestamp`: when it occurred
**And** the entry includes device metadata (tablet/desktop, IP address)
**When** I open order detail modal on desktop
**Then** I see a "History" tab showing all status changes
**And** each entry shows: timestamp, status change (created → packing), actor (Tablet 1, Desktop)
**And** entries are sorted newest-first
**When** there are more than 10 history entries
**Then** pagination is applied (10 per page)

**Database Requirements:**
- Create `system_events` table if not exists
- Columns: `id`, `event_type`, `order_id`, `old_status`, `new_status`, `actor_id`, `metadata` (JSONB), `timestamp`
- Index: `idx_system_events_order_id` on `order_id`

---

### Story 2.8: Implement Order Cancellation Workflow

As Yaron,
I want to cancel orders with a reason and confirmation dialog,
So that cancelled orders are tracked properly and can be restored if needed.

**Acceptance Criteria:**

**Given** I'm viewing an order on desktop
**When** I click "Cancel Order" button
**Then** a confirmation dialog appears asking: "האם לבטל הזמנה {order_number}?"
**And** I see a dropdown to select cancellation reason:
- "Customer requested cancellation"
- "Unable to fulfill (out of stock)"
- "Customer no-show"
- "Other"
**And** an optional notes field for additional details
**When** I confirm cancellation
**Then** order status changes to "cancelled"
**And** the order disappears from tablet Kanban board
**And** the order appears in desktop with strikethrough styling
**And** a system event is logged with cancellation reason
**When** the order was cancelled within 24 hours
**Then** a "Restore Order" button appears in the detail modal
**When** I click "Restore Order"
**Then** the order status reverts to its previous status before cancellation
**And** the order reappears on the tablet

**UI Requirements:**
- Confirmation dialog with destructive action styling (red button)
- Required cancellation reason dropdown
- "Restore Order" only visible for orders cancelled <24 hours ago
- Hebrew RTL for cancellation reasons and notes
## Epic 3: Packing Workflow & Quality Assurance - Stories

### Story 3.1: Create Packing Detail View with Item Checklist

As Malka,
I want to tap an order in "Packing" status to see a detailed packing checklist,
So that I can systematically pack each item without forgetting anything.

**Acceptance Criteria:**

**Given** an order is in "Packing" status on the tablet
**When** I tap the order card
**Then** a full-screen packing view appears showing:
- Order number (large, top of screen)
- Customer name
- Pickup time with countdown if <30 minutes
- List of all items with checkboxes
**And** each item shows: name (Hebrew, 18px font), quantity ordered
**When** I tap an item checkbox
**Then** it marks as packed with visual confirmation:
- Brief pulse animation (200ms scale 1.0 → 1.1 → 1.0)
- Checkmark icon appears with fade-in
- Item text gets subtle green background
**And** the checkbox state persists if I navigate away and return
**When** I accidentally tap a checkbox twice (check then uncheck)
**Then** the checkbox unchecks with reverse animation
**And** the green background fades out
**And** the item remains visually distinct (lighter gray background) to show it was touched
**When** all items are checked
**Then** a prominent "סיימתי אריזה" (Finished Packing) button appears
**And** the button is 44px tall, full-width, green background
**When** I tap "Finished Packing"
**Then** I'm taken to the weight entry screen (Story 3.2)

**UI Requirements:**
- Portrait tablet optimization (768px × 1024px)
- 44px × 44px checkboxes (WCAG AAA touch target)
- 8px spacing between checklist items
- Hebrew RTL text
- Back button returns to Kanban board
- Scroll support for orders with >10 items

---

### Story 3.2: Add Weight Entry for Packed Items

As Malka,
I want to enter actual weights for weight-based items,
So that customers are charged correctly based on what they receive.

**Acceptance Criteria:**

**Given** I completed the packing checklist (Story 3.1)
**When** the weight entry screen loads
**Then** I see only weight-based items (unit_type='weight')
**And** each item has a numeric input field with unit label (kg/g)
**When** I tap an input field
**Then** a large numeric keypad appears (tablet-optimized)
**And** the input auto-focuses for immediate typing
**When** I enter a weight
**Then** the price is calculated in real-time: `weight × price_per_unit`
**And** the calculated price displays immediately below the input
**When** I enter an unusually high weight (e.g., 5000g instead of 500g)
**Then** a warning modal appears: "⚠️ משקל גבוה - {weight}g עבור {item}. האם הנתון נכון?"
**And** options: "כן, נכון" (Yes, correct) or "תקן" (Fix)
**When** I choose "Fix"
**Then** the input clears and refocuses for correction
**When** I choose "Yes, correct"
**Then** the weight is accepted and I can continue
**And** the outlier is logged to system_events for Yaron's review
**When** all weight-based items have weights entered
**Then** a total price summary appears at the bottom
**And** a "המשך" (Continue) button becomes enabled
**When** I tap "Continue"
**Then** weights are saved to `order_items` table (add `actual_weight` column)
**And** total price is calculated and saved to `orders.total_price`
**And** I proceed to special notes screen (Story 3.3)

**Database Requirements:**
- Migration file: `004_add_packing_columns.sql`
- Add `actual_weight` (DECIMAL) column to `order_items` table
- Add `total_price` (DECIMAL) column to `orders` table

**Technical Requirements:**
- Outlier detection: weight >3× typical weight for item (calculated from historical data or >5kg default)
- Log outliers to `system_events` with event_type='weight_outlier' for review

---

### Story 3.3: Add Special Notes During Packing

As Malka,
I want to add notes during packing (like "extra crispy kubana"),
So that special customer requests are recorded.

**Acceptance Criteria:**

**Given** I completed weight entry (Story 3.2)
**When** the special notes screen loads
**Then** I see a large text area with Hebrew placeholder: "הערות מיוחדות (לא חובה)"
**And** I see quick-select buttons for common notes:
- "כבנא פריכה במיוחד" (Extra crispy kubana)
- "חלה ללא זרעים" (Challah without seeds)
- "אריזה נפרדת" (Separate packaging)
**When** I tap a quick-select button
**Then** the text is added to the notes field
**And** I can edit or add more text manually
**When** I tap "סיים" (Done) button
**Then** notes are saved to `orders.packing_notes` field
**And** order status automatically transitions to "Ready"
**And** WhatsApp notification is triggered (Epic 2, Story 2.3)
**And** I return to Kanban board
**When** I tap "דלג" (Skip) button
**Then** order transitions to "Ready" without notes

**Database Requirements:**
- Add `packing_notes` (TEXT) column to `orders` table

---

### Story 3.4: Implement Packing Time Tracking

As a developer,
I want to track packing duration for each order,
So that Yaron can analyze packing efficiency.

**Acceptance Criteria:**

**Given** order transitions to "Packing" status
**When** the status is saved
**Then** `packing_started_at` timestamp is recorded (Epic 2, Story 2.1)
**When** order transitions to "Ready" status
**Then** `packing_completed_at` timestamp is recorded
**And** packing duration is calculated: `completed_at - started_at`
**And** duration is saved to `orders.packing_duration_seconds` field
**When** Yaron views order details on desktop
**Then** he sees "זמן אריזה: {minutes}:{seconds}" (Packing time)
**And** orders taking >10 minutes display with yellow highlight
**And** orders taking >20 minutes display with red highlight

**Database Requirements:**
- Add `packing_completed_at` (TIMESTAMP) column to `orders` table
- Add `packing_duration_seconds` (INTEGER) column to `orders` table

---

### Story 3.5: Add Payment Link Generation on "Mark as Ready"

As a system,
I want to generate Meshulam payment links automatically when orders are marked "Ready",
So that customers receive payment links with their ready notifications.

**Acceptance Criteria:**

**Given** order transitions to "Ready" status
**When** total_price is calculated
**Then** the system calls Meshulam API to generate payment link
**And** the request includes: order_number, customer_name, total_price
**When** Meshulam returns payment link successfully
**Then** the link is saved to `orders.payment_link` field
**And** WhatsApp notification includes the payment link
**And** message format: "הזמנה {order_number} מוכנה! סה"כ: ₪{price}. לתשלום: {payment_link}"
**When** Meshulam API fails (timeout, error)
**Then** the order still transitions to "Ready"
**And** payment link generation is retried (3 attempts with backoff)
**And** WhatsApp notification is sent WITHOUT payment link
**And** message format when payment link fails: "הזמנה {order_number} מוכנה! סה"כ: ₪{price}. לינק תשלום יישלח בקרוב."
**And** if all retries fail, Yaron sees alert in admin dashboard
**And** manual payment link can be generated from desktop

**Technical Requirements:**
- API integration with Meshulam payment gateway
- Store Meshulam API key in environment variables
- Add `payment_link` (TEXT) column to `orders` table
- Retry logic with exponential backoff (1s, 5s, 15s)

---

### Story 3.6: Build Quality Check Validation Before "Ready"

As a system,
I want to validate all packing steps are complete before allowing "Ready" status,
So that incomplete orders are not marked as ready.

**Acceptance Criteria:**

**Given** order is in "Packing" status
**When** Malka attempts to mark order as "Ready"
**Then** the system validates:
- All items are checked in packing checklist ✓
- All weight-based items have weights entered ✓
- Total price is calculated ✓
**When** validation passes
**Then** order transitions to "Ready" normally
**When** validation fails (missing weights, unchecked items)
**Then** a blocking modal appears: "לא ניתן לסיים - פריטים חסרים"
**And** the modal lists specific missing items/weights:
- "❌ כבנא - לא סומן באריזה" (Kubana - not checked in packing)
- "❌ חלה - משקל חסר" (Challah - weight missing)
**And** each item name is highlighted in red
**And** a "חזור לאריזה" (Return to Packing) button takes her back to fix issues
**When** she clicks "Return to Packing"
**Then** the packing checklist screen shows
**And** unchecked items pulse with red border (500ms animation)
**And** these items scroll into view automatically
**When** no items require weights (all unit-based)
**Then** weight entry screen is skipped automatically

**UI Requirements:**
- Blocking validation modal on tablet
- Clear Hebrew error messages listing specific issues
- Visual indicators on packing checklist for uncompleted items

---

### Story 3.7: Add Desktop Override for Packing Workflow

As Yaron,
I want to manually enter weights and complete packing from desktop,
So that I can help during rush periods or fix mistakes.

**Acceptance Criteria:**

**Given** I'm viewing an order in "Packing" status on desktop at `/admin/orders/[id]/pack`
**When** the packing page loads
**Then** I see the same checklist, weight entry, and notes as tablet
**And** the interface is desktop-optimized (keyboard input)
**When** I complete all packing steps
**Then** the order transitions to "Ready" identically to tablet workflow
**When** there are validation errors
**Then** I see the same blocking modal as tablet
**When** I need to skip validation (emergency override)
**Then** I can check "Override validation" checkbox (requires confirmation)
**And** order can transition to "Ready" even with missing data
**And** a system event logs the override with reason

**UI Requirements:**
- Desktop-optimized layout (>1024px)
- Keyboard-first input (Tab navigation, Enter to submit)
- "Override validation" checkbox only visible on desktop
- Confirmation dialog for override explains risks

---

### Story 3.8: Implement Pickup Time Warning System

As Malka,
I want visual warnings when pickup times are approaching or overdue,
So that I prioritize urgent orders.

**Acceptance Criteria:**

**Given** orders are displayed on tablet Kanban board
**When** current time is within 30 minutes of pickup_time
**Then** order card displays with amber border (3px solid)
**And** pickup time shows in bold with ⏱️ icon
**When** current time passes pickup_time
**Then** order card displays with red border (3px solid)
**And** pickup time shows: "באיחור {minutes} דקות" (Late {minutes} minutes)
**When** order is >1 hour overdue
**Then** an urgent banner appears at top of screen: "יש הזמנות באיחור!"
**And** the banner is dismissible but reappears on page refresh until resolved
**When** I tap an overdue order
**Then** the packing view shows the overdue warning prominently
**And** I can see how long it's been overdue

**UI Requirements:**
- Color-coded borders: Amber (10-30 min), Red (overdue)
- Time calculations update in real-time (every 30 seconds)
- Urgent banner uses high-contrast red background
- Hebrew RTL for all time-related text

---

## Epic 4: Multi-Station Operations & Real-Time Sync - Stories

### Story 4.1: Implement Optimistic UI with Conflict Resolution

As a developer,
I want optimistic UI updates with automatic conflict resolution,
So that multi-tablet coordination is seamless even under poor network conditions.

**Acceptance Criteria:**

**Given** two tablets (Tablet A, Tablet B) viewing same order
**When** Tablet A updates order status to "Packing"
**Then** Tablet A shows update immediately (optimistic)
**And** Tablet B receives WebSocket update within 500ms
**And** Tablet B's UI updates automatically
**When** both tablets update same order simultaneously (conflict)
**Then** both apply optimistic updates locally
**And** server resolves conflict using priority model: Collected > Ready > Packing > Created
**And** the tablet with lower-priority update receives conflict event
**And** that tablet reverts to server state with toast: "ההזמנה עודכנה ע"י מישהו אחר"
**When** conflict resolution completes
**Then** both tablets show identical state
**And** the higher-priority status wins

**Technical Requirements:**
- Use `version` field for optimistic locking
- Priority-based conflict resolution algorithm
- WebSocket broadcast for all state changes
- Automatic reversion on conflict with user notification

---

### Story 4.2: Add Offline Mutation Queue with IndexedDB

As a system,
I want to queue mutations locally when offline,
So that tablets continue working during network interruptions.

**Acceptance Criteria:**

**Given** tablet loses internet connection
**When** Malka updates order status
**Then** the mutation is queued in IndexedDB
**And** UI updates optimistically
**And** a "לא מחובר" (Offline) banner appears
**And** banner shows count: "3 שינויים ממתינים" (3 changes pending)
**When** connection is restored
**Then** queued mutations sync automatically in FIFO order
**And** banner shows: "מסנכרן..." (Syncing)
**When** sync completes successfully
**Then** banner changes to: "מסונכרן ✓" then auto-dismisses after 2 seconds
**When** sync encounters conflicts
**Then** priority-based resolution applies (Story 4.1)
**And** affected orders display with conflict indicator
**When** queued mutation is invalid (order deleted, status changed by another user)
**Then** the mutation is skipped
**And** a system event logs the skipped mutation

**Database Requirements:**
- IndexedDB store: `pending_mutations` with columns: `id`, `type`, `order_id`, `payload`, `timestamp`
- Auto-purge successfully synced mutations

---

### Story 4.3: Build Multi-Tablet Station Mode Switcher

As Malka,
I want to switch between "Packing" and "Cashier" modes on the tablet,
So that I can use different tablets for different workflow stages.

**Acceptance Criteria:**

**Given** I'm viewing the tablet at `/kitchen`
**When** I tap the bottom navigation
**Then** I see two tabs: "אריזה" (Packing) and "קופה" (Cashier)
**When** I'm on "Packing" tab (default)
**Then** I see Kanban columns: Created, Packing, Ready, Collected
**When** I tap "Cashier" tab
**Then** I see only two columns: Ready, Collected
**And** cards are larger with prominent order numbers and prices
**And** tapping a "Ready" card immediately moves it to "Collected" (no packing detail view)
**When** I'm in Cashier mode
**Then** the Packing tab remains active in the background
**And** orders sync between both tabs automatically
**When** multiple tablets are used (one in Packing mode, one in Cashier mode)
**Then** both receive real-time updates
**And** no conflicts occur (different status transitions)

**UI Requirements:**
- Bottom tab navigation (44px tall touch targets)
- Cashier mode: larger fonts (24px order numbers, 20px prices)
- Tab state persists in localStorage
- Smooth transitions between tabs (<100ms)

---

### Story 4.4: Implement Connection Quality Indicator

As Malka,
I want to see connection quality and latency,
So that I know if sync delays are due to network issues.

**Acceptance Criteria:**

**Given** tablet is online
**When** WebSocket connection is stable
**Then** I see: 🟢 "מחובר" with latency: "<50ms" or "<500ms"
**When** latency is 500ms-1000ms
**Then** indicator shows: 🟡 "מחובר - אטי" (Connected - Slow)
**When** latency is >1000ms
**Then** indicator shows: 🟡 "מחובר - איטי מאוד" (Connected - Very Slow)
**When** WebSocket disconnects but HTTP works (fallback to polling)
**Then** indicator shows: 🟡 "מחובר - מצב מקוון בלבד" (Connected - Polling Mode)
**When** completely offline
**Then** indicator shows: 🔴 "לא מחובר" (Offline)
**When** I tap the connection indicator
**Then** a detail modal appears showing:
- Current connection status
- Last successful sync timestamp
- Pending mutations count
- Network diagnostics (ping, WebSocket status)

**Technical Requirements:**
- Measure round-trip time for status updates
- Update indicator every 5 seconds
- Store connection history in state for diagnostics

---

### Story 4.5: Add Desktop Real-Time Order Monitor

As Yaron,
I want to see live order updates on desktop without refresh,
So that I can monitor kitchen operations in real-time.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/orders` on desktop
**When** a new order is created (WhatsApp or manual)
**Then** it appears in the list automatically without refresh
**And** a brief flash animation highlights the new order
**When** Malka updates order status on tablet
**Then** my desktop view updates within 500ms
**And** the affected order row animates to reflect status change
**When** I have filters applied (e.g., status="Packing")
**Then** real-time updates respect the filters
**And** orders moving out of filter disappear with fade animation
**And** orders moving into filter appear with fade-in animation
**When** multiple updates occur rapidly (>5 per second)
**Then** updates are batched to prevent UI thrashing
**And** final state is always accurate

**Technical Requirements:**
- Supabase Realtime subscription on desktop
- Same `orders:*` channel as tablets
- Debounced UI updates (100ms batch window)
- Smooth animations for all state changes

---

### Story 4.6: Implement Automatic No-Show Detection

As a system,
I want to automatically mark overdue orders as "No-Show",
So that Yaron can track pickup compliance.

**Acceptance Criteria:**

**Given** an order has status="Ready"
**When** current time exceeds pickup_time + 2 hours
**Then** order status automatically changes to "no_show"
**And** a system event logs the auto-transition
**And** order appears in desktop with "לא הגיע" (No-Show) label
**When** Yaron knows customer will be late (called ahead)
**Then** he can click "Extend Pickup Time" button on desktop
**And** a dialog appears: "הארך ל: [+30 min] [+1 hour] [+2 hours] [מותאם אישית]"
**When** he selects extension duration
**Then** pickup_time is updated and no-show timer resets
**And** a note is added: "זמן איסוף הוארך ב-{duration}"
**When** customer arrives late (after auto-marked no-show)
**Then** Yaron can manually change status from "no_show" to "Collected"
**And** a note is added: "הגיע באיחור - סומן ידנית" (Arrived late - manually marked)
**When** configurable no-show timeout is set in settings (Epic 7)
**Then** the system uses the configured timeout instead of default 2 hours
**When** an order is marked no-show
**Then** a notification appears in Yaron's dashboard
**And** weekly no-show report includes this order

**Database Requirements:**
- Add `no_show` to status ENUM
- Scheduled job runs every 15 minutes to check overdue orders

---

### Story 4.7: Add Concurrent Edit Prevention with Locking

As a system,
I want to prevent concurrent edits to the same order,
So that data integrity is maintained.

**Acceptance Criteria:**

**Given** Yaron is editing order #123 on desktop at `/admin/orders/123/edit`
**When** Malka taps order #123 on tablet to start packing
**Then** Malka sees a modal: "ההזמנה בעריכה ע"י Yaron. להמתין או לבטל?"
**And** options: "המתן" (Wait) or "בטל" (Cancel)
**When** Malka chooses "Wait"
**Then** the modal polls every 2 seconds
**And** when Yaron saves/cancels, Malka's modal auto-dismisses
**And** Malka can proceed with packing
**When** Malka is packing order #123
**Then** Yaron sees read-only order details
**And** a banner: "ההזמנה באריזה ע"י Malka - לא ניתן לערוך"
**When** lock timeout (10 minutes) is reached with no activity
**Then** lock is released automatically
**And** system event logs the timeout

**Technical Requirements:**
- `order_locks` table: `order_id`, `locked_by`, `locked_at`, `lock_type`
- Lock types: 'editing', 'packing'
- Automatic lock release on timeout or completion

---

### Story 4.8: Build System Health Dashboard on Desktop

As Yaron,
I want to see system health metrics for all connected devices,
So that I can diagnose issues quickly.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/system` on desktop
**When** the page loads
**Then** I see a grid of all connected devices:
- Device type (Tablet 1, Tablet 2, Desktop 1, TV)
- Connection status (🟢 Online, 🔴 Offline)
- Last activity timestamp
- Latency (<50ms, <500ms, >500ms)
- Current view (Kanban/Packing/Cashier)
**When** a device goes offline
**Then** its card changes to red with offline indicator
**And** I see "אחרון מחובר: {timestamp}" (Last seen)
**When** I click a device card
**Then** detailed diagnostics appear:
- Connection history (last 24 hours)
- Error count
- Pending mutations (if offline)
- Browser/OS info
**When** system errors occur (failed API calls, WebSocket issues)
**Then** an error count badge appears on the dashboard nav
**And** clicking shows error log with timestamps

**UI Requirements:**
- Auto-refresh every 5 seconds
- Device cards use Classic Kanban Theater colors for status
- Click to expand device details
- Export diagnostics as JSON for support

---

## Epic 5: Production Analytics & Business Intelligence - Stories

### Story 5.1: Implement Order Time Tracking and Metrics

As a developer,
I want to track detailed timestamps for each order lifecycle stage,
So that Yaron can analyze kitchen performance.

**Acceptance Criteria:**

**Given** orders progress through workflow
**When** each status transition occurs
**Then** timestamps are recorded in orders table:
- `created_at` (order creation)
- `packing_started_at` (Epic 2, Story 2.1)
- `packing_completed_at` (Epic 3, Story 3.4)
- `ready_at` (when marked Ready)
- `collected_at` (when customer picks up)
**And** duration metrics are calculated:
- `packing_duration_seconds` = packing_completed - packing_started
- `ready_to_collected_seconds` = collected - ready
- `total_lifecycle_seconds` = collected - created
**When** Yaron queries analytics API `/api/analytics/order-times`
**Then** he receives aggregate metrics:
- Average packing time
- Average ready-to-collected time
- Average total lifecycle time
- Broken down by day/week/month

**Database Requirements:**
- All timestamp columns already added in previous stories
- Duration calculation logic in API
- Indexes on timestamp columns for performance

---

### Story 5.2: Build Analytics Dashboard for Order Flow

As Yaron,
I want to view a dashboard showing order flow metrics,
So that I can identify bottlenecks and optimize operations.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/analytics` on desktop
**When** the page loads with default date range (last 7 days)
**Then** I see metrics cards:
- Total orders: {count}
- Average packing time: {minutes}:{seconds}
- Average ready-to-collected time: {minutes}
- Orders by status (pie chart): Created/Packing/Ready/Collected/Cancelled
**And** I see a timeline chart showing orders created per hour
**And** I see a bar chart showing busiest days of the week
**When** I change date range (today, last 7 days, last 30 days, custom)
**Then** all charts and metrics update automatically
**When** I click "Export Data" button
**Then** a CSV file downloads with all orders in the selected date range

**UI Requirements:**
- Desktop-optimized layout
- Charts use Classic Kanban Theater colors
- Responsive charts (recharts or similar library)
- Loading states for all async data

---

### Story 5.3: Add TV Dashboard for Customer-Facing Order Display

As a customer,
I want to see my order status on a TV in the store,
So that I know when my order is ready for pickup.

**Acceptance Criteria:**

**Given** a TV is displaying `/tv` (read-only view)
**When** the page loads
**Then** I see a large grid showing orders in "Packing" and "Ready" statuses only
**And** each order displays:
- Order number (48px font, bold)
- Customer first name only (24px) - sanitized for privacy
- Status: "באריזה" (🟡) or "מוכן" (🟢)
**And** orders are color-coded: Yellow (Packing), Green (Ready)
**And** the display auto-refreshes every 5 seconds
**When** my order transitions to "Ready"
**Then** it appears in green within 5 seconds
**And** a subtle animation highlights the newly ready order (3-second fade-in)
**When** my order is collected
**Then** it disappears from the TV after 5 seconds
**When** there are >12 orders
**Then** the display auto-scrolls vertically (carousel style, 10 seconds per screen)

**UI Requirements:**
- TV optimization (1920px × 1080px)
- 24px minimum font size (WCAG AAA readability at distance)
- High contrast colors (7:1 ratio)
- No prices or sensitive data displayed
- Hebrew RTL text
- Auto-scroll for overflow

---

### Story 5.4: Implement Weekly KPI Report Generation

As Yaron,
I want to generate and export weekly KPI reports,
So that I can track business performance over time.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/analytics/reports` on desktop
**When** I click "Generate Weekly Report"
**Then** a CSV file downloads with columns:
- Week start date
- Total orders
- Orders by source (WhatsApp/Manual/Email/Phone)
- Average packing time
- Average ready-to-collected time
- No-show count
- Cancellation count
- Total revenue
- Most popular items (top 5)
**When** I select custom date range and click "Generate Report"
**Then** report includes only data from selected range
**When** report generation takes >2 seconds
**Then** a loading indicator appears
**And** report downloads automatically when ready

**Technical Requirements:**
- API endpoint: `GET /api/analytics/reports?start_date=&end_date=`
- CSV generation server-side
- Aggregate queries optimized with indexes
- Hebrew column headers in CSV

---

### Story 5.5: Add Popular Items Analysis

As Yaron,
I want to see which menu items are ordered most frequently,
So that I can plan inventory and prep quantities.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/analytics/items` on desktop
**When** the page loads with default date range (last 30 days)
**Then** I see a table listing all menu items with:
- Item name
- Total times ordered
- Total quantity sold
- Percentage of all orders
- Trend (↑ increasing, ↓ decreasing, - stable)
**And** the table is sorted by "Total times ordered" descending
**When** I change sort column
**Then** table re-sorts dynamically
**When** I filter by date range
**Then** metrics recalculate for that range
**When** I click an item row
**Then** a detail modal shows daily order count (line chart)
**And** breakdown by order source (WhatsApp vs Manual)

**UI Requirements:**
- Sortable table columns
- Trend indicators with color coding (green ↑, red ↓, gray -)
- Click to expand item details
- Export as CSV button

---

### Story 5.6: Implement Real-Time Order Count Badges

As Yaron,
I want to see live counts of orders in each status,
So that I can quickly assess kitchen workload.

**Acceptance Criteria:**

**Given** I'm viewing desktop admin area
**When** the page loads
**Then** I see status badges in the navigation:
- Created: {count}
- Packing: {count}
- Ready: {count}
**When** order statuses change (via real-time subscription)
**Then** badge counts update automatically within 500ms
**And** changing badges briefly animate (pulse effect)
**When** "Packing" count exceeds 10
**Then** the badge displays in amber with warning indicator
**When** "Ready" count exceeds 5
**Then** the badge displays in red with urgent indicator
**When** I click a status badge
**Then** I'm taken to `/admin/orders?status={clicked_status}`

**UI Requirements:**
- Badge positioning in top navigation bar
- Color-coded: Created (gray), Packing (blue), Ready (orange)
- Pulse animation on count change
- Warning thresholds configurable in settings (Epic 7)

---

### Story 5.7: Add Event Log Viewer on Desktop

As Yaron,
I want to view a detailed event log of all system actions,
So that I can audit activity and troubleshoot issues.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/system/events` on desktop
**When** the page loads
**Then** I see a table of recent events (last 100) showing:
- Timestamp
- Event type (status_change, order_created, notification_sent, etc.)
- Order number (if applicable)
- Actor (device/user identifier)
- Details (JSON expandable)
**And** events are sorted newest-first
**When** I filter by event type
**Then** only matching events are shown
**When** I filter by date range
**Then** events within that range are shown
**When** I click an event row
**Then** full JSON details expand inline
**When** I click "Export Log"
**Then** a CSV downloads with all filtered events

**Database Requirements:**
- `system_events` table created in Epic 2, Story 2.7
- API endpoint: `GET /api/system/events?type=&start_date=&end_date=&limit=100`
- Pagination for >100 events

---

### Story 5.8: Build Customer Pickup Compliance Report

As Yaron,
I want to see reports on customer pickup times and no-shows,
So that I can improve customer communication.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/analytics/customers` on desktop
**When** the page loads with default date range (last 30 days)
**Then** I see metrics:
- On-time pickups: {count} ({percentage}%)
- Late pickups: {count} ({percentage}%) - picked up >30 min after scheduled time
- No-shows: {count} ({percentage}%)
- Average delay for late pickups: {minutes} minutes
**And** I see a histogram showing pickup time distribution relative to scheduled time
**When** I filter by date range
**Then** metrics recalculate
**When** I click "View No-Shows"
**Then** a table lists all no-show orders with customer names and phone numbers
**And** I can mark a no-show as "contacted" with notes

**Technical Requirements:**
- Calculate pickup compliance based on `pickup_time` vs `collected_at`
- API endpoint: `GET /api/analytics/pickup-compliance`
- Add `no_show_contacted` (BOOLEAN) to orders table

---

## Epic 6: Advanced Customer Features - Stories

### Story 6.1: Create Inventory Management Schema and API

As a developer,
I want to create database schema for inventory tracking,
So that Yaron can manage daily prep quantities.

**Acceptance Criteria:**

**Given** dishes table exists
**When** database migration is executed
**Then** an `inventory` table exists with columns:
- `id` (UUID, primary key)
- `dish_id` (UUID, foreign key → dishes.id)
- `date` (DATE, not null) - the prep date
- `prep_quantity` (DECIMAL, not null) - how much was prepped
- `allocated_quantity` (DECIMAL, default 0) - sum of all orders
- `available_quantity` (DECIMAL, generated column: prep - allocated)
- `created_at`, `updated_at`
**And** a unique constraint on (dish_id, date)
**And** API endpoint `/api/inventory` supports GET (list by date)
**And** API endpoint `/api/inventory` supports POST (set daily prep quantities)
**And** API endpoint `/api/inventory/[dish_id]` supports PATCH (adjust quantities)
**When** a new order is created
**Then** allocated_quantity increments for each ordered item
**When** an order is cancelled
**Then** allocated_quantity decrements

**Database Requirements:**
- Table name: `inventory`
- Foreign key: `inventory.dish_id` → `dishes.id`
- Unique constraint: `unique_inventory_dish_date` on (dish_id, date)
- Trigger or computed column for `available_quantity`

---

### Story 6.2: Build Desktop Inventory Management UI

As Yaron,
I want to set daily prep quantities for menu items,
So that the system tracks available inventory.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/inventory` on desktop
**When** the page loads (defaults to today's date)
**Then** I see all active menu items with columns:
- Item name
- Today's prep quantity (editable input)
- Allocated (sum of orders)
- Available (prep - allocated)
- Low stock indicator (if available < 10 units or < 15%)
**When** I enter prep quantities
**Then** values are saved automatically on blur (debounced)
**And** available quantities recalculate in real-time
**When** available quantity goes negative
**Then** the row displays in red with warning icon
**And** a toast appears: "אזהרה: מלאי שלילי עבור {item}" (Warning: negative inventory)
**When** I change the date selector
**Then** the list updates to show that date's inventory
**When** I click "Copy from Yesterday"
**Then** yesterday's prep quantities are copied to today
**And** I see confirmation: "הכמויות הועתקו מיום אתמול"

**UI Requirements:**
- Desktop-optimized layout
- Inline editable inputs
- Auto-save on blur (500ms debounce)
- Color-coded available quantities: Green (>20%), Yellow (10-20%), Red (<10%)
- Hebrew RTL text

---

### Story 6.3: Implement Low Stock Warnings

As Malka,
I want to see low stock warnings when creating orders on tablet,
So that I don't pack orders we can't fulfill.

**Acceptance Criteria:**

**Given** inventory tracking is enabled
**When** available inventory for an item is <10 units or <15%
**Then** a warning indicator (⚠️) appears next to the item in order creation
**And** hovering/tapping shows tooltip: "מלאי נמוך - נותרו {count}"
**When** I try to create an order exceeding available inventory
**Then** a blocking modal appears: "אין מספיק מלאי עבור {item}"
**And** options: "צור הזמנה בכל זאת" (Create anyway) or "בטל" (Cancel)
**When** I choose "Create anyway"
**Then** order is created
**And** available inventory goes negative
**And** Yaron receives alert in admin dashboard
**When** Yaron views inventory page
**Then** negative inventory items display prominently in red

**UI Requirements:**
- Warning icon (⚠️) with tooltip
- Blocking modal for insufficient inventory
- Admin alert for negative inventory

---

### Story 6.4: Add Browser Notifications for Order Events (Desktop)

As Yaron,
I want browser notifications with sound for important order events,
So that I'm alerted even when not actively viewing the admin.

**Acceptance Criteria:**

**Given** I'm logged into desktop admin
**When** the page loads
**Then** I'm prompted to allow browser notifications
**When** a new order is created (WhatsApp or manual)
**Then** a notification appears: "הזמנה חדשה #{order_number}"
**And** a sound plays (subtle chime)
**When** an order transitions to "Ready"
**Then** a notification appears: "הזמנה #{order_number} מוכנה לאיסוף"
**And** a sound plays
**When** inventory goes negative
**Then** a notification appears: "אזהרה: מלאי שלילי עבור {item}"
**And** a sound plays (alert tone)
**When** I'm in "Do Not Disturb" hours (Epic 7 setting)
**Then** notifications are suppressed but events are logged
**When** I click a notification
**Then** the relevant page opens (order detail, inventory page)

**Technical Requirements:**
- Browser Notification API
- Sound files: chime.mp3, alert.mp3
- Notification preferences in settings (Epic 7)
- Check notification permission on load

---

### Story 6.5: Implement Order Backup and Export

As Yaron,
I want to export the complete order database as backup,
So that I have records for accounting and legal compliance.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/system/backup` on desktop
**When** I click "Export All Orders"
**Then** a CSV file downloads with all orders and order items
**And** the file includes columns:
- Order number, customer name, phone, pickup time, status, source
- All timestamps (created, packing started, ready, collected)
- Item names, quantities, weights, prices
- Total price, payment status
- Notes, cancellation reason (if applicable)
**When** export includes >1000 orders
**Then** a loading indicator appears
**And** export completes within 30 seconds
**When** I select date range and click "Export Range"
**Then** only orders from that range are exported
**When** export is ready
**Then** file name format: `kitchenos-backup-{YYYY-MM-DD}.csv`

**Technical Requirements:**
- API endpoint: `GET /api/system/backup?start_date=&end_date=`
- Server-side CSV generation
- Stream large exports to avoid memory issues
- Hebrew encoding (UTF-8 with BOM)

---

### Story 6.6: Add Customer Order History Lookup

As Yaron,
I want to search for all orders from a specific customer,
So that I can review their order history.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/customers` on desktop
**When** I search for a customer by name or phone
**Then** I see a list of matching customers with:
- Name
- Phone
- Total orders
- Last order date
**When** I click a customer row
**Then** I see their complete order history showing:
- All orders with dates, statuses, and totals
- Sorted newest-first
- Most frequently ordered items (top 5)
- Average order value
- No-show count (if any)
**When** I click an order in the history
**Then** the order detail modal opens (Epic 2, Story 2.5)

**UI Requirements:**
- Desktop-optimized layout
- Search with autocomplete (debounced 300ms)
- Click customer to expand history
- Export customer history as CSV

---

### Story 6.7: Implement Order Editing on Desktop

As Yaron,
I want to edit existing orders (items, quantities, customer info),
So that I can fix mistakes or accommodate customer changes.

**Acceptance Criteria:**

**Given** I'm viewing an order at `/admin/orders/[id]/edit`
**When** the page loads
**Then** I see an editable form pre-filled with:
- Customer name, phone
- Pickup time
- All ordered items with quantities
- Notes
**When** I modify any field and click "Save Changes"
**Then** the order is updated
**And** a system event logs the modification with changes detail
**And** I see confirmation: "ההזמנה עודכנה בהצלחה"
**When** I try to edit an order in "Collected" status
**Then** a warning modal appears: "ההזמנה נאספה. האם לערוך בכל זאת?"
**And** editing requires confirmation
**When** I add/remove items
**Then** inventory allocated quantities are updated automatically
**When** the order is currently being packed (locked by Malka)
**Then** I see read-only view with banner: "ההזמנה באריזה - לא ניתן לערוך"

**UI Requirements:**
- Desktop-optimized form
- Keyboard-friendly input
- Change tracking (highlight modified fields)
- Confirmation for editing completed orders

---

### Story 6.8: Add Failed WhatsApp Order Queue

As Yaron,
I want to view and manually process WhatsApp messages that failed parsing,
So that no customer orders are lost.

**Acceptance Criteria:**

**Given** WhatsApp messages fail to parse (Epic 1, Story 1.7)
**When** I visit `/admin/orders/failed`
**Then** I see a list of failed messages with:
- Timestamp received
- Customer phone number
- Full message text (Hebrew)
- Parse error reason
**When** I click a failed message
**Then** a form appears with:
- Message text (read-only)
- Parsed fields (pre-filled if partially successful): customer name, items, pickup time
- Manual override inputs for missing fields
**When** I complete the form and click "Create Order"
**Then** the order is created with `source='whatsapp'`
**And** the failed message is marked as resolved
**And** I see confirmation with new order number
**When** I click "Dismiss Message"
**Then** the message is marked as dismissed
**And** it moves to "Dismissed" tab

**UI Requirements:**
- Desktop-optimized layout
- Tabs: "Pending" / "Resolved" / "Dismissed"
- Hebrew text display with proper RTL
- Quick action buttons: Create Order, Dismiss

---

## Epic 7: Administrative & Configuration Management - Stories

### Story 7.1: Build Settings Management UI

As Yaron,
I want to configure system settings without developer help,
So that I can adjust behavior to match business needs.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/settings` on desktop
**When** the page loads
**Then** I see categorized settings:
- **Business Hours**: Operating days, open/close times
- **Notifications**: Enable/disable browser notifications, Do Not Disturb hours
- **Thresholds**: Low stock percentage, no-show timeout, order warning times
- **Display**: TV auto-refresh interval, tablet refresh interval
**When** I modify any setting and click "Save"
**Then** the setting is persisted to database
**And** I see confirmation: "הגדרות נשמרו בהצלחה"
**And** the system immediately uses new values
**When** I change "No-Show Timeout"
**Then** future automatic no-show detection uses the new timeout (Epic 4, Story 4.6)
**When** I change "Low Stock Percentage"
**Then** inventory warnings update to use new threshold (Epic 6, Story 6.3)

**Database Requirements:**
- Create `settings` table: `id`, `key`, `value` (JSONB), `updated_at`
- Settings stored as key-value pairs for flexibility
- API endpoint: `GET/PUT /api/settings`

---

### Story 7.2: Implement User Management (Future Multi-User)

As Yaron,
I want to manage user accounts for future staff,
So that access can be controlled and tracked.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/users` on desktop
**When** the page loads
**Then** I see a list of users with:
- Name
- Role (Admin, Kitchen Staff, View-Only)
- Last login
- Active status
**When** I click "Add User"
**Then** a form appears with fields: name, email, role, password
**When** I submit the form
**Then** the user is created
**And** they receive an email with login credentials
**When** I click "Deactivate" on a user
**Then** their account is disabled
**And** they cannot log in
**When** I click "View Activity"
**Then** I see that user's action history (from system_events)

**Technical Requirements:**
- Supabase Auth for user management
- Role-based access control (RBAC)
- API endpoints: `GET/POST/PATCH /api/users`
- Email integration for credentials

**Note:** This is a foundation for future multi-user features. MVP (Epic 1-3) does not require authentication.

---

### Story 7.3: Add Menu Item Synchronization with External System

As Yaron,
I want to sync menu items from an external spreadsheet,
So that I don't manually enter items twice.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/menu/sync` on desktop
**When** I upload a CSV file with columns: name, unit_type, price_per_unit
**Then** the system validates the file format
**And** shows a preview of items to import
**When** I click "Import Items"
**Then** all items are created/updated in the dishes table
**And** existing items (matched by name) are updated
**And** new items are created
**And** I see summary: "{count} items imported, {count} updated, {count} errors"
**When** the CSV has errors (missing columns, invalid prices)
**Then** I see error details with row numbers
**And** I can download an error report CSV
**When** import completes successfully
**Then** menu items are immediately available for orders

**Technical Requirements:**
- CSV parser supporting Hebrew text (UTF-8)
- Validation: required fields, positive prices, valid unit types
- Upsert logic (INSERT ... ON CONFLICT UPDATE)
- API endpoint: `POST /api/menu/import`

---

### Story 7.4: Implement Audit Log with Admin Actions

As Yaron,
I want all admin actions logged,
So that I can review who changed what and when.

**Acceptance Criteria:**

**Given** any admin action occurs (settings change, user creation, order edit, etc.)
**When** the action is completed
**Then** an entry is added to `system_events` table with:
- `event_type`: 'admin_action'
- `actor_id`: admin user identifier
- `action`: description (e.g., "updated_settings", "created_user")
- `metadata`: JSON with before/after values
- `timestamp`
**When** I view `/admin/system/audit`
**Then** I see all admin actions sorted newest-first
**And** each entry shows: timestamp, admin name, action, details
**When** I filter by action type
**Then** only matching actions are shown
**When** I filter by date range
**Then** actions within that range are shown
**When** I click an action row
**Then** full before/after diff is displayed

**Database Requirements:**
- Extend `system_events` table to support admin actions
- Index on `event_type` for filtering

---

### Story 7.5: Add Business Hours Configuration

As Yaron,
I want to set business hours and closed days,
So that the system prevents orders outside operating hours.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/settings/hours` on desktop
**When** the page loads
**Then** I see a weekly schedule with:
- Each day of week (Sunday-Saturday)
- Open time, close time
- Checkbox for "Closed"
**When** I set hours and click "Save"
**Then** the schedule is saved to settings table
**When** a customer tries to create a manual order with pickup_time outside business hours
**Then** a warning appears: "מחוץ לשעות פעילות. להמשיך בכל זאת?"
**And** Yaron can override the warning
**When** WhatsApp orders arrive outside business hours
**Then** they are still captured but flagged for review
**And** Yaron sees a note: "הזמנה מחוץ לשעות פעילות"

**UI Requirements:**
- Weekly schedule grid
- Time pickers for open/close times
- "Closed" checkbox for holidays
- Preview of current business status (Open/Closed)

---

### Story 7.6: Implement System Health Monitoring

As Yaron,
I want automated health checks for critical systems,
So that I'm alerted to failures before they impact operations.

**Acceptance Criteria:**

**Given** the system is running
**When** a health check runs every 5 minutes
**Then** it validates:
- Supabase database connectivity ✓
- Supabase Realtime WebSocket ✓
- WhatsApp webhook accessibility ✓
- Meshulam payment API ✓
**When** any check fails
**Then** a system event is logged with error details
**And** Yaron sees alert in admin dashboard
**And** browser notification is sent (if enabled)
**When** I view `/admin/system/health`
**Then** I see current status of all systems:
- Database: 🟢 Connected (last check: {timestamp})
- Realtime: 🟢 Connected
- WhatsApp: 🟢 Responding
- Meshulam: 🟢 Responding
**When** I click "Run Health Check Now"
**Then** all checks execute immediately
**And** results update in real-time

**Technical Requirements:**
- Scheduled job runs every 5 minutes
- API endpoint: `GET /api/system/health`
- Store health check results in `system_events`
- Dashboard auto-refreshes every 30 seconds

---

### Story 7.7: Add Configuration Export/Import

As Yaron,
I want to export and import system configuration,
So that I can backup settings or migrate to another instance.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/settings/backup`
**When** I click "Export Configuration"
**Then** a JSON file downloads containing:
- All settings from settings table
- Menu items (dishes)
- User accounts (excluding passwords)
- Business hours
- Thresholds and preferences
**And** file name format: `kitchenos-config-{YYYY-MM-DD}.json`
**When** I click "Import Configuration"
**Then** a file picker appears
**When** I select a valid config JSON
**Then** the system validates the file structure
**And** shows a preview of what will be imported
**When** I confirm import
**Then** all settings/menu items are updated
**And** I see confirmation: "תצורה יובאה בהצלחה"
**When** the file is invalid (wrong structure, missing keys)
**Then** I see error message with details

**Technical Requirements:**
- JSON schema validation
- API endpoints: `GET /api/system/export`, `POST /api/system/import`
- Exclude sensitive data (passwords, API keys)

---

### Story 7.8: Implement Deployment History and Rollback

As Yaron,
I want to see deployment history and rollback if needed,
So that I can recover from bad updates.

**Acceptance Criteria:**

**Given** the system is deployed via Vercel
**When** a new deployment completes
**Then** a deployment record is created with:
- Deployment ID (from Vercel)
- Timestamp
- Git commit hash
- Deployed by (CI/CD or manual)
**When** I view `/admin/system/deployments`
**Then** I see deployment history (last 20) showing:
- Timestamp
- Commit hash (first 7 chars)
- Status (Success/Failed)
- "Rollback" button for each
**When** I click "Rollback" on a previous deployment
**Then** a confirmation dialog appears: "לחזור לגרסה {hash}?"
**When** I confirm rollback
**Then** Vercel API is called to redeploy that version
**And** I see status: "מבצע rollback..."
**And** when rollback completes, I see: "Rollback הושלם בהצלחה"

**Technical Requirements:**
- Vercel API integration for deployment management
- Store deployment metadata in `deployments` table
- API endpoint: `POST /api/system/rollback`
- Requires Vercel API token in environment variables

---

## Epic 8: System Resilience & Edge Cases - Stories

### Story 8.1: Implement Comprehensive Error Boundary

As a developer,
I want React error boundaries for all major components,
So that errors are contained and logged without crashing the app.

**Acceptance Criteria:**

**Given** a React component throws an error
**When** the error is caught by error boundary
**Then** a fallback UI displays: "משהו השתבש. רענון העמוד יכול לעזור."
**And** the error is logged to `system_events` table with:
- Component stack trace
- Error message
- User action that triggered error
- Browser/device info
**And** a "רענן עמוד" (Refresh Page) button appears
**When** I click "Refresh Page"
**Then** the page reloads
**When** the same error occurs 3 times in 60 seconds
**Then** a "דווח על בעיה" (Report Issue) button appears
**And** clicking it opens email to support with pre-filled error details

**Technical Requirements:**
- Error boundaries wrap: KanbanBoard, OrderDetail, PackingView, Desktop pages
- Error logging API: `POST /api/system/errors`
- Include component name, props (sanitized), stack trace
- User-friendly Hebrew error messages

---

### Story 8.2: Add Graceful Degradation for Failed External APIs

As a system,
I want graceful degradation when external APIs fail,
So that core functionality continues working.

**Acceptance Criteria:**

**Given** WhatsApp API (n8n) is unavailable
**When** an order transitions to "Ready"
**Then** the notification is queued for retry
**And** the order still transitions successfully
**And** Yaron sees warning: "התראות WhatsApp לא פעילות"
**Given** Meshulam payment API is unavailable
**When** an order transitions to "Ready"
**Then** payment link generation is queued for retry
**And** the order still transitions
**And** a banner appears: "לינק תשלום יישלח כשהשירות יחזור"
**And** Yaron can manually generate payment link later from desktop
**Given** Supabase Realtime is unavailable
**When** tablets/desktop are connected
**Then** they fall back to 5-second polling automatically
**And** users see: 🟡 "מחובר - מצב מקוון בלבד"
**And** functionality continues (slower updates)

**Technical Requirements:**
- Queue failed API calls in IndexedDB
- Retry with exponential backoff (max 3 attempts)
- Fallback mechanisms for all external dependencies
- Status indicators for degraded services

---

### Story 8.3: Implement IndexedDB Quota Management

As a system,
I want to monitor and manage IndexedDB storage usage,
So that tablets don't run out of local storage.

**Acceptance Criteria:**

**Given** tablets store data in IndexedDB
**When** storage usage exceeds 80% of available quota
**Then** a warning appears: "אחסון מקומי כמעט מלא"
**And** the system automatically purges:
- Orders older than 7 days
- Resolved failed messages
- Old system events (keep last 1000)
**When** storage usage exceeds 95%
**Then** an urgent warning appears: "אחסון מקומי מלא - יש לנקות"
**And** a "נקה עכשיו" (Clean Now) button appears
**When** I click "Clean Now"
**Then** all non-essential data is purged
**And** I see confirmation: "אחסון נוקה - {MB} שוחררו"
**When** quota exhaustion occurs
**Then** new data fails gracefully
**And** error message: "אין מקום באחסון - נא לנקות"

**Technical Requirements:**
- Monitor IndexedDB quota using `navigator.storage.estimate()`
- Auto-purge policy: orders >7 days, events >1000, resolved messages
- Manual purge API: `POST /api/system/purge-local`
- Display storage usage in System Health dashboard

---

### Story 8.4: Add Network Retry Logic with Exponential Backoff

As a system,
I want automatic retry logic for all network requests,
So that transient failures don't impact operations.

**Acceptance Criteria:**

**Given** any API request fails with network error
**When** the error is a timeout or connection failure
**Then** the request is automatically retried
**And** retry delays use exponential backoff: 1s, 2s, 4s
**And** maximum 3 retry attempts per request
**When** all retries fail
**Then** the error is surfaced to the user
**And** the error is logged to system_events
**When** the request is a mutation (POST/PUT/PATCH)
**Then** it's also queued in IndexedDB for offline support
**When** the request is a query (GET)
**Then** cached data is served if available
**And** a toast appears: "מציג נתונים ישנים - אין חיבור"

**Technical Requirements:**
- Retry interceptor for all fetch/axios requests
- Exponential backoff: delay = 2^attempt × 1000ms
- Max 3 attempts, then fail
- Cache GET responses in IndexedDB for offline fallback

---

### Story 8.5: Implement Tablet Wake-Up Recovery

As a system,
I want tablets to recover properly after sleep/wake cycles,
So that they don't show stale data after waking up.

**Acceptance Criteria:**

**Given** a tablet running KitchenOS
**When** the tablet goes to sleep (screen off >5 minutes)
**Then** WebSocket connections are paused
**And** IndexedDB maintains cached state
**When** the tablet wakes up
**Then** the system checks: last_sync timestamp
**When** last_sync is >30 seconds ago
**Then** a full data refresh is triggered automatically
**And** a toast appears: "מעדכן נתונים..." (Updating data)
**And** WebSocket reconnects within 2 seconds
**When** refresh completes
**Then** all order data is current
**And** toast updates: "עדכון הושלם ✓"
**When** wake-up recovery fails (offline)
**Then** cached data continues to display
**And** indicator shows: 🔴 "לא מחובר"

**Technical Requirements:**
- Listen to `visibilitychange` event
- Track `last_sync` timestamp in localStorage
- Force refresh if stale (>30s)
- Reconnect WebSocket with backoff

---

### Story 8.6: Add Validation for Edge Cases

As a system,
I want comprehensive validation for edge cases,
So that invalid data is caught early.

**Acceptance Criteria:**

**Given** a user enters data in any form
**When** validation runs
**Then** the following edge cases are caught:
- **Customer name**: Min 2 chars, max 50 chars, Hebrew/English only
- **Phone number**: Israeli format (050-123-4567 or 0501234567), 10 digits
- **Pickup time**: Must be in future, within business hours, <7 days away
- **Quantity**: Integer >0, <1000 (prevent accidental large orders)
- **Weight**: Decimal >0, <100kg (prevent data entry errors)
- **Price**: Decimal >0, <10000₪ (sanity check)
**When** validation fails
**Then** specific error message displays: "שם לקוח חייב להכיל 2-50 תווים"
**And** the input field highlights in red
**And** submit button remains disabled
**When** validation passes
**Then** submit button enables

**Technical Requirements:**
- Zod schema validation for all forms
- Frontend and backend validation (defense in depth)
- Hebrew error messages
- Real-time validation on blur

---

### Story 8.7: Implement System Diagnostics Tool

As Yaron,
I want a diagnostics tool that checks common issues,
So that I can troubleshoot problems quickly.

**Acceptance Criteria:**

**Given** I'm viewing `/admin/system/diagnostics`
**When** I click "Run Diagnostics"
**Then** the system checks:
- ✓ Database connection (ping test)
- ✓ Supabase Realtime (WebSocket test)
- ✓ WhatsApp webhook (HTTP HEAD request)
- ✓ Meshulam API (auth test)
- ✓ IndexedDB quota (usage check)
- ✓ Browser notification permission
- ✓ Network latency (<500ms good, >1000ms bad)
**And** each check shows status: ✓ Pass / ⚠ Warning / ✗ Fail
**When** a check fails
**Then** I see:
- Error message
- Suggested fix (e.g., "בדוק חיבור לאינטרנט")
- "נסה שוב" (Retry) button
**When** I click "Export Diagnostics"
**Then** a JSON file downloads with all check results
**And** I can share it for support

**UI Requirements:**
- Live progress indicator for each check
- Color-coded results (green/yellow/red)
- Expandable details for each check
- Export button for support

---

### Story 8.8: Add Automatic Recovery from Common Failures

As a system,
I want automatic recovery from common failure scenarios,
So that manual intervention is rarely needed.

**Acceptance Criteria:**

**Given** WebSocket connection fails
**When** reconnection attempts exceed 5 failures
**Then** the system switches to long-polling mode permanently for this session
**And** user sees: 🟡 "מחובר במצב איטי"
**Given** order status update fails with 409 Conflict
**When** the conflict is detected
**Then** the system fetches latest order state
**And** retries the update with fresh data
**And** if update still fails, shows: "ההזמנה עודכנה ע"י מישהו אחר"
**Given** IndexedDB operation fails (quota exceeded)
**When** the failure is detected
**Then** auto-purge runs immediately
**And** operation is retried once
**Given** session expires (future auth implementation)
**When** an authenticated request returns 401
**Then** user is redirected to login with return URL
**And** toast: "ההתחברות פגה - נא להתחבר מחדש"

**Technical Requirements:**
- Automatic fallback for WebSocket → polling
- Conflict resolution with retry
- Auto-purge on quota errors
- Session expiry handling (future-proof)
