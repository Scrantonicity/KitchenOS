# BMad Method (BMM) - KitchenOS Project Guide

## Overview

KitchenOS follows the **BMad Method (BMM)** - a structured approach to building software through guided workflows with specialized AI agents. This methodology ensures systematic development from concept to deployment.

---

## The Four Phases

```
┌─────────────────────────────────────────────────────────────────┐
│                         BMAD METHOD                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 1: ANALYSIS (Optional)                                   │
│  └─ Brainstorming → Research → Product Brief                    │
│                                                                  │
│  Phase 2: PLANNING (Required)                                   │
│  └─ Tech Spec → PRD → Requirements Definition                   │
│                                                                  │
│  Phase 3: SOLUTIONING (Track-dependent)                         │
│  └─ Architecture Design → Component Planning                    │
│                                                                  │
│  Phase 4: IMPLEMENTATION (Required)                             │
│  └─ Epic by Epic → Story by Story → Feature Delivery            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

# Phase 1: Analysis (Optional)

## Status: ✅ Completed

### 1.1 Brainstorming
**Objective**: Define the problem space and explore solutions

**Completed Artifacts**:
- Problem identified: Manual kitchen order management is inefficient
- Solution: Tablet-first KDS with WhatsApp ordering integration
- Key innovation: AI-powered Hebrew order parsing + HITL approval system

### 1.2 Research
**Objective**: Validate technical approach and identify risks

**Research Areas Completed**:
- ✅ Next.js 16 App Router capabilities
- ✅ Supabase real-time and offline capabilities
- ✅ Meshulam payment integration
- ✅ n8n workflow automation
- ✅ Hebrew NLP with GPT for order parsing
- ✅ Touch-optimized tablet UX patterns

### 1.3 Product Brief
**Objective**: Summarize vision and requirements

**Completed Document**: [PRD.md](../../PRD.md) - Executive Summary

**Key Points**:
- **Vision**: Streamline Lacomida restaurant kitchen operations
- **Target Users**: Kitchen staff, pickup staff, managers
- **Core Value**: Real-time order management with fraud prevention
- **Tech Stack**: Next.js 16, Supabase, n8n, Meshulam, Telegram

---

# Phase 2: Planning (Required)

## Status: ✅ Completed

### 2.1 Requirements Documentation
**Objective**: Create comprehensive technical requirements

**Completed Artifacts**:
- ✅ [PRD.md](../../PRD.md) - Full Product Requirements Document v2.0
  - Executive Summary
  - System Architecture
  - Database Schema (11 migrations)
  - API Contracts
  - Security Model
  - 8 MVP Screens defined
  - Sprint Plan (6 sprints)

### 2.2 User Stories & Acceptance Criteria
**Location**: [PRD.md](../../PRD.md) - Section 4: Screen Inventory

**Format**: Each screen includes:
- Route definition
- Priority (P0/P1)
- Primary actions
- User flow diagrams

### 2.3 Technical Specifications
**Location**: [PRD.md](../../PRD.md) - Sections 5-12

**Includes**:
- Complete database schema with SQL
- API endpoint specifications
- TypeScript interfaces
- Security implementation
- Offline resilience strategy
- Real-time subscription patterns
- Project folder structure

---

# Phase 3: Solutioning (Track-dependent)

## Status: ✅ Completed (Enterprise Track)

### 3.1 Architecture Design
**Objective**: Design scalable, maintainable system architecture

**Completed Artifacts**:
- ✅ System Architecture Diagram ([PRD.md](../../PRD.md) - Section 2)
- ✅ Database Entity Relationship Diagram ([PRD.md](../../PRD.md) - Section 5)
- ✅ Component Architecture ([PRD.md](../../PRD.md) - Section 11)

**Architecture Decisions**:
| Decision | Rationale |
|----------|-----------|
| Next.js App Router | Server components + API routes in one framework |
| Supabase PostgreSQL | Real-time capabilities + managed infrastructure |
| Zustand + React Query | Offline queue (Zustand) + server state (React Query) |
| Route Groups `(kds)` `(admin)` | Separate layouts for different user types |
| HMAC Webhook Auth | Secure external service integration |

### 3.2 Component Design
**Objective**: Define reusable component library

**Component Hierarchy**:
```
components/
├── ui/                    # Shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── touch-button.tsx  # Touch-optimized variant
│
├── kds/                   # Kitchen Display System components
│   ├── OrderCard.tsx      # Order display with status
│   ├── PackingItemRow.tsx # Weight input for packing
│   ├── InventoryRow.tsx   # Daily inventory management
│   ├── ReservationCard.tsx # שמור לי display
│   ├── ApprovalCard.tsx   # HITL approval interface
│   ├── ConnectionStatus.tsx # Online/offline indicator
│   ├── StationHeader.tsx  # Station info + sync status
│   └── BottomNav.tsx      # Touch-optimized navigation
│
└── admin/                 # Admin-only components
    ├── MenuItemForm.tsx   # CRUD for menu items
    ├── CustomerHistory.tsx # Order history view
    └── AnalyticsChart.tsx # Phase 2
```

### 3.3 Data Flow Design
**Objective**: Define how data flows through the system

**Flow Diagrams Completed**:
1. **Order Creation Flow** (WhatsApp → n8n → API → DB → KDS)
2. **Packing Flow** (Start → Weigh → Calculate → Payment → Ready)
3. **HITL Flow** (Risk Check → Telegram → Approve/Reject → Continue/Cancel)
4. **Offline Flow** (Mutation → Queue → Sync → Conflict Resolution)

---

# Phase 4: Implementation (Required)

## Status: 🟡 In Progress

Implementation follows an **Epic → Story → Task** hierarchy aligned with BMad Method.

---

## Epic Structure

### Epic 1: Core Infrastructure
**Objective**: Set up foundation for all features
**Sprint**: Sprint 1 (Weeks 1-2)
**Status**: 🔵 Not Started

#### Story 1.1: Supabase Integration
**As a** developer
**I want** Supabase client utilities configured
**So that** all features can interact with the database securely

**Acceptance Criteria**:
- [ ] Browser client (`lib/supabase/client.ts`) created
- [ ] Server client (`lib/supabase/server.ts`) created
- [ ] Admin client (`lib/supabase/admin.ts`) created
- [ ] TypeScript types generated from database schema
- [ ] Environment variables configured
- [ ] Connection tested and verified

**Tasks**:
```bash
# Use /feature command to implement
/feature
# When prompted, describe: "Set up Supabase client utilities"
```

#### Story 1.2: Station Authentication
**As a** kitchen staff member
**I want** to register my tablet as a station
**So that** my actions are tracked and attributed correctly

**Acceptance Criteria**:
- [ ] Station registration API endpoint (`/api/stations`)
- [ ] Station ID stored in localStorage
- [ ] Station heartbeat mechanism (updates `last_seen_at`)
- [ ] Station type determines accessible features
- [ ] Station info displayed in header

**Tasks**:
```bash
/feature
# Describe: "Implement station authentication and registration"
```

#### Story 1.3: Offline Queue System
**As a** kitchen staff member
**I want** the app to work when internet is down
**So that** I can continue working without interruption

**Acceptance Criteria**:
- [ ] Mutation queue class (`lib/offline/mutation-queue.ts`)
- [ ] localStorage persistence
- [ ] Auto-sync on reconnection
- [ ] Conflict resolution (server wins for terminal states)
- [ ] Retry logic with max attempts
- [ ] Queue status displayed in UI

**Tasks**:
```bash
/feature
# Describe: "Build offline mutation queue with localStorage persistence"
```

---

### Epic 2: Orders Dashboard
**Objective**: Display and manage orders in real-time
**Sprint**: Sprint 2 Week 1
**Status**: 🔵 Not Started

#### Story 2.1: Orders List Screen
**As a** kitchen staff member
**I want** to see all pending orders
**So that** I know what needs to be prepared

**Acceptance Criteria**:
- [ ] Orders Dashboard screen at `/` route
- [ ] Display orders with status badges
- [ ] Filter by status (pending, packing, ready, etc.)
- [ ] Filter by date
- [ ] Real-time updates via Supabase Realtime
- [ ] Pull-to-refresh gesture
- [ ] Loading and error states
- [ ] Empty state ("No orders")

**Tasks**:
1. Create `app/(kds)/page.tsx` - Orders Dashboard
2. Create `components/kds/OrderCard.tsx` - Order display component
3. Create `lib/hooks/useOrders.ts` - React Query hook
4. Implement filters (status, date)
5. Add Supabase Realtime subscription
6. Add pull-to-refresh gesture

**Implementation Command**:
```bash
/feature
# Describe: "Create Orders Dashboard with real-time updates and filters"
```

#### Story 2.2: Order Detail View
**As a** kitchen staff member
**I want** to view full order details
**So that** I can see customer info and all items

**Acceptance Criteria**:
- [ ] Tap order card to view details
- [ ] Display customer name and phone
- [ ] Display all order items with quantities
- [ ] Display order notes
- [ ] Display pickup time
- [ ] Display order status history
- [ ] Action buttons based on current status
- [ ] Back button to return to dashboard

**Tasks**:
```bash
/component
# Create: OrderDetailModal or separate detail screen
```

---

### Epic 3: Packing & Weighing
**Objective**: Enable staff to pack orders and finalize pricing
**Sprint**: Sprint 2 Week 2
**Status**: 🔵 Not Started

#### Story 3.1: Packing Screen
**As a** kitchen staff member
**I want** to enter actual weights for each item
**So that** customers are charged the correct amount

**Acceptance Criteria**:
- [ ] Packing screen at `/orders/[id]` route
- [ ] Display all items with requested quantities
- [ ] Input field for actual weight (final_qty)
- [ ] Auto-calculate final price on weight change
- [ ] Display running total
- [ ] "Start Packing" button (updates status to `packing`)
- [ ] "Complete Packing" button (updates status to `ready`)
- [ ] Save weights to database
- [ ] Handle offline mode (queue mutations)

**Tasks**:
```bash
/feature
# Describe: "Create packing screen with weight input and price calculation"
```

#### Story 3.2: Payment Link Generation
**As a** kitchen staff member
**I want** to send a payment link after packing
**So that** customers can pay online

**Acceptance Criteria**:
- [ ] "Send Payment Link" button on packing screen
- [ ] Integrate with Meshulam API
- [ ] Generate payment link with order total
- [ ] Store payment URL in database
- [ ] Update order status to `pending_payment`
- [ ] Send payment link via n8n webhook
- [ ] Handle Meshulam errors gracefully
- [ ] Display confirmation message

**Tasks**:
```bash
/feature
# Describe: "Integrate Meshulam payment link generation"
```

---

### Epic 4: Inventory Management
**Objective**: Track daily prep quantities and availability
**Sprint**: Sprint 3 Week 1
**Status**: 🔵 Not Started

#### Story 4.1: Daily Inventory Screen
**As a** kitchen staff member
**I want** to set how much of each dish we prepared today
**So that** we don't oversell items

**Acceptance Criteria**:
- [ ] Inventory screen at `/inventory` route
- [ ] Display all menu items grouped by category
- [ ] Input field for prepared quantity
- [ ] Display ordered quantity (auto-calculated)
- [ ] Display available quantity (auto-calculated)
- [ ] Color-coded status (available, low, out of stock)
- [ ] Save to `daily_inventory` table
- [ ] Real-time updates when orders are placed
- [ ] Filter by category
- [ ] Summary stats (total dishes, available, low stock)

**Tasks**:
```bash
/feature
# Describe: "Create daily inventory management screen"
```

#### Story 4.2: Stock Reservation
**As a** system
**I want** to automatically reserve stock when orders are created
**So that** we don't oversell inventory

**Acceptance Criteria**:
- [ ] When order created, update `ordered_qty` in `daily_inventory`
- [ ] Check availability before creating order
- [ ] Return stock warnings if low or out of stock
- [ ] Release stock when order is cancelled
- [ ] Handle concurrent updates (database constraints)
- [ ] API endpoint `/api/inventory/reserve`
- [ ] API endpoint `/api/inventory/release`

**Tasks**:
```bash
/feature
# Describe: "Implement automatic stock reservation system"
```

---

### Epic 5: Pickup & Completion
**Objective**: Track payments and mark orders as collected
**Sprint**: Sprint 3 Week 2
**Status**: 🔵 Not Started

#### Story 5.1: Pickup Queue
**As a** pickup staff member
**I want** to see orders ready for pickup
**So that** I can hand them to customers

**Acceptance Criteria**:
- [ ] Pickup Queue screen at `/pickup` route
- [ ] Display orders with status `pending_payment`, `paid_online`, `paid_cash`
- [ ] Group by payment status
- [ ] Display customer name and order number
- [ ] "Mark Collected" button
- [ ] "Mark No-Show" button (after pickup time passed)
- [ ] Update customer stats on no-show
- [ ] Real-time updates
- [ ] Audio notification for new ready orders

**Tasks**:
```bash
/feature
# Describe: "Create pickup queue screen with payment tracking"
```

#### Story 5.2: Payment Webhook Handler
**As a** system
**I want** to receive payment confirmations from Meshulam
**So that** order status is updated automatically

**Acceptance Criteria**:
- [ ] Webhook endpoint `/api/webhooks/payment`
- [ ] Verify HMAC signature
- [ ] Update order status to `paid_online`
- [ ] Store `payment_id` from Meshulam
- [ ] Log payment in `order_status_history`
- [ ] Handle webhook retries (idempotent)
- [ ] Send error notifications if webhook fails

**Tasks**:
```bash
/feature
# Describe: "Implement Meshulam payment webhook handler"
```

---

### Epic 6: HITL Approval System
**Objective**: Enable managers to review risky orders
**Sprint**: Sprint 4
**Status**: 🔵 Not Started

#### Story 6.1: Risk Approvals Screen
**As a** manager
**I want** to review orders from risky customers
**So that** I can prevent fraud and no-shows

**Acceptance Criteria**:
- [ ] Approvals screen at `/approvals` route
- [ ] Display orders with status `awaiting_approval`
- [ ] Show customer history (total orders, no-shows)
- [ ] Show risk score and risk factors
- [ ] "Approve" button (moves to `approved` status)
- [ ] "Reject" button (moves to `cancelled`, requires reason)
- [ ] "Blacklist Customer" button
- [ ] Real-time updates
- [ ] Telegram notification integration

**Tasks**:
```bash
/feature
# Describe: "Create HITL approval screen for risky orders"
```

#### Story 6.2: Customer Risk Calculation
**As a** system
**I want** to calculate customer risk scores
**So that** risky orders are flagged for approval

**Acceptance Criteria**:
- [ ] Risk calculation in `/api/customers/check`
- [ ] Base score: 50
- [ ] Add 15 points per no-show
- [ ] Add 20 points for new customer
- [ ] Add 10 points for large order (>500 NIS)
- [ ] Auto-flag if score >70
- [ ] Auto-reject if blacklisted
- [ ] Return risk factors in response

**Tasks**:
```bash
/feature
# Describe: "Implement customer risk scoring algorithm"
```

---

### Epic 7: Reservations (שמור לי)
**Objective**: Manage "save for me" reservations
**Sprint**: Sprint 4
**Status**: 🔵 Not Started

#### Story 7.1: Reservations Screen
**As a** pickup staff member
**I want** to see all reservations for today
**So that** I can set items aside for customers

**Acceptance Criteria**:
- [ ] Reservations screen at `/reservations` route
- [ ] Display active reservations for today
- [ ] Show customer name, item, quantity
- [ ] Show reservation time
- [ ] Swipe-right to mark collected gesture
- [ ] "Cancel" button
- [ ] Auto-expire at end of day
- [ ] Filter by date
- [ ] Real-time updates

**Tasks**:
```bash
/feature
# Describe: "Create reservations screen with swipe gestures"
```

---

### Epic 8: Manual Order Entry
**Objective**: Allow staff to create orders for phone/walk-in customers
**Sprint**: Sprint 5
**Status**: 🔵 Not Started

#### Story 8.1: Manual Entry Form
**As a** kitchen staff member
**I want** to manually enter orders
**So that** phone and walk-in customers can order

**Acceptance Criteria**:
- [ ] Manual entry screen at `/orders/new` route
- [ ] Customer phone lookup (autocomplete)
- [ ] Dish search with autocomplete
- [ ] Add multiple items
- [ ] Set quantities
- [ ] Set pickup time
- [ ] Add notes
- [ ] Skip HITL check option (for staff trust)
- [ ] Check inventory availability
- [ ] Create order via API
- [ ] Redirect to packing screen

**Tasks**:
```bash
/feature
# Describe: "Create manual order entry form"
```

---

### Epic 9: Menu Management
**Objective**: Enable admins to manage menu items
**Sprint**: Sprint 5
**Status**: 🔵 Not Started

#### Story 9.1: Menu CRUD Screen
**As an** admin
**I want** to add, edit, and remove menu items
**So that** the menu stays up to date

**Acceptance Criteria**:
- [ ] Menu management screen at `/menu` route
- [ ] List all menu items grouped by category
- [ ] "Add Item" button opens form
- [ ] Edit item button (inline or modal)
- [ ] Delete item (soft delete, mark unavailable)
- [ ] Form fields: name, normalized name, category, price, unit type, min qty
- [ ] Image upload (Phase 2)
- [ ] Validation (required fields, price > 0)
- [ ] API endpoints for CRUD operations

**Tasks**:
```bash
/feature
# Describe: "Create menu management CRUD interface"
```

---

## Implementation Workflow

### Starting a New Epic

1. **Review Epic Goals**
   ```bash
   # Read the epic description in this file
   # Understand acceptance criteria
   # Identify dependencies
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b epic/epic-name
   ```

3. **Work Story by Story**
   ```bash
   # For each story in the epic:
   /feature
   # Describe the story when prompted
   # Let the agent create a plan
   # Approve the plan
   # Review implementation
   # Test locally
   ```

4. **Commit Progress**
   ```bash
   # Use Claude's /commit command
   /commit
   # Describe changes when prompted
   ```

5. **Create Pull Request**
   ```bash
   # When epic is complete
   /pr
   # Describe epic when prompted
   ```

---

## BMad Method Slash Commands

### Core Commands

```bash
/feature         # Guided feature implementation
/component       # Create new React component
/fix             # Fix bugs with structured approach
/review          # Code quality review
/commit          # Create git commit
/pr              # Create pull request
```

### Phase-Specific Commands

```bash
# Phase 2: Planning
/prd            # Generate/update PRD

# Phase 3: Solutioning
/architecture   # Design system architecture
/database       # Design database schema

# Phase 4: Implementation
/epic           # Start new epic
/story          # Implement user story
/test           # Add test coverage
```

---

## Epic Tracking

### Progress Dashboard

| Epic | Sprint | Stories | Status | Completion |
|------|--------|---------|--------|------------|
| 1. Core Infrastructure | Sprint 1 | 3/3 | 🔵 Not Started | 0% |
| 2. Orders Dashboard | Sprint 2.1 | 2/2 | 🔵 Not Started | 0% |
| 3. Packing & Weighing | Sprint 2.2 | 2/2 | 🔵 Not Started | 0% |
| 4. Inventory Management | Sprint 3.1 | 2/2 | 🔵 Not Started | 0% |
| 5. Pickup & Completion | Sprint 3.2 | 2/2 | 🔵 Not Started | 0% |
| 6. HITL Approval | Sprint 4 | 2/2 | 🔵 Not Started | 0% |
| 7. Reservations | Sprint 4 | 1/1 | 🔵 Not Started | 0% |
| 8. Manual Entry | Sprint 5 | 1/1 | 🔵 Not Started | 0% |
| 9. Menu Management | Sprint 5 | 1/1 | 🔵 Not Started | 0% |

**Legend**:
- 🔵 Not Started
- 🟡 In Progress
- 🟢 Completed
- 🔴 Blocked

---

## Next Steps

### Current Phase: Phase 4 - Implementation

**Next Action**: Start Epic 1: Core Infrastructure

```bash
# Begin with Story 1.1: Supabase Integration
/feature

# When prompted, describe:
"Set up Supabase client utilities for browser, server, and admin access with TypeScript types"
```

**Estimated Time**: Sprint 1 (2 weeks) for Epic 1-3

---

## BMad Method Best Practices

### 1. One Story at a Time
- Complete each story fully before moving to the next
- Don't context-switch between epics
- Test thoroughly before marking complete

### 2. Commit Frequently
- Commit after each story completion
- Use descriptive commit messages
- Reference story numbers in commits

### 3. Pull Requests per Epic
- Create PR when epic is complete
- Include all stories in the epic
- Link to PRD section
- Add screenshots/demos

### 4. Documentation as You Go
- Update this file when stories complete
- Document any deviations from plan
- Note blockers and resolutions

### 5. Regular Reviews
- Review code quality after each epic
- Run `/review` command before PR
- Address technical debt immediately

---

## BMad Method Resources

- **PRD**: [PRD.md](../../PRD.md) - Complete product requirements
- **Workflows**: [.claude/workflows/](../) - All workflow files
- **Commands**: [.claude/commands/](../../commands/) - Custom slash commands
- **Database**: [supabase/migrations/](../../supabase/migrations/) - All SQL migrations

---

**Last Updated**: Sprint 0 (Setup Complete)
**Current Epic**: Epic 1 - Core Infrastructure
**Current Story**: Story 1.1 - Supabase Integration
**Next Milestone**: Epic 1 Complete (End of Sprint 1)
