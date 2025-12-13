---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - /Users/harel/Desktop/projects/lacomida-bot/kitchenos/docs/archive/PRD.md
workflowType: 'product-brief'
lastStep: 5
project_name: 'kitchenos'
user_name: 'Harel'
date: '2025-12-12'
---

# Product Brief: kitchenos

**Date:** 2025-12-12
**Author:** Harel

---

## Executive Summary

**KitchenOS** is a tablet-first Kitchen Display System designed specifically for home-based food businesses that have outgrown WhatsApp chaos but can't afford enterprise restaurant software. Built for Lacomida — a beloved Yemeni home kitchen — KitchenOS transforms Friday morning pandemonium into coordinated calm while preserving the warmth and human judgment that makes these businesses special.

The system integrates WhatsApp ordering (via n8n + Wassenger), real-time inventory tracking, human-in-the-loop risk approval for repeat no-shows, automated payment processing (Meshulam), and offline-resilient tablet interfaces designed for flour-covered hands and steam-filled kitchens. Success means cutting no-show rates from 15% to <5%, reducing checkout time from 5 minutes to 90 seconds, and eliminating the ₪ thousands lost monthly to missed messages, calculation errors, and unpaid orders — while the owner finally sleeps Thursday night.

This isn't automation replacing humanity. It's software that respects small food businesses enough to build systems as hardworking as they are.

---

## Core Vision

### Problem Statement

Successful home-based food businesses are trapped between two impossible choices: stay small and manageable, or grow and drown in operational chaos.

**Lacomida** represents this perfectly: a Yemeni home kitchen with loyal customers, generational recipes, and demand that outstrips their ability to manage it. WhatsApp messages flood in faster than they can track. Paper-based reservations get lost. Manual weighing and price calculation creates bottlenecks and errors. "I'll pay when I pick up" promises turn into wasted food when customers no-show. The owner works 16-hour days and still loses money to chaos.

There are 47 unread messages Thursday afternoon. Some are orders, some are changes, some are questions. There's no single source of truth. The owner can't sleep Thursday night wondering: *Did I write down the Cohen order? How much chicken is left? Will the guy who ordered 3kg actually show up?*

### Problem Impact

**For Owners:**
- Lost revenue: ~8% from no-shows, calculation errors, missed messages, unpaid orders
- Chronic stress and sleepless nights from operational uncertainty
- Customer trust erosion when reservations are forgotten or stock runs out unexpectedly
- Working harder while making less — the business punishes success

**For Kitchen Staff:**
- Friday morning chaos: searching paper scraps for order details
- Manual weighing → calculator → handwriting prices → customer frustration at slow checkout
- No coordination between packing station and pickup station
- Impossible to know real-time what's available

**For Loyal Customers:**
- No confirmation their order was received
- Show up hoping their reserved items are actually there
- Long waits during Friday pickup rush
- Awkward payment chasing via WhatsApp
- Consider switching to competitors with "actual systems"

### Why Existing Solutions Fall Short

**Enterprise Restaurant POS Systems** (Toast, Square, Lightspeed):
- Built for sit-down restaurants, not home kitchens with WhatsApp ordering
- Monthly costs ($50-200+) that home businesses can't justify
- Require formal business structure, credit card terminals, staff training
- Don't handle "שמור לי" trust-based reservations or weight-based pricing workflows

**Generic Order Management Tools** (Spreadsheets, Trello, WhatsApp Business):
- No real-time coordination across stations
- Manual price calculations still required
- No payment integration
- No offline resilience (WiFi fails mid-Friday rush = total breakdown)
- No protection from serial no-shows

**Custom Development**:
- Most home businesses can't afford $20k-50k custom builds
- Generic developers don't understand the "תימנייה at 4am" context
- Maintenance becomes another burden

**The Gap**: No one builds software that respects small food businesses enough to solve their actual problems within their actual constraints (budget, technical literacy, kitchen environment, cultural patterns).

### Proposed Solution

**KitchenOS** is a tablet-first Kitchen Display System architected specifically for the realities of home-based food operations:

**1. Seamless WhatsApp Integration**
- Customers order the familiar way (WhatsApp)
- n8n workflow automatically creates structured orders in the system
- Confirmations sent back to customers
- Owner sees organized order queue instead of message chaos

**2. Real-Time Inventory Truth**
- Kitchen sets daily prep quantities each morning
- System tracks what's allocated to confirmed orders vs. what's available
- Staff see live stock levels — no more overselling
- Customers get honest "sorry, sold out" before hopes are raised

**3. Human-in-the-Loop (HITL) Risk Protection**
- System flags risky orders: repeat no-shows, new customers with large orders, blacklisted numbers
- Owner gets Telegram notification with customer history
- **Owner decides** — system supports judgment, doesn't replace it
- Serial no-shows can be auto-rejected after owner sets policy

**4. Tablet-Optimized Packing Workflow**
- Big touch targets (48px minimum), loud notifications, works offline
- Staff tap order → weigh items → enter weight → system calculates price
- One tap sends payment link (Meshulam) directly to customer's WhatsApp
- Real-time status updates across all stations

**5. "שמור לי" (Reservation) Tracking**
- Customers can reserve items without upfront payment
- System tracks reservations by date, sends reminders
- Staff mark when collected
- Trust-based system with digital memory

**6. Payment & Pickup Queue**
- Dedicated pickup station sees: payment status, what's ready, what's waiting
- Swipe to mark collected
- Auto-mark no-show if not picked up by cutoff time
- No chasing payments — system handles it

### Key Differentiators

**1. Built for the Kitchen, Not the Boardroom**
- Touch targets sized for flour-covered fingers
- Offline-first architecture (queue mutations locally, sync when reconnected)
- Landscape tablet layout optimized for counter placement
- Sound notifications audible over kitchen noise
- RTL Hebrew interface — cultural respect baked in

**2. Preserving Humanity in Automation**
- HITL system lets owner apply context and grace to risk decisions
- "שמור לי" feature honors trust-based cultural patterns
- Manual order entry for phone/walk-in customers
- Owner can override any automated decision

**3. Protection Without Punishment**
- Risk scoring transparent: shows *why* a customer was flagged
- Second chances configurable (owner decides forgiveness policy)
- Blacklist management with reason tracking and reversal capability

**4. Coordinated Kitchen, Not Isolated Tablets**
- Supabase Realtime means status updates propagate instantly
- Station 1 packs → Station 3 immediately sees "Ready for Pickup"
- Inventory depletion visible across all screens
- Kitchen operates as single organism

**5. Economic Access**
- Built on modern, cost-efficient stack (Next.js, Supabase, Vercel)
- Open source foundation — no vendor lock-in
- Hosting costs: ~$20-30/month (vs. $200+ for enterprise POS)
- One-time development, perpetual value

**6. Opinionated Workflows That Just Work**
- Not a flexible "configure anything" platform that requires setup expertise
- Captures years of home kitchen operational wisdom
- Packing → Payment → Pickup flow is pre-designed
- Staff can start using it immediately

---

## Target Users

### Primary Users

#### **Yaron & Sharon — The Owners (25 years, 10-person cooking operation + 4-person orders team)**

**Who They Are:**

Yaron and Sharon have been running Lacomida for 25 years. What started as Sharon's family recipes has grown into a beloved Friday tradition for dozens of families. They oversee a 10-person kitchen cooking operation and a separate 4-person orders department. While comfortable with basic technology (WhatsApp, Word, email), their current system is held together by Yaron's Thursday night manual ritual and constant vigilance over his personal phone.

**Current Thursday-Friday Reality:**

**Thursday:**
- 7am: Sharon and the 10-person kitchen team start cooking
- All day: Orders arrive via WhatsApp (Yaron's personal phone), phone calls, and email
- Thursday noon-evening: Order flood intensifies, sometimes arriving as late as 10pm
- **Thursday night (late): Yaron's Manual Ritual**
  - Copy orders from his personal WhatsApp chat
  - Paste into Word document
  - Add customer name at top of each order
  - Print all orders
  - Cut with scissors into individual slips
  - Physically arrange the paper slips for the orders team

**Friday:**
- 6am: 4-person orders team arrives, takes Yaron's arranged slips, starts filling boxes
- 6am-8:30am: All 4 staff packing orders based on paper slips
- 8:30am: Checkout rush begins — 2 staff must leave packing to work the counter with cashier
- Throughout morning: Remaining staff must manually check Yaron's phone for new Friday orders (often missed)
- 10-person cooking team operates separately — no interaction with orders system

**Their Biggest Pain:**

"The orders department creates too much mess and requires too much attention. We need to take the heat off that part of the operation."

**Root Cause:** The 4-person orders team is the bottleneck. When the Friday rush hits, they lose half their staff to customer service, while new orders still flood in via Yaron's phone. The manual Thursday night ritual is unsustainable, and missed messages mean disappointed customers and lost revenue (~8% revenue leakage from no-shows, calculation errors, missed orders, unpaid invoices).

**What Would Make Them Say "This Changed My Life":**

- **No more Thursday night ritual**: Orders automatically flow into the system from WhatsApp, phone, and email
- **Desktop/laptop interface**: Yaron can review and manually enter email/phone orders from his laptop during the week
- **Peace of mind**: Confidence that no orders slip through the cracks — every WhatsApp, call, and email is tracked
- **4-person team can handle Friday rush**: System eliminates bottlenecks so orders team doesn't break under pressure
- **Time savings**: Hours reclaimed from manual copy-paste-print-cut workflow
- **Eyes on the business**: Yaron can supervise quality instead of babysitting order chaos

---

#### **The 4-Person Orders Team (The Friday Morning Warriors)**

**Who They Are:**

The orders department team — mostly family members, occasionally with hired help — arrives at 6am Friday to execute the day's orders. They're comfortable with easy-to-use Hebrew technology but currently work with only paper slips and constant manual phone-checking. When the 8:30am rush hits, they split: 2 continue packing while 2 handle the customer counter and cashier duties.

**Current Friday Morning Reality:**

**6am-8:30am: The Packing Sprint**
- Take Yaron's pre-arranged paper order slips
- Fill boxes with food based on handwritten/printed instructions
- Try to complete order batch before rush hour (9am)
- Attach order paper to each completed box
- Must manually check Yaron's phone periodically for new Friday morning orders (often missed)

**Cashier/Counter Station (1-2 people from the team):**
- Weighs portions
- Calculates prices on calculator
- Writes prices on bags by hand
- Attaches order paper to bag
- If customer prepaid (credit card via phone): adds receipt
- If not prepaid: marks on bag "payment due"
- When customer arrives: searches for their name on paper attached to bags

**8:30am onwards: Split Duty Chaos**
- Checkout line forms as walk-in customers arrive
- 2 staff must leave packing to work the counter
- Only 2 people left finishing remaining orders during peak demand
- New Friday morning orders still arriving via Yaron's phone (often missed because only 2 people left packing)

**Their Biggest Frustrations:**

1. **Dependency on Yaron's Personal WhatsApp**: "We need to be attentive to his mobile and manually look for new messages"
2. **Missed Orders**: "Sometimes Yaron missed a customer or we didn't see it in his phone, and suddenly someone shows up saying 'I have an order' — but we didn't fill it"
3. **Friday Morning Blind Spots**: "Customers send new orders Friday morning. If we don't manually check the phone, we miss them"
4. **Phone Interruptions**: Having to take customer calls while trying to fill orders
5. **Context Switching**: Going from heads-down packing to customer-facing checkout with no transition

**What Would Make Their Friday Mornings Actually Manageable:**

- **Live, simple view**: Who ordered, what they ordered, when they're coming — all in one place
- **Eyes off Yaron's phone**: Orders automatically appear on their tablets/dashboard
- **TV dashboard on the wall**: Public display showing order queue so everyone (staff + customers) sees progress
- **No more manual phone-checking**: System alerts them with sound notifications when new orders arrive
- **Stop taking calls during packing**: Orders flow into system automatically
- **Clear order status tracking**: Know what's done, what's pending, what's ready for pickup
- **Smooth packing-to-checkout transition**: Same tablets work for both packing view and pickup/cashier view

---

### Secondary Users

#### **Customers (Passive Beneficiaries)**

Customers don't directly interact with KitchenOS tablets, but they benefit significantly:

**WhatsApp Order Confirmations:**
- Receive automatic confirmation: "Your order #47 is confirmed for Friday 9am pickup! Watch for your number on our board."
- Sets expectations and gives them their order tracking number

**Public TV Dashboard (Customer-Facing):**
- Large TV display visible in the pickup area shows real-time order status
- Format: **Order #47 (David) - Ready! 🟢**
- Color-coded status: 🟡 Being Prepared | 🟢 Ready for Pickup
- Customers watch for their order number + first name to turn green
- Reduces "where's my order?" questions by 80%
- No sensitive information displayed: no full names, no prices, no internal notes

**Faster Checkout:**
- Staff use tablets to instantly find orders by name or number
- Weight input → automatic price calculation
- Payment link sent via WhatsApp → customers pay before pickup
- In and out in 90 seconds instead of 5 minutes

---

### User Journey

#### **Discovery & Onboarding**

**Week Before Launch:**
- Yaron sets up KitchenOS: 2-3 tablets at packing stations, 1 tablet at cashier counter, TV mounted on wall for public dashboard
- Desktop/laptop access configured for Yaron to manage orders during the week
- 15-minute staff walkthrough: "This is your new order dashboard" — simple Hebrew interface, big touch targets

**First Thursday Night:**
- Orders flow in via WhatsApp (automated via n8n), phone (Yaron enters via desktop), and email (Yaron copies into desktop interface)
- Instead of copy-paste-print-cut ritual, Yaron reviews the digital queue on his laptop
- Goes to bed early for the first time in years

#### **Core Friday Usage**

**Friday 6am — Packing Staff Arrive:**
- Tap tablet to see complete order queue
- Each order shows: Customer name, order number, items, quantities, pickup time, payment status
- Tap an order to start packing
- Check off items as they fill boxes
- Weigh portions → enter weight → system calculates price instantly
- Tap "Ready for Packing Complete" → order moves to pickup queue
- New orders pop up with loud sound notification — no phone-checking needed
- **TV dashboard on wall** shows live queue: all staff can see what's coming next

**Friday 8:30am — Checkout Rush Begins:**
- 2 staff move to counter (same tablets, different view mode)
- **Pickup/Cashier View** shows: orders ready for collection, payment status
- Customer arrives: "I'm David Cohen"
- Tap search → "David" → order #47 appears
- Status: 🟢 Paid Online (Meshulam)
- Hand customer their bag, tap "Collected" → done
- **Public TV Dashboard** updates: Order #47 (David) disappears from board

**Friday Morning — Yaron (Owner):**
- Checks laptop occasionally to see order progress
- Gets Telegram notification: "⚠️ Order #52 flagged: Customer has 2 previous no-shows. Approve?"
- Reviews customer history, decides to approve with note: "Call to confirm pickup time"
- Otherwise hands-off — system runs itself

**Friday Morning — Customers in Line:**
- Stand in pickup area, watching TV dashboard
- See: "Order #47 (David) - Ready! 🟢"
- Know their order is ready without asking staff
- Reduces anxiety, reduces interruptions to packing team

#### **Success Moments**

**Week 1, Friday Afternoon:**
- All 23 orders completed without chaos
- Zero missed orders for the first time ever
- Staff: "Wait... that was actually manageable?"
- Yaron: "I didn't touch my phone once during the morning"

**Week 4:**
- Yaron realizes he hasn't done the Thursday night copy-paste-print-cut ritual in a month
- Sharon: "You slept Thursday night. When was the last time that happened?"
- Friday morning: A customer orders at 8:15am (used to be missed)
- System alerts staff immediately with sound notification
- Order filled in 15 minutes, customer picks up at 9:30am
- Customer pays online via Meshulam link, in and out in 90 seconds
- Customer: "Wow, you guys are so organized now!"

**Month 3:**
- Revenue leakage drops from 8% to <2% (fewer no-shows, no calculation errors, no missed orders)
- No-show rate drops from ~15% to <5% (HITL approval system working)
- Staff morale improves: "Fridays don't feel like chaos anymore"
- Yaron to Harel: "This changed my life. I can actually focus on the food quality instead of chasing orders."

---

### System Boundaries

**In Scope (KitchenOS Users):**
- Yaron & Sharon (owners) — Desktop/laptop for order management, manual entry, HITL approvals
- 4-person orders team — Tablets for packing, weighing, pricing, pickup/cashier
- Customers — Passive beneficiaries (WhatsApp confirmations, public TV dashboard viewing)

**Out of Scope:**
- 10-person cooking team — Separate workflow, no system interaction
- They cook based on Sharon's instructions, completely independent of orders department

---

## Success Metrics

### User Success Metrics

#### **Yaron & Sharon (Owners) - "This Changed My Life"**

**1 Month Success Indicators:**
- ✅ **Zero manual Thursday night ritual** - No more copy-paste-print-cut workflow
- ✅ **Zero missed orders** - Every WhatsApp, email, and phone order captured in system
- ✅ **100% order visibility** - Yaron can see complete order queue from laptop at any time
- ✅ **Stress reduction** - Yaron sleeps Thursday night instead of worrying about missed orders

**3 Month Success Indicators:**
- ✅ **Measurable team performance improvement**:
  - Orders completed before 9am rush hour (vs. current: still packing during rush)
  - 4-person team handles peak without breaking (no more Friday morning chaos)
  - Staff morale: "Fridays don't feel like chaos anymore"
- ✅ **Revenue leakage drops from ~8% to <2%** (fewer no-shows, calculation errors, missed orders)
- ✅ **Time savings**: 2-3 hours/week reclaimed from manual order management

**6 Month Success Indicators:**
- ✅ **Customer feedback shift**: "Wow, it's faster and better now"
- ✅ **Operational consistency**: System runs reliably without Yaron's constant intervention
- ✅ **Business confidence**: Yaron focuses on food quality instead of order chaos

**"Worth It" Criteria:**
All of the above achieved = Success

---

#### **4-Person Orders Team - "Actually Manageable Fridays"**

**Core Success Outcome:**
**All orders completed BEFORE rush hour begins (9am)** - This is the game-changer. Currently, they're still packing while customers are lining up.

**Success Indicators:**
- ✅ **No surprises**: Zero instances of "customer shows up and we didn't fill their order"
- ✅ **At-glance status visibility**:
  - Staff can see at any moment: How many orders left? What's each order's status?
  - TV dashboard shows live queue - everyone knows what's coming
- ✅ **Stress reduction**:
  - No more manual phone-checking anxiety
  - No more frantic "did we miss someone?" moments
  - Calm, coordinated execution instead of chaos
- ✅ **Context-switch ease**: Smooth transition from packing to pickup/cashier mode (same tablets, different views)

**Behavioral Indicators of Value:**
- Staff arrive at 6am and confidently work through digital queue
- No interruptions to ask "where's the order for...?"
- 2 staff can leave for counter at 8:30am without panic from remaining 2
- End of Friday: "That was actually manageable"

---

#### **Customers - "They Actually Have My Order"**

**Core Success Outcome:**
**Certainty replaces gambling** - Customers know with confidence that Lacomida has their order and it will be ready.

**Success Indicators:**
- ✅ **Immediate confirmation**: WhatsApp bot responds instantly with order confirmation + order number
- ✅ **Visibility into readiness**:
  - TV dashboard shows "Order #47 (David) - Ready! 🟢"
  - Customers KNOW their order status without asking
- ✅ **Zero "we didn't see your order" apologies**:
  - No more showing up to find out their order wasn't filled
  - No more tired staff apologizing for lost messages
- ✅ **Faster checkout**:
  - From 5 minutes (manual weighing, calculator, handwriting prices)
  - To 90 seconds (digital lookup, instant price calc, tap "collected")

**Experience Transformation:**
- **Before**: "I hope they got my message... I hope the עוף didn't run out... I hope I don't wait 20 minutes in line..."
- **After**: "I got confirmation with order #47. I see it on the board. It's ready. I'm in and out in 90 seconds."

---

### Business Objectives

#### **3-Month Objectives**

1. **Eliminate Revenue Leakage**
   - **Current**: ~8% revenue loss from no-shows, calculation errors, missed messages, unpaid orders
   - **Target**: <2% revenue leakage
   - **Impact**: For ₪100k/month business = ₪6k/month recovered = ₪72k/year

2. **Reduce No-Show Rate**
   - **Current**: ~15% no-show rate on reserved orders
   - **Target**: <5% no-show rate (HITL approval system working)
   - **Impact**: Less wasted food, better resource planning

3. **Operational Efficiency**
   - **Current**: 4-person team struggles to complete orders during rush
   - **Target**: All orders completed before 9am rush hour begins
   - **Impact**: Team handles 2x volume without adding staff

4. **Customer Experience Improvement**
   - **Current**: Checkout time 5 minutes, frequent "we didn't see your order" issues
   - **Target**: 90-second checkout, zero missed orders
   - **Impact**: Customer retention, positive word-of-mouth, competitive advantage

#### **6-Month Objectives**

5. **Owner Time Reclamation**
   - **Target**: 2-3 hours/week saved from manual order management
   - **Impact**: Yaron focuses on business growth and quality instead of order chaos

6. **Scalability Foundation**
   - **Target**: System handles 50% more orders without additional staff
   - **Impact**: Business can grow without proportional cost increase

7. **Customer Perception Shift**
   - **Target**: Customers say "Lacomida got so organized" without prompting
   - **Impact**: Brand reputation upgrade from "home kitchen" to "professional operation"

---

### Key Performance Indicators (KPIs)

#### **Operational KPIs (Tracked Weekly)**

| KPI | Current Baseline | Week 1 Target | Month 1 Target | Month 3 Target |
|-----|------------------|---------------|----------------|----------------|
| **Orders completed before 9am rush** | 60% | 80% | 95% | 100% |
| **Missed orders per week** | 2-3 | 1 | 0 | 0 |
| **Average checkout time** | 5 min | 3 min | 2 min | 90 sec |
| **Manual phone checks per Friday** | 20+ | 10 | 5 | 0 |
| **Yaron's Thursday night ritual time** | 1-2 hours | 30 min | 15 min | 0 min |

#### **Financial KPIs (Tracked Monthly)**

| KPI | Current Baseline | Month 1 Target | Month 3 Target | Month 6 Target |
|-----|------------------|----------------|----------------|----------------|
| **Revenue leakage %** | ~8% | 5% | 2% | <2% |
| **No-show rate** | ~15% | 10% | 5% | <5% |
| **Unpaid invoices** | ₪3-5k/month | ₪2k | ₪500 | <₪300 |
| **Revenue recovered** | - | ₪3k | ₪6k | ₪6k+ |

#### **Customer Experience KPIs (Tracked Monthly)**

| KPI | Current Baseline | Month 1 Target | Month 3 Target | Month 6 Target |
|-----|------------------|----------------|----------------|----------------|
| **Order confirmation rate** | 0% (manual) | 100% (automated) | 100% | 100% |
| **"Didn't see order" incidents** | 2-3/week | 1/week | 0/month | 0 |
| **Customer complaints** | 5-8/month | 3/month | 1/month | 0/month |
| **Positive feedback** | Rare | Occasional | Weekly | Multiple/week |

#### **Team Health KPIs (Tracked Monthly - Qualitative)**

| KPI | Current State | Month 1 | Month 3 | Month 6 |
|-----|---------------|---------|---------|---------|
| **Friday morning stress level** | High chaos | Moderate | Low | Calm |
| **Staff confidence** | "Hope we don't miss anyone" | "System helps us" | "We've got this" | "Totally manageable" |
| **Yaron's sleep quality (Thursday)** | Poor (worrying) | Better | Good | Normal |

---

### Leading Indicators (Predict Success)

**Early Warning System - Week 1:**
- ✅ All WhatsApp orders auto-captured (100% success rate)
- ✅ Yaron successfully enters email/phone orders via desktop
- ✅ Staff complete training in <15 minutes (interface is intuitive)
- ✅ Zero system crashes during first Friday rush
- ✅ TV dashboard displaying correctly (customer-facing view works)

**Momentum Indicators - Month 1:**
- ✅ Staff proactively use tablets without prompting
- ✅ Zero requests to "go back to paper slips"
- ✅ Yaron checks laptop instead of manually organizing orders
- ✅ Customers mention seeing their order number on the board
- ✅ At least one "wow, this is better" comment from customer

**Sustainability Indicators - Month 3:**
- ✅ System runs Friday morning with minimal Yaron intervention
- ✅ Staff can onboard new team member using system in <30 minutes
- ✅ No rollback requests ("we want the old way back")
- ✅ Yaron considers expanding order capacity (sign of confidence)

---

### Success Threshold Definition

**Minimum Viable Success (3 months):**
- Zero missed orders
- <5% revenue leakage
- Orders completed before 9am rush
- Yaron eliminated Thursday night manual ritual
- Staff say "this is better" without prompting

**Full Success (6 months):**
- All KPI targets met
- Customer feedback confirms perception shift
- System runs reliably without constant oversight
- Business considering expansion (sign of operational confidence)

**Failure Criteria (Would trigger re-evaluation):**
- Revenue leakage still >5% after 3 months
- Staff request to revert to paper system
- System crashes during >2 Friday rushes
- Customers complain system made things worse
- Yaron still doing manual Thursday night work after 2 months

---

## MVP Scope

### Core Features (Must Have - Week 1)

#### **1. WhatsApp Order Automation (The Game Changer)**
- **n8n + Wassenger Integration**: WhatsApp orders automatically flow into KitchenOS
- **Instant Confirmation**: Customers receive order confirmation with order number
- **No More Manual Phone-Checking**: Orders appear on tablets automatically
- **Impact**: Eliminates Yaron's Thursday night copy-paste-print-cut ritual + Friday morning missed messages

#### **2. Orders Dashboard (Tablet - Packing View)**
- View all orders in queue
- Filter by status, date, pickup time
- Tap to start packing an order
- Real-time updates across all tablets
- **Users**: 4-person orders team
- **Impact**: Single source of truth, no more paper slips

#### **3. Weighing & Packing Screen (Tablet)**
- Display order details (customer, items, quantities)
- Enter actual weights for each item
- Automatic price calculation based on weight
- Send payment link (Meshulam) to customer's WhatsApp
- Mark order as "Ready for Pickup"
- **Users**: 4-person orders team (packing staff)
- **Impact**: Eliminates manual calculator + handwriting prices

#### **4. Inventory Management (Tablet)**
- Set daily prep quantities each morning
- Real-time view of available vs. allocated stock
- Low stock warnings
- Track what's been ordered vs. what's left
- **Users**: Yaron/Sharon + orders team
- **Impact**: No more overselling, customers get honest stock availability

#### **5. Payment & Pickup Queue (Tablet - Cashier View)**
- View orders ready for collection
- Search by customer name or order number
- Display payment status (Paid Online / Cash at Pickup)
- Mark orders as collected
- Auto-mark no-show after cutoff time
- **Users**: 2 staff members who transition to counter at 8:30am
- **Impact**: Fast checkout (90 seconds vs. 5 minutes), clear payment tracking

#### **6. Desktop/Laptop Interface (Manual Order Entry)**
- Yaron enters email and phone orders via laptop
- Same order creation flow as WhatsApp, but manual
- Review and manage order queue from desktop
- **Users**: Yaron (owner)
- **Impact**: Handles the 3 order channels (WhatsApp automated, email/phone manual)

#### **7. Public TV Dashboard (Customer-Facing, Read-Only)**
- Large TV display showing real-time order status
- Format: **Order #47 (David) - Ready! 🟢**
- Color-coded: 🟡 Being Prepared | 🟢 Ready for Pickup
- Sanitized data (no prices, no full names, no internal notes)
- **Users**: Customers waiting in line
- **Impact**: Reduces "where's my order?" questions by 80%, customer confidence

#### **8. Offline Resilience**
- Tablets queue mutations locally when WiFi drops
- Auto-sync when connection restored
- No Friday rush breakdown if WiFi hiccups
- **Impact**: System reliability during peak stress

---

### Out of Scope for MVP (Phase 2)

#### **Deferred to Post-Launch:**

1. **Risk Approvals / HITL (Human-in-the-Loop)**
   - **Why defer**: Need to collect 1-2 months of no-show data first to build risk scoring model
   - **When to add**: Month 2-3, once we have baseline customer behavior data
   - **Workaround for MVP**: Yaron manually reviews new/suspicious customers

2. **Reserved Items (שמור לי) Management**
   - **Why defer**: Nice-to-have but not critical for core problem
   - **When to add**: Phase 2 after core order flow is stable
   - **Workaround for MVP**: Track reservations in notes field or separate spreadsheet

3. **Menu Management Screen (Admin)**
   - **Why defer**: Can manage menu via direct database updates at first
   - **When to add**: Month 3+ when menu changes become frequent
   - **Workaround for MVP**: Yaron/Harel update menu via Supabase dashboard

4. **Analytics Dashboard**
   - **Why defer**: Need historical data first; focus on operations before analytics
   - **When to add**: Month 6+ once we have meaningful data to analyze
   - **Workaround for MVP**: Export data manually if needed

5. **Customer Details / History View**
   - **Why defer**: Can access via database queries initially
   - **When to add**: Phase 2, alongside HITL system
   - **Workaround for MVP**: Simple search in orders table

6. **Multi-Station Assignment**
   - **Why defer**: 4-person team is small enough for self-coordination
   - **When to add**: If team grows beyond 6 people
   - **Workaround for MVP**: Staff verbally claim orders ("I'll take #45")

---

### MVP Success Criteria

**Week 1 Success Gates:**
- ✅ WhatsApp orders auto-flow into system (100% capture rate)
- ✅ 4-person team uses tablets without reverting to paper
- ✅ Yaron enters email/phone orders via desktop successfully
- ✅ System survives first Friday rush without crashes
- ✅ At least 80% of orders completed before 9am rush (vs. current 60%)

**Month 1 Go/No-Go Decision:**
- ✅ Zero "go back to paper slips" requests from staff
- ✅ Missed orders: 0 per week (vs. current 2-3)
- ✅ Yaron's Thursday night ritual eliminated (0 minutes vs. 1-2 hours)
- ✅ Customer feedback neutral or positive (no complaints about new system)
- ✅ Staff morale improved ("this is better" comments)

**If Month 1 Success → Proceed to Phase 2:**
- Add HITL risk approval system
- Add שמור לי reservation tracking
- Add menu management screen
- Begin analytics data collection

**If Month 1 Failure → Iterate MVP:**
- Identify blockers (usability issues, missing features, bugs)
- Fix critical problems before adding new features
- Re-assess after iteration

---

### Future Vision (12-24 Months)

**If KitchenOS succeeds at Lacomida, what could it become?**

#### **Platform for Home Food Businesses (The Big Vision)**

**Multi-Tenant SaaS Platform:**
- Other home kitchens can sign up and use KitchenOS
- Customizable for different cuisines (Yemeni, Persian, Iraqi, Ethiopian, etc.)
- Multi-language support (Hebrew, Arabic, English, Russian)
- Pricing: $30-50/month subscription (vs. $200+ enterprise POS)

**Advanced Features:**
- **AI-Powered Demand Forecasting**: Predict weekly demand based on historical patterns
- **Smart Inventory Suggestions**: "Based on last 3 Fridays, prepare 8kg עוף, 5kg חומוס"
- **Customer Loyalty Program**: Track repeat customers, offer discounts
- **Multi-Channel Ordering**: WhatsApp + Instagram DM + Facebook Messenger + dedicated ordering page
- **Delivery Integration**: Partner with local delivery services
- **Group Order Coordination**: Handle large family/event orders with deposit workflow

**Ecosystem Expansion:**
- **Supplier Network Integration**: Direct ordering from suppliers based on prep quantities
- **Financial Dashboard**: Revenue tracking, profitability analysis, tax-ready reports
- **Marketing Automation**: Automated Friday morning reminder messages to regular customers
- **Community Marketplace**: Directory of home kitchens using KitchenOS (discovery for customers)

**Market Expansion:**
- Start with Israeli home food businesses (dozens in every city)
- Expand to US (immigrant communities with home food operations)
- Target: 100+ home kitchens within 2 years
- Potential market: Thousands of home food businesses globally

---

**But for now:** Focus on making Lacomida's Friday mornings manageable. Everything else builds from that foundation.

---

<!-- Content will be appended sequentially through collaborative workflow steps -->
