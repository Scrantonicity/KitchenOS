---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - /Users/harel/Desktop/projects/lacomida-bot/kitchenos/docs/analysis/product-brief-kitchenos-2025-12-12.md
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
workflowType: 'prd'
lastStep: 11
workflowComplete: true
completionDate: '2025-12-14'
project_name: 'kitchenos'
user_name: 'Harel'
date: '2025-12-13'
---

# Product Requirements Document - kitchenos

**Author:** Harel
**Date:** 2025-12-13

## Executive Summary

**KitchenOS** is a tablet-first Kitchen Display System designed to solve the operational chaos that traps successful home-based food businesses between staying small or drowning in manual workflows. Built specifically for Lacomida — a beloved Yemeni home kitchen — KitchenOS transforms Friday morning pandemonium into coordinated calm by replacing Yaron's Thursday night copy-paste-print-cut ritual with automated WhatsApp order capture, eliminating the 4-person orders team's manual phone-checking anxiety with real-time tablet coordination, and cutting customer checkout time from 5 minutes to 90 seconds.

The system addresses critical pain points: ~8% revenue leakage from no-shows and missed orders, chronic owner stress from operational uncertainty, and Friday morning chaos when half the packing team must abandon their stations for customer service. Success means zero missed orders, completion of all packing before the 9am rush, and Yaron sleeping Thursday night for the first time in years.

### What Makes This Special

**1. Built for the Kitchen, Not the Boardroom**
- Touch targets sized for flour-covered fingers (48px minimum)
- Offline-first architecture (mutations queue locally, sync when reconnected)
- Landscape tablet layout optimized for kitchen counter placement
- Sound notifications audible over kitchen noise
- Hebrew RTL interface — cultural respect baked in

**2. Preserving Humanity in Automation**
- Human-in-the-loop system lets owner apply context and grace to risk decisions
- "שמור לי" (reservation) feature honors trust-based cultural patterns
- Manual order entry for phone/walk-in customers alongside automation
- Owner can override any automated decision

**3. Coordinated Kitchen, Not Isolated Tablets**
- Supabase Realtime propagates status updates instantly across all devices
- Packing station updates → Pickup station sees "Ready" immediately
- Inventory depletion visible across all screens in real-time
- Kitchen operates as single coordinated organism

**4. Economic Access**
- Built on cost-efficient modern stack (Next.js, Supabase, Vercel)
- Hosting costs: ~$20-30/month (vs. $200+ for enterprise POS)
- Open source foundation — no vendor lock-in
- One-time development, perpetual value

**5. Opinionated Workflows That Just Work**
- Not a flexible "configure anything" platform requiring setup expertise
- Captures years of home kitchen operational wisdom
- Packing → Payment → Pickup flow is pre-designed
- Staff can start using it immediately without training complexity

## Project Classification

**Technical Type:** web_app (tablet-first progressive web app)
**Domain:** general (food service/restaurant operations)
**Complexity:** low (standard requirements with sophisticated real-time needs)
**Project Context:** Greenfield - new project

**Architecture Implications:**
- Multi-device web application: Tablet (primary operations), Desktop (owner management), TV (customer-facing read-only)
- Real-time synchronization via Supabase Realtime Channels
- Offline-first with optimistic updates and background sync
- Touch-optimized responsive design with 48px minimum touch targets
- Hebrew RTL support throughout the interface
- Integration points: n8n + Wassenger (WhatsApp), Meshulam (payments)

## Success Criteria

### User Success

**Yaron & Sharon (Owners) - "This Changed My Life"**

**1 Month Success Indicators:**
- ✅ Zero manual Thursday night ritual - No more copy-paste-print-cut workflow
- ✅ Zero missed orders - Every WhatsApp, email, and phone order captured
- ✅ 100% order visibility - Complete order queue visible from laptop at any time
- ✅ Stress reduction - Yaron sleeps Thursday night instead of worrying

**3 Month Success Indicators:**
- ✅ Orders completed before 9am rush hour (vs. current: still packing during rush)
- ✅ 4-person team handles peak without breaking
- ✅ Staff morale shift: "Fridays don't feel like chaos anymore"
- ✅ Revenue leakage drops from ~8% to <2%
- ✅ Time savings: 2-3 hours/week reclaimed

**6 Month Success Indicators:**
- ✅ Customer feedback: "Wow, it's faster and better now"
- ✅ Operational consistency without Yaron's constant intervention
- ✅ Business confidence: Focus on food quality instead of order chaos

**4-Person Orders Team - "Actually Manageable Fridays"**

**Core Success Outcome:**
All orders completed BEFORE rush hour begins (9am) - Currently still packing while customers line up.

**Success Indicators:**
- ✅ Zero surprises: No "customer shows up but we didn't fill their order" incidents
- ✅ At-glance status visibility via tablets and TV dashboard
- ✅ No manual phone-checking anxiety
- ✅ Smooth transition from packing to pickup/cashier mode (same tablets, different views)
- ✅ Week 1: Staff report "this is different but learnable" (adaptation phase)
- ✅ Month 1: Staff say "this is better than paper" without prompting
- ✅ End of Friday: "That was actually manageable"

**Customers - "They Actually Have My Order"**

**Core Success Outcome:**
Certainty replaces gambling - Customers know with confidence their order will be ready.

**Success Indicators:**
- ✅ Immediate WhatsApp confirmation with order number
- ✅ TV dashboard visibility: "Order #47 (David) - Ready! 🟢"
- ✅ Zero "we didn't see your order" apologies
- ✅ Checkout time: 5 minutes → 90 seconds

**Experience Transformation:**
- **Before**: "I hope they got my message... I hope I don't wait 20 minutes..."
- **After**: "I got confirmation #47. I see it on the board. I'm in and out in 90 seconds."

### Business Success

**3-Month Objectives:**

1. **Eliminate Revenue Leakage**
   - Current: ~8% revenue loss from no-shows, calculation errors, missed messages
   - Target: <2% revenue leakage
   - Impact: For ₪100k/month business = ₪6k/month recovered = ₪72k/year

2. **Reduce No-Show Rate**
   - Current: ~15% no-show rate on reserved orders
   - Target: <5% no-show rate
   - Impact: Less wasted food, better resource planning

3. **Operational Efficiency**
   - Current: 4-person team struggles during rush
   - Target: All orders completed before 9am rush hour
   - Impact: Team handles 2x volume without adding staff

4. **Customer Experience Improvement**
   - Current: 5-minute checkout, frequent "didn't see order" issues
   - Target: 90-second checkout, zero missed orders
   - Impact: Customer retention, positive word-of-mouth

**6-Month Objectives:**

5. **Owner Time Reclamation**
   - Target: 2-3 hours/week saved from manual order management
   - Impact: Yaron focuses on business growth and quality

6. **Scalability Foundation**
   - Target: System handles 50% more orders without additional staff
   - Impact: Business can grow without proportional cost increase

7. **Customer Perception Shift**
   - Target: Customers say "Lacomida got so organized" without prompting
   - Impact: Brand reputation upgrade from "home kitchen" to "professional operation"

### Technical Success

**Week 1 Technical Gates:**
- ✅ 100% WhatsApp order auto-capture rate
- ✅ System survives first Friday rush without crashes (validated via pre-launch testing)
- ✅ Real-time updates propagate with sub-second latency
- ✅ Offline resilience tested and verified (WiFi disconnect recovery works)
- ✅ TV dashboard displays correctly (customer-facing view works)

**Month 1 Technical Validation:**
- ✅ System runs Friday morning with minimal intervention
- ✅ All device types functioning (tablet, desktop, TV)
- ✅ Integration stability (n8n + Wassenger, Meshulam)
- ✅ Data consistency across real-time updates
- ✅ Event logging capturing KPI data accurately

**Month 3 Technical Maturity:**
- ✅ System uptime >99.5% during operating hours
- ✅ Real-time sync performance maintained under peak load
- ✅ Offline queue recovery working correctly
- ✅ Database performance supports 50% growth headroom

### Measurement Infrastructure

**How We Track Success Without Adding Overhead:**

**Event Logging System (Built into MVP):**
```sql
CREATE TABLE system_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb,
  order_id uuid REFERENCES orders(id)
);
```

**Tracked Events:**
- `order_created` (source: whatsapp/manual/email)
- `order_started` (staff began packing)
- `order_completed` (ready for pickup)
- `order_collected` (customer picked up)
- `order_no_show` (auto-marked after cutoff)
- `system_offline` / `system_online` (connectivity events)

**Weekly KPI Extraction (Yaron's Process):**
1. Export `system_events` table to CSV via Supabase dashboard
2. Simple spreadsheet calculations:
   - Orders completed before 9am = COUNT(order_completed WHERE time < 9:00)
   - Missed orders = Manual count (should be zero)
   - Average checkout time = Timestamp diff between order_collected events
3. Takes ~15 minutes weekly vs. 2+ hours manual tracking

**Qualitative Measurement:**
- Week 1-4: End-of-Friday 2-minute verbal check-in with staff ("What worked? What didn't?")
- Captures adaptation challenges that quantitative KPIs miss
- Validates assumptions before Month 1 go/no-go decision

### Measurable Outcomes

**Operational KPIs (Tracked Weekly):**

| KPI | Current Baseline | Week 1 Target | Month 1 Target | Month 3 Target |
|-----|------------------|---------------|----------------|----------------|
| Orders completed before 9am rush | 60% | 80% | 95% | 100% |
| Missed orders per week | 2-3 | 1 | 0 | 0 |
| Average checkout time | 5 min | 3 min | 2 min | 90 sec |
| Manual phone checks per Friday | 20+ | 10 | 5 | 0 |
| Yaron's Thursday night ritual time | 1-2 hours | 30 min | 15 min | 0 min |

**Financial KPIs (Tracked Monthly):**

| KPI | Current Baseline | Month 1 Target | Month 3 Target | Month 6 Target |
|-----|------------------|----------------|----------------|----------------|
| Revenue leakage % | ~8% | 5% | 2% | <2% |
| No-show rate | ~15% | 10% | 5% | <5% |
| Unpaid invoices | ₪3-5k/month | ₪2k | ₪500 | <₪300 |
| Revenue recovered | - | ₪3k | ₪6k | ₪6k+ |

**Customer Experience KPIs (Tracked Monthly):**

| KPI | Current Baseline | Month 1 Target | Month 3 Target | Month 6 Target |
|-----|------------------|----------------|----------------|----------------|
| Order confirmation rate | 0% (manual) | 100% (automated) | 100% | 100% |
| "Didn't see order" incidents | 2-3/week | 1/week | 0/month | 0 |
| Customer complaints | 5-8/month | 3/month | 1/month | 0/month |
| Positive feedback | Rare | Occasional | Weekly | Multiple/week |

**Leading Indicators (Early Warning System):**

**Week 1:**
- All WhatsApp orders auto-captured (100% success rate)
- Yaron successfully enters email/phone orders via desktop
- Staff complete training in <15 minutes (intuitive interface)
- Zero system crashes during first Friday rush
- Pre-launch validation suite passed (load test + offline test + E2E test)

**Month 1 Momentum:**
- Staff proactively use tablets without prompting
- Zero requests to "go back to paper slips"
- At least one "this is better" comment from customer
- Staff feedback: "It's easier now" (even if absolute speed not yet faster)

**Month 3 Sustainability:**
- System runs with minimal Yaron intervention
- Staff can onboard new team member in <30 minutes
- No rollback requests
- Yaron considers expanding capacity (confidence signal)

## Product Scope

### MVP - Minimum Viable Product (Week 1)

**Core Features (Must Have):**

1. **WhatsApp Order Automation**
   - n8n + Wassenger integration for automatic order capture
   - Instant customer confirmation with order number
   - Eliminates Thursday night manual ritual

2. **Orders Dashboard (Tablet - Packing View)**
   - View all orders in queue
   - Filter by status, date, pickup time
   - Tap to start packing
   - Real-time updates across devices

3. **Weighing & Packing Screen (Tablet)**
   - Display order details
   - Enter actual weights
   - Automatic price calculation
   - Send Meshulam payment link via WhatsApp
   - Mark order as "Ready for Pickup"

4. **Inventory Management (Tablet)**
   - Set daily prep quantities
   - Real-time available vs. allocated stock tracking
   - Low stock warnings
   - Prevent overselling

5. **Payment & Pickup Queue (Tablet - Cashier View)**
   - View orders ready for collection
   - Search by customer name or order number
   - Display payment status
   - Mark orders as collected
   - Auto-mark no-show after cutoff

6. **Desktop/Laptop Interface (Manual Order Entry)**
   - Yaron enters email and phone orders
   - Review and manage order queue
   - Same order creation flow as WhatsApp

7. **Public TV Dashboard (Customer-Facing, Read-Only)**
   - Large display showing real-time order status
   - Format: "Order #47 (David) - Ready! 🟢"
   - Color-coded: 🟡 Being Prepared | 🟢 Ready
   - Sanitized data (no prices, no full names)

8. **Offline Resilience**
   - Tablets queue mutations locally when WiFi drops
   - Auto-sync when connection restored
   - Connection status indicator
   - No Friday rush breakdown if WiFi hiccups

9. **Event Logging Infrastructure**
   - Lightweight event tracking for KPI measurement
   - Simple Supabase table capturing key order lifecycle events
   - Enables weekly metrics extraction without overhead
   - ~2 hours dev time, eliminates manual tracking burden

10. **Pre-Launch Validation Suite**
   - Load test: Simulate 25-30 concurrent orders
   - Offline test: Verify queue functionality with WiFi disconnect
   - E2E happy path: WhatsApp → Tablet → Payment → Pickup automated test
   - Ensures "survives Friday rush" is engineering, not luck

**MVP Success Criteria (Week 1):**
- ✅ WhatsApp orders auto-flow into system (100% capture rate)
- ✅ 4-person team uses tablets without reverting to paper
- ✅ Yaron enters email/phone orders via desktop successfully
- ✅ System survives first Friday rush without crashes (pre-validated)
- ✅ At least 80% of orders completed before 9am rush (vs. current 60%)
- ✅ Staff feedback: "It's different but we can work with this"

**Month 1 Go/No-Go Decision:**
- ✅ Zero "go back to paper slips" requests
- ✅ Missed orders: 0 per week (vs. current 2-3)
- ✅ Yaron's Thursday night ritual eliminated (0 minutes vs. 1-2 hours)
- ✅ Customer feedback neutral or positive
- ✅ Staff morale improved ("this is better" comments)

### Growth Features (Post-MVP - Month 2-3)

**Deferred to Phase 2:**

1. **Risk Approvals / HITL (Human-in-the-Loop)**
   - Why defer: Need 1-2 months of no-show data to build risk scoring model
   - When: Month 2-3 after baseline customer behavior data collected
   - Workaround: Yaron manually reviews new/suspicious customers

2. **Reserved Items (שמור לי) Management**
   - Why defer: Nice-to-have, not critical for core problem
   - When: Phase 2 after core order flow stable
   - Workaround: Track in notes field or separate spreadsheet

3. **Menu Management Screen (Admin)**
   - Why defer: Can manage via direct database updates initially
   - When: Month 3+ when menu changes become frequent
   - Workaround: Update via Supabase dashboard

4. **Analytics Dashboard**
   - Why defer: Need historical data first
   - When: Month 6+ once meaningful data exists
   - Workaround: Export data manually via event logs

5. **Customer Details / History View**
   - Why defer: Can access via database queries initially
   - When: Phase 2, alongside HITL system
   - Workaround: Simple search in orders table

6. **Post-Pickup Customer Feedback**
   - Automated WhatsApp: "How was your experience? 👍 Great / 👎 Issue / 💬 Comment"
   - Sent 4 hours after pickup
   - Tracks sentiment, catches problems early
   - Low-cost, high-signal customer satisfaction metric

7. **Weekly Staff Feedback Protocol**
   - Week 1-4: End-of-Friday 2-minute check-in
   - Captures qualitative adaptation signals
   - "What worked? What didn't?"
   - Validates quantitative KPI assumptions

### Vision (Future - 12-24 Months)

**Platform for Home Food Businesses:**

1. **Multi-Tenant SaaS Platform**
   - Other home kitchens can sign up
   - Customizable for different cuisines
   - Multi-language support (Hebrew, Arabic, English, Russian)
   - Pricing: $30-50/month subscription

2. **Advanced Features**
   - AI-powered demand forecasting
   - Smart inventory suggestions
   - Customer loyalty programs
   - Multi-channel ordering (Instagram DM, Facebook Messenger)
   - Delivery integration

3. **Ecosystem Expansion**
   - Supplier network integration
   - Financial dashboard with tax-ready reports
   - Marketing automation
   - Community marketplace directory

4. **Market Expansion**
   - Israeli home food businesses (dozens per city)
   - US immigrant communities
   - Target: 100+ home kitchens within 2 years

## Strategic Scoping & Risk Mitigation

### MVP Philosophy

**Approach: Problem-Solving MVP**

KitchenOS follows a lean problem-solving MVP strategy focused on eliminating Yaron's Thursday night manual ritual and enabling the 4-person orders team to complete all packing before the Friday 9am rush. This approach prioritizes:

1. **Core Problem Resolution**: WhatsApp order automation replaces 2-hour manual copy-paste workflow
2. **Essential User Experience**: 80-year-old Malka can use tablets with <15 minute learning curve
3. **Validated Learning Gates**: Week 1 → Month 1 go/no-go decision based on quantifiable success metrics

**Why This Philosophy:**
- **Single location validation**: Prove value at La Comida before scaling
- **Operational constraints**: Solo developer (Harel), budget-conscious home business
- **Clear success metrics**: Yaron sleeping Thursday night = problem solved

### Resource Requirements

**MVP Development Team:**
- **Developer**: 1 full-stack (Harel) - Next.js + Supabase + TypeScript expertise
- **Domain Expert**: Yaron (owner) - 2-3 hours/week for requirements validation and testing
- **User Testers**: La Comida staff (Malka, Guy, Rony, rotating helper) - Friday pilot testing

**Development Timeline:**
- **Week 1-2**: Core infrastructure (Next.js setup, Supabase schema, authentication)
- **Week 3-4**: WhatsApp integration (n8n + Wassenger automation)
- **Week 5-6**: Tablet interfaces (order list, packing workflow, inventory)
- **Week 7**: Desktop interface (manual order entry for Yaron)
- **Week 8**: TV dashboard (customer-facing read-only display)
- **Week 9**: Offline resilience (IndexedDB queue, conflict resolution)
- **Week 10**: Pre-launch validation suite (load testing, E2E testing)
- **Week 11**: Pilot deployment and monitoring
- **Week 12+**: Post-launch iteration based on Week 1-4 feedback

**Total Estimated Effort**: ~10-12 weeks solo development (part-time) or 6-8 weeks (full-time focus)

**Infrastructure Costs (Monthly):**
- Vercel hosting: $0 (Hobby tier sufficient for MVP)
- Supabase: $0-25 (Free tier covers 7 concurrent connections, paid if growth needed)
- n8n: $0 (self-hosted) or ~$20 (n8n Cloud starter)
- Wassenger WhatsApp API: ~$10-15/month
- **Total**: ~$10-40/month (minimal operational overhead)

### Risk Mitigation Strategy

**Technical Risks:**

**Risk 1: Real-Time Sync Fails During Friday Rush**
- **Probability**: Medium (WiFi instability, Supabase outage)
- **Impact**: High (kitchen coordination breaks down)
- **Mitigation**:
  - Offline-first architecture with IndexedDB queue (graceful degradation)
  - 5-second polling fallback when WebSocket fails
  - Visual connection status indicator (🟢/🟡/🔴)
  - Pre-launch load testing with 7 concurrent devices
- **Contingency**: Yaron manually checks all tablets if "🔴 Offline" persists >5 minutes

**Risk 2: 80-Year-Old Malka Can't Adapt to Tablets**
- **Probability**: Low-Medium (elderly tech adoption challenge)
- **Impact**: High (primary staff member can't use system = MVP failure)
- **Mitigation**:
  - 48px touch targets (elderly-accessible design)
  - Week 1-4 gradual adoption with paper backup available
  - Rony/Guy as in-person coaches during pilot
  - Undo capability for destructive actions (error forgiveness)
- **Contingency**: If Malka struggles after Week 2, extend pilot period with hybrid paper/digital workflow

**Risk 3: WhatsApp API Rate Limits or Message Parsing Failures**
- **Probability**: Medium (natural language order variations)
- **Impact**: Medium (missed orders, manual fallback needed)
- **Mitigation**:
  - n8n workflow testing with 50+ sample WhatsApp messages
  - Yaron desktop interface for manual order entry (fallback path)
  - Week 1 double-check: Yaron verifies WhatsApp auto-capture worked
- **Contingency**: If auto-capture <95% accurate, add human-in-the-loop confirmation step

**Market Risks:**

**Risk 4: Staff Resistance to Change ("Paper Was Fine")**
- **Probability**: Low (staff already experiencing pain of paper chaos)
- **Impact**: Medium (slow adoption, missed efficiency gains)
- **Mitigation**:
  - Involve staff in pilot testing (Week 1-4 feedback loop)
  - Keep paper backup available during transition
  - Celebrate early wins ("We finished before 9am for the first time!")
  - Month 1 go/no-go decision based on staff feedback
- **Contingency**: If majority of staff request rollback after Month 1, reassess scope

**Risk 5: MVP Scope Creep During Development**
- **Probability**: High (natural tendency to "just add one more thing")
- **Impact**: Medium (delays launch, increases complexity)
- **Mitigation**:
  - Strict MVP feature list (10 core features, no additions without explicit re-scoping)
  - Growth Features backlog (deferred to Month 2-3)
  - Week 11 launch deadline (forces ruthless prioritization)
- **Contingency**: If timeline slips >2 weeks, cut non-essential features (e.g., TV dashboard can be added post-launch)

**Resource Risks:**

**Risk 6: Solo Developer Burnout or Unavailability**
- **Probability**: Low-Medium (part-time development over 10-12 weeks)
- **Impact**: High (project stalls completely)
- **Mitigation**:
  - Part-time sustainable pace (avoid 60-hour weeks)
  - Clear documentation for future handoff if needed
  - Architecture document already created (knowledge transfer ready)
- **Contingency**: If Harel unavailable >2 weeks, pause project (no rush to launch, validated learning approach)

**Risk 7: Budget Overruns (Infrastructure Costs)**
- **Probability**: Low (modern stack is cost-efficient)
- **Impact**: Low (~$40/month is sustainable for La Comida)
- **Mitigation**:
  - Start with free tiers (Vercel Hobby, Supabase Free)
  - Only upgrade if hitting limits (reactive cost management)
  - Self-host n8n instead of cloud ($0 vs $20/month)
- **Contingency**: If costs exceed $100/month, optimize (e.g., switch to cheaper WhatsApp API provider)

### Scope Flexibility & Contingency Planning

**Minimum Viable Scope (If Resources Constrained):**

If timeline or resources become critically constrained, the absolute minimum scope is:

1. **WhatsApp Order Automation** - Core value (eliminates Thursday night ritual)
2. **Tablet Packing View** - Essential for kitchen coordination
3. **Desktop Manual Entry** - Fallback for email/phone orders

**Can Defer to Post-Launch:**
- TV dashboard (customers can check with staff instead)
- Offline resilience (rely on stable WiFi, manual recovery if needed)
- Event logging infrastructure (manual KPI tracking for Month 1)

**Launch Readiness Gate:**

KitchenOS is ready to pilot when:
- ✅ 100% WhatsApp auto-capture rate in staging (tested with 50+ sample messages)
- ✅ Pre-launch validation suite passed (load test, offline test, E2E test)
- ✅ Yaron successfully enters 10 test orders via desktop
- ✅ Malka completes 5 test orders on tablet without help
- ✅ Real-time sync works across 7 devices with <1 second latency

**Month 1 Go/No-Go Decision Criteria:**

After 4 Fridays of pilot usage, evaluate:
- ✅ Zero "go back to paper slips" requests from staff
- ✅ Missed orders: 0 per week (vs. current 2-3)
- ✅ Orders completed before 9am: >95% (vs. current 60%)
- ✅ Yaron's Thursday night time: <15 minutes (vs. current 1-2 hours)
- ✅ Staff feedback: Majority say "this is better" or "this is easier"

**If Go/No-Go Fails**: Analyze root cause (technical issue vs UX issue vs workflow mismatch), iterate for 2 more weeks, re-evaluate. Maximum 2 iteration cycles before considering pivot or shelve.

## User Journey Mapping

### Journey 1: Yaron - Reclaiming Thursday Nights

**Thursday Night, 11:47 PM - Before KitchenOS**

Yaron sits at his kitchen table with three devices open: phone with WhatsApp, email on his laptop, and a notebook for phone orders. His wife Sharon is already asleep. He's been at this for 90 minutes, copying order messages one by one into Excel, calculating weights, printing labels, cutting them with scissors. His eyes burn. Tomorrow starts at 5am.

"Order from Michal: 2 kubana, 1 jachnun, 1 malawach..." he types. Copy. Paste. Another message. Copy. Paste. His neighbor David messaged at 10:32 PM. Did he copy that one? He scrolls back through 47 WhatsApp messages. Found it. Already done.

Three more orders in email. Copy. Paste. Calculate. Print. Cut. Tape.

12:31 AM. He's too tired to verify if he got everything. Tomorrow he'll find out if he missed any. Tomorrow morning when a customer shows up and says "I sent you a WhatsApp..." and he has to say "I'm so sorry, I didn't see it."

He goes to bed worried.

**Thursday Night, 11:47 PM - After KitchenOS**

Yaron opens his laptop. The KitchenOS orders dashboard shows 42 orders - all automatically captured from WhatsApp throughout the day. Email orders? He added those this afternoon in 3 minutes each. Phone orders? Entered them during the calls.

He reviews the queue. Everything looks right. The system calculated the total prep needed: 89 kubanot, 34 jachnun, 27 malawach. Inventory is set. The team will see exactly what to pack tomorrow.

11:52 PM. He closes the laptop.

He goes to bed and actually sleeps.

**Friday Morning, 8:47 AM - The Moment of Truth**

The TV dashboard shows orders turning green. "#23 (Rachel) - Ready! 🟢" "#31 (Moshe) - Ready! 🟢"

Malka at the packing station taps "Complete" on order #28. Instantly, Rony at the cashier tablet sees it appear in the pickup queue. Guy is already helping customer #25 checkout. The rotating helper is watching and learning - it's their first Friday, but the system is so simple they're already helping.

No one is checking their phone. No one is scrambling. No one is saying "wait, did we get an order from...?"

8:59 AM. The last order for the 9am rush goes into the ready queue.

Yaron watches from his office laptop. They did it. Everything packed before customers arrive.

For the first time in 3 years, Friday morning feels... calm.

**The Transformation:**
- **Before:** 1-2 hours of Thursday night anxiety, 2-3 missed orders/week, constant worry
- **After:** 5 minutes Thursday night review, zero missed orders, sleep

**What Yaron Needs:**
- Desktop/laptop interface optimized for keyboard + mouse order entry
- Complete visibility into order queue from any device
- Confidence that the system captured every order automatically
- Ability to review and verify before going to bed

---

### Journey 2: Malka - From Chaos to Calm at 80

**Week 1, Friday Morning, 7:12 AM - The Adaptation Struggle**

Malka stands at the packing station with a tablet in front of her. She's 80 years old. She helped found Lacomida. She's packed thousands of orders.

But this screen is new.

"Malka, just tap this order to start," Rony says, pointing at the tablet.

Malka taps. Nothing happens. She tapped the wrong spot.

"Here, Savta, tap here," Rony guides her finger.

The order opens. "Order #14 - Sarah: 3 Kubana, 2 Jachnun"

"Okay, I see it. But where's the paper slip?" Malka asks.

"There's no paper slip anymore, Savta. It's all here on the screen."

Malka packs the order. She's done this a thousand times - her hands remember the routine even if her eyes struggle with the screen. She weighs the kubana. Rony helps her enter the weights into the tablet.

"Now tap 'Complete,'" Rony says.

Malka taps. The order disappears.

"Wait, where did it go? Did I lose it?" Panic.

"No, no, Savta, it's perfect! Look at the TV - it's ready now!"

The TV shows: "Order #14 (Sarah) - Ready! 🟢"

"Oh..." Malka isn't sure if this is better or worse than paper slips. But Yaron says this is what they're doing now.

**Week 4, Friday Morning, 8:23 AM - Finding the Rhythm**

Malka taps order #31 without hesitation. The touch targets are large - 48px minimum - designed for her flour-covered fingers. The text is big. Hebrew flows right-to-left naturally.

She reads: "Order #31 - Moshe: 5 Kubana, 1 Malawach"

She packs. She weighs. She enters the weights - she knows where the number buttons are now. She taps "Send Payment Link." The system sends it automatically to Moshe via WhatsApp.

She taps "Complete."

The order turns green on the TV. Rony at the cashier sees it appear immediately.

No paper. No confusion. No asking "which order is this again?"

Guy walks by. "Savta, you're flying today!"

Malka smiles. She's been doing this for 3 years, but now... now it feels organized. She doesn't have to squint at Yaron's handwritten notes. She doesn't have to ask "did someone already pack this?" The tablet shows her exactly what needs to be done.

At 8:47 AM, she finishes her last order before the rush. She's never finished this early.

"This is actually easier," she says to Rony.

**The Transformation:**
- **Before:** Paper slips, handwritten notes, constant questions, chaos
- **Week 1:** Anxiety, confusion, "where did the order go?"
- **Week 4:** Confidence, rhythm, "this is actually easier"

**What Malka Needs (Critical Accessibility Requirements):**
- 48px minimum touch targets (elderly-accessible)
- Large, high-contrast text (readability for 80-year-old eyes)
- Hebrew RTL interface (cultural familiarity)
- Extremely simple workflow: Tap → Pack → Weigh → Complete
- Zero configuration needed (she just uses it, no setup)
- Forgiving interface (tapping wrong area doesn't break anything)
- Immediate visual feedback ("Complete" makes it appear on TV - confirmation)

---

### Journey 3: David - From Gambling to Certainty

**Thursday Evening, 8:43 PM - Before KitchenOS**

David sends a WhatsApp message to Lacomida:

"Hi Yaron! For tomorrow: 3 kubana, 2 jachnun, 1 malawach. Pickup around 10am. Thanks!"

He waits. No response.

Did Yaron see it? Is 8:43 PM too late? Should he call tomorrow morning to confirm?

He goes to sleep uncertain.

**Friday Morning, 9:47 AM - The Gamble**

David arrives at Lacomida. There's a line - 6 people waiting. He can see Yaron and the team rushing around inside.

He waits. 5 minutes. 8 minutes. 12 minutes.

Finally, it's his turn.

"Hi! I'm David, I sent a WhatsApp last night..."

Yaron checks his phone. Scrolls through 50+ messages. "Ah, yes, I see it. Let me check if it's ready..."

He walks to the kitchen. Checks the packing area. Comes back.

"Actually, we're still packing it. Can you wait 5 more minutes?"

David waits. 15 minutes total. He had plans at 10:15. Now he's late.

**Thursday Evening, 8:43 PM - After KitchenOS**

David sends a WhatsApp message to Lacomida:

"Hi! For tomorrow: 3 kubana, 2 jachnun, 1 malawach. Pickup around 10am. Thanks!"

*Buzz.* Immediate response:

"✅ Order confirmed! Order #37 (David)
3 Kubana
2 Jachnun
1 Malawach

Pickup: Friday 10:00 AM
You'll receive payment link when ready.

- KitchenOS"

David smiles. They got it. He has an order number. He goes to sleep certain.

**Friday Morning, 9:52 AM - The Certainty**

David walks into Lacomida. He glances at the TV dashboard on the wall:

"Order #37 (David) - Ready! 🟢"

No line at the cashier. Rony looks up from the tablet.

"Hi! David, order 37?"

"Yes!"

She taps the tablet. "₪127. Here's the payment link." She shows him the Meshulam payment screen. He taps his card. Done.

She hands him his order. "Thank you!"

90 seconds. In and out.

David walks to his car. "They actually got organized," he thinks. "This is way better."

**The Transformation:**
- **Before:** Uncertainty, gambling on whether order was seen, 15-minute wait, frequent "didn't see your order" apologies
- **After:** Instant confirmation, order number, TV dashboard visibility, 90-second checkout, certainty

**What David Needs:**
- Instant WhatsApp confirmation when he orders (automated)
- Order number for reference (#37)
- "Ready for pickup" notification (WhatsApp - Phase 2 Growth Feature)
- TV dashboard showing his order status when he arrives
- Fast checkout via payment link

---

### Journey 4: Harel - From Firefighting to Proactive Monitoring

**Week -1 (Deployment Week), Tuesday Evening, 9:34 PM**

Harel sits at his laptop with 4 terminal windows open. He's deploying KitchenOS to production.

```bash
git push origin main
→ Vercel deployment triggered
→ Build successful ✓
→ Production: kitchenos.vercel.app
```

He opens the Supabase dashboard. Database migrations run. Tables created. Policies configured. n8n workflow connected to Wassenger. Meshulam API keys set.

He sends a test WhatsApp to the Lacomida number:

"Test order: 1 kubana, pickup 10am"

*Buzz.* His phone vibrates with the auto-confirmation:

"✅ Order confirmed! Order #1 (Test)..."

It works.

He opens the tablet interface on his iPad. Logs in. The test order appears in the queue. He taps it. Enters weights. Sends payment link. Marks complete.

The TV dashboard updates: "Order #1 (Test) - Ready! 🟢"

It all works.

**Week 1, Friday Morning, 6:47 AM - Watching the First Rush**

Harel wakes up early. He opens his laptop. KitchenOS dashboard shows 38 orders in the queue.

He's watching the logs in real-time:

```
2025-12-13 06:48:12 | order_started | Order #4
2025-12-13 06:49:03 | order_completed | Order #4
2025-12-13 06:49:15 | order_collected | Order #4
```

The system is working. Orders flowing through: Created → Started → Completed → Collected.

No errors. No crashes.

Supabase dashboard shows real-time connections: 4 tablets, 1 desktop, 1 TV. All syncing perfectly.

8:57 AM. The last order before rush hour is marked "Ready."

They did it.

**Month 3, Friday Morning, 7:12 AM - Proactive Monitoring**

Harel doesn't wake up early anymore. The system just works.

He opens his laptop at 9am - after the rush. Event logs show:

```
Total orders today: 42
Orders completed before 9am: 42 (100%)
Average packing time: 3m 47s
System uptime: 100%
Offline events: 0
```

Perfect.

He exports the weekly CSV for Yaron. Takes 2 minutes.

He's no longer firefighting. He's monitoring a system that runs itself.

Next week, he'll add a feature from the Growth backlog: Risk Approvals for new customers. But there's no rush. The core system is stable.

**The Transformation:**
- **Before (Week -1):** Anxious deployment, testing every edge case, hoping it survives Friday
- **Week 1:** Watching logs in real-time, nervous monitoring, ready to fix issues
- **Month 3:** Proactive monitoring, stable system, confidence to add features

**What Harel Needs:**
- Reliable deployment pipeline (Vercel + Supabase)
- Real-time monitoring (event logs, Supabase dashboard)
- Error tracking (catches issues before users report them)
- Performance metrics (knows if system can handle growth)
- CSV export for KPI reporting (simple, no complex dashboards needed)

---

### Journey 5: New Helper's First Friday - Zero-Configuration Onboarding

**Friday Morning, 6:52 AM - The New Helper Arrives**

It's Aviv's first Friday at Lacomida. He's the rotating 4th team member this week. Next week it'll be someone else.

Yaron greets him: "Aviv, welcome! You'll be helping with packing today. Malka will show you."

Malka hands him a tablet. "Here, just watch me first."

She taps an order. The screen shows:

"Order #7 - Rachel: 4 Kubana, 1 Jachnun"

"See? We pack what's on the screen. Then we weigh it. Then tap 'Complete.' That's it."

Aviv watches. She packs. Weighs. Taps a few buttons. The order turns green on the TV.

"Okay, try the next one," Malka says.

Aviv taps order #8. It opens. "Order #8 - Moshe: 2 Kubana, 2 Malawach"

He packs. He's never done this before, but the tablet shows exactly what to do:

→ "Kubana: 2 ordered"
→ "Enter weight: ___ grams"
→ Tap "Send Payment Link"
→ Tap "Complete"

He follows the steps. The order turns green on the TV.

"Perfect!" Malka says. "You got it."

**7:23 AM - Working Independently**

Aviv is on his 5th order. No one is watching him anymore. He's part of the rhythm.

Order #15 - David: 3 Kubana, 1 Malawach

Pack. Weigh. Enter weights. Complete. Green on TV.

He doesn't need to ask "which order should I do next?" - the tablet shows the queue.

He doesn't need to ask "did someone already pack this?" - the system tracks status.

He doesn't need a user account. He doesn't need preferences. He doesn't need training videos.

He just picked up the tablet and started working.

**8:54 AM - End of Shift**

Aviv has packed 14 orders. Zero mistakes. Zero confusion.

Yaron walks by. "How was it?"

"Honestly? Way easier than I expected. The tablet just tells you what to do."

**Next Friday - Different Helper**

Aviv isn't here. It's Noa's turn.

Malka hands her the tablet. "Here, just watch me first..."

The cycle repeats. Every week. Zero configuration. Zero accounts. Zero complexity.

**The Transformation:**
- **Before (Paper System):** New helpers needed 1+ hour training, frequent questions, mistakes
- **After (KitchenOS):** <15 minute onboarding, self-evident workflow, confidence within 30 minutes

**What the Rotating Helper Needs:**
- Zero-configuration system (no user accounts, no preferences to set)
- Self-evident workflow (tablet guides the process)
- Large touch targets (new users aren't precise yet)
- Immediate feedback (Complete → TV shows green - they know they did it right)
- Forgiving interface (can't break anything by accident)
- Malka as living documentation (80-year-old can teach = anyone can teach)

---

## Journey Requirements Summary

**What These Narratives Reveal About Required Capabilities:**

### Desktop/Laptop Interface (Yaron's Thursday Nights)
- Keyboard-optimized manual order entry
- Complete order queue visibility
- Email order input workflow
- Review and verify before going to bed

### Elderly-Accessible Tablet UI (Malka at 80)
- 48px minimum touch targets
- High-contrast, large text
- Hebrew RTL interface
- Extremely simple workflow: Tap → Pack → Weigh → Complete
- Zero configuration needed
- Forgiving design (wrong taps don't break the system)
- Immediate visual feedback (TV confirmation)

### WhatsApp Integration & Customer Confirmation (David's Certainty)
- Instant auto-confirmation with order number
- "Order confirmed" message when customer sends WhatsApp
- Payment link delivery via WhatsApp
- Optional: "Ready for pickup" notification (Phase 2)

### TV Dashboard (Customer-Facing Visibility)
- Large, real-time order status display
- Color-coded status: 🟡 Being Prepared | 🟢 Ready
- Format: "Order #37 (David) - Ready! 🟢"
- Sanitized data (no prices, no full names)

### Real-Time Multi-Device Coordination
- Packing station → Cashier station instant sync
- All devices see the same truth at the same time
- Offline queue for WiFi hiccups
- Connection status indicator

### Deployment & Monitoring Tools (Harel's Confidence)
- Reliable deployment pipeline (Vercel + Supabase)
- Event logging for KPI tracking
- CSV export for weekly metrics
- Error monitoring (Sentry or similar)
- Performance metrics dashboard

### Zero-Configuration Onboarding (Rotating Helper)
- No user accounts needed
- No preferences to configure
- Self-evident workflow (tablet guides the process)
- <15 minute learning curve
- New person every week = weekly validation test

**Critical Cross-Cutting Requirements:**
- 80-year-old Malka can use it = accessibility benchmark
- Rotating helper learns in <15 minutes = zero-configuration validation
- Yaron sleeps Thursday night = automation success
- David gets instant confirmation = customer experience win
- System survives Friday rush = technical reliability gate

## Web App Technical Requirements

### Technical Architecture Overview

KitchenOS is a **Next.js 16 App Router** progressive web application optimized for three device profiles: tablet (primary operations), desktop (owner management + admin support), and TV (customer-facing read-only display). The architecture leverages React Server Components for initial page loads with aggressive client-side interactivity for real-time kitchen operations.

**Architecture Decision:**
- **Hybrid App Router approach**: Server Components for initial shell + data loading, Client Components for interactive features
- **Single deployment, route-based device adaptation**: All device types served from one Next.js deployment with responsive/adaptive UI based on viewport and user agent
- **Why**: Simplifies deployment, enables code sharing, maintains single source of truth, reduces maintenance overhead

**Component Architecture Boundaries:**
- **Server Components**: Static shell, layout, initial data fetching
- **Client Components**: Order list (real-time updates), forms (validation), interactive controls
- **Hybrid approach**: Server Components reduce JavaScript bundle size, Client Components enable instant interactivity

### Browser Support Matrix

**Tablets (Primary Interface):**
- **iPad**: Safari 15+ (iOS 15+) - Verified: Current La Comida iPads run iOS 16+
- **Android Tablets**: Chrome 90+ (Android 10+)
- **Support Level**: Full feature parity, touch-optimized
- **Testing Priority**: High (primary user interface)

**Desktop (Owner + Admin Interface):**
- **Modern browsers only**: Chrome 90+, Firefox 88+, Safari 15+, Edge 90+
- **No legacy browser support**: IE11 explicitly not supported
- **Support Level**: Full keyboard navigation, mouse-optimized workflows
- **Testing Priority**: Medium (secondary interface, critical for Yaron's workflow)

**TV Dashboard (Customer-Facing Display):**
- **Chromium-based browser in kiosk mode** or PC with HDMI connection
- **Chrome 90+ in fullscreen/kiosk mode**
- **Support Level**: Read-only display, auto-refresh, no interaction needed
- **Testing Priority**: Low (simple display logic, no user input)

**Browser Feature Requirements:**
- WebSocket support (Supabase Realtime)
- IndexedDB (offline queue storage)
- Service Worker support (PWA capabilities)
- CSS Grid & Flexbox (layout)
- ES2020+ JavaScript features

**Testing Strategy:**
- **Cross-browser testing**: Manual acceptance testing (budget constraint - 5 browsers = expensive CI)
- **Primary focus**: iPad Safari + Chrome desktop (covers 90% of usage)
- **Pre-release checklist**: Test all 5 browsers before major releases

### Responsive Design Strategy

**Device-Specific Layouts:**

**Tablet Layout (768px - 1024px landscape):**
- **Primary view**: Full-screen order cards, 48px minimum touch targets
- **Orientation**: Landscape-first (kitchen counter placement)
- **Layout pattern**: Single-column card stack with large tap areas
- **Typography**: 18px base font size (readability for Malka at 80)
- **Navigation**: Bottom tab bar (Packing / Pickup / Inventory)

**Desktop Layout (1280px+):**
- **Primary view**: Multi-column dashboard (order queue + details side-by-side)
- **Interaction**: Keyboard shortcuts for rapid order entry
- **Layout pattern**: Sidebar navigation + main content area
- **Typography**: 16px base font size
- **Navigation**: Persistent left sidebar

**TV Display Layout (1920px+ fullscreen):**
- **Primary view**: Large-text order status grid (3-4 columns)
- **Auto-refresh**: 5-second polling for order status updates
- **Layout pattern**: Grid of order cards, color-coded by status
- **Typography**: 40-48px extra-large text for critical elements (order numbers, customer names) - visible from 3-5 meters
- **Navigation**: None (read-only)

**RTL (Right-to-Left) Support:**
- **Hebrew text rendering**: All UI strings in Hebrew
- **Mirrored layouts**: UI chrome (navigation, tabs, sidebar) mirrors for RTL
- **Workflow direction**: Order progression stays left-to-right (Packing → Ready → Complete) even in Hebrew (sequential process mental model)
- **Number formatting**: ₪127 (Hebrew shekel symbol)
- **Date/time formatting**: Hebrew locale (DD/MM/YYYY)
- **Product names**: Mixed language (Hebrew/English/Arabic as entered by Yaron) - no translation needed

### Performance Targets

**Critical Performance Metrics:**

| Metric | Target | Acceptable Degraded | Measurement | Priority |
|--------|--------|---------------------|-------------|----------|
| **Time to Interactive (TTI)** | <2 seconds | <3 seconds | Lighthouse | High |
| **First Contentful Paint (FCP)** | <1 second | <1.5 seconds | Lighthouse | High |
| **Real-time update latency** | <500ms | <1 second | Custom monitoring | Critical |
| **Offline → Online sync time** | <3 seconds | <5 seconds | Custom monitoring | High |
| **Order list render (50 orders)** | <100ms | <200ms | React Profiler | Medium |
| **Touch response time** | <100ms | <150ms | Custom monitoring | Critical |

**Performance Budget:**
- **JavaScript bundle**: <300KB gzipped (main bundle)
- **Initial page load**: <1MB total transfer
- **Route transition**: <200ms (client-side navigation)
- **Real-time message processing**: <50ms (Supabase → UI update)

**Optimization Strategies:**
- Server Components for initial data loading (reduce client JS)
- Route-based code splitting (Next.js automatic)
- Image optimization via `next/image` (menu items, if added later)
- IndexedDB caching for offline-first architecture
- Debounced real-time updates (batch UI updates every 100ms)

**User Success Metrics (Complementary to Technical Metrics):**
- **Task completion time**: <5 seconds (Malka finding order card → tapping "Complete")
- **Error rate**: <5% (wrong button taps, accidental actions)
- **First-use success rate**: 80% (new helper can complete task without help)

**Load Testing Plan:**
- **Peak load scenario**: 7 concurrent devices during Friday rush (6am-11am)
- **Order creation rate**: 1 order every 30 seconds (simulates real Friday traffic)
- **Acceptance criteria**: Latency remains <1 second under peak load (degraded but usable)

### Real-Time Architecture

**Supabase Realtime Configuration:**

**Connection Profile:**
- **Max concurrent connections**: 7 devices (4 tablets + 2 desktops + 1 TV)
- **Expected concurrent peak**: 6-7 during Friday rush (6am-11am)
- **Channel structure**: Single `orders` channel for all order updates
- **Message types**: `order_created`, `order_updated`, `order_completed`, `order_collected`

**Latency Requirements:**
- **Target latency**: <500ms (tap "Complete" → other devices see update)
- **Acceptable latency**: <1 second under peak load (still feels instant to users)
- **Fallback**: 5-second polling if WebSocket connection fails

**Real-Time Event Flow:**
```
Malka taps "Complete" on Tablet #1
  ↓ <50ms
Client mutation + optimistic update
  ↓ <100ms
Supabase database write
  ↓ <200ms
Supabase Realtime broadcast to channel
  ↓ <100ms
All other devices receive update
  ↓ <50ms
UI updates on Tablet #2, Desktop, TV
  ↓ TOTAL: <500ms end-to-end (target)
  ↓ TOTAL: <1s (acceptable under load)
```

**Offline Resilience:**

**Offline Detection:**
- `navigator.onLine` + Supabase connection status
- Connection status badge: 🟢 Online / 🟡 Syncing / 🔴 Offline

**Mutation Queue:**
- **Storage**: IndexedDB queue for offline mutations
- **Sync strategy**: FIFO queue processing when connection restored
- **Operation validation**: Skip mutations referencing deleted/invalid entities, log for manual review

**Conflict Resolution (Priority-Based Model):**
- **Status transition priority**: Complete > Ready > Packing > Created
- **Rule**: Higher priority status wins on conflict
- **Tiebreaker**: Timestamp (latest timestamp wins for same-priority operations)
- **Example**: If Malka (offline) marks order #47 "Complete" and Yaron (offline) marks it "Ready", when both sync → "Complete" wins (higher priority)

**Degraded Mode Behavior:**
- **When Supabase Realtime fails**: Automatically fall back to 5-second polling
- **Visual indicator**: "⚠️ Slow Connection - Updates Delayed" banner
- **Functionality**: All features work, just slower updates (polling vs real-time)
- **User action**: Yaron checks all tablets manually if sync indicator shows "🔴 Offline" for >5 minutes

**Cache Retention Policy:**
- **Scope**: Active orders (not collected) + last 7 days of history
- **Limit**: Max 500 orders total
- **Storage**: IndexedDB (Safari 50MB quota - well within limits)
- **Cleanup**: Auto-purge orders >7 days old on sync

### SEO Strategy

**SEO Requirements: None** - KitchenOS is a private application with no public-facing pages.

**Technical Implementation:**
- `robots.txt`: Disallow all crawlers
- No sitemap.xml needed
- No structured data markup needed
- No meta description/keywords needed
- Authentication required for all routes (no public pages)

**Future Consideration:**
If multi-tenant SaaS expansion occurs (Vision: 12-24 months), marketing pages would need SEO:
- Landing page optimization
- Pricing page indexing
- Blog content (if created)
- **Not in scope for MVP**

### Accessibility Level

**Target: Custom Accessibility Standard** (Beyond WCAG - optimized for Malka at 80)

**Elderly User Accessibility (Primary Requirement):**
- **Touch targets**: 48px minimum (WCAG 2.1 AAA is 44px - we exceed this)
- **Font size**: 18px base on tablets (WCAG allows 16px - we exceed this)
- **Contrast ratio**: 7:1 minimum (WCAG AAA standard)
- **Color coding**: Never rely on color alone (use icons + text + color)
- **Error forgiveness**: Undo capability for destructive actions
- **Simple language**: Hebrew instructions in plain language (no technical jargon)

**Undo Patterns (Error Forgiveness):**

**Destructive Actions (Require Undo):**
- **"Mark as Collected"** - Removes order from active queue
- **UX Pattern**: Toast notification with undo button (5-second timeout)
  > "הזמנה #47 סומנה כנאספה. [בטל]" (Order #47 marked as collected. [Undo])

**Non-Destructive Actions (No Undo Needed):**
- **Status changes within workflow** (Packing → Ready → Complete)
- **Rationale**: User can tap card again to change status

**Device-Specific Accessibility:**

**Tablets (Touch-Only):**
- No keyboard navigation needed
- All interactions via large touch targets
- No hover states (touch doesn't have hover)
- Gesture support: Tap only (no swipe/pinch - too complex for elderly users)
- Visual feedback: Immediate on tap (color change, animation)

**Desktop (Keyboard Navigation):**
- Full keyboard shortcuts for Yaron's rapid order entry
- Tab order follows visual layout (RTL-aware)
- Enter/Space to activate buttons
- Escape to close modals
- Arrow keys for list navigation
- **Internal notifications**: Browser notification + sound alert when order status changes (desktop only)

**TV (No Interaction):**
- Auto-refreshing display only
- High contrast for visibility from distance (40-48px critical text)
- No accessibility requirements (read-only)

**Internationalization (i18n):**
- **Primary language**: Hebrew (RTL)
- **Secondary languages**: None in MVP
- **UI strings**: All in Hebrew
- **Product names**: Mixed language (Hebrew/English/Arabic as entered) - no translation
- **Number formatting**: Hebrew locale (₪ symbol, comma separators)
- **Date formatting**: Hebrew locale (DD/MM/YYYY)

### Progressive Web App (PWA) Capabilities

**PWA Features:**
- **Service Worker**: Cache assets for offline functionality
- **Web App Manifest**: Enable "Add to Home Screen" on tablets
- **Offline-first**: Core functionality works without internet
- **Push notifications**: Not needed (WhatsApp handles customer notifications, browser notifications for desktop staff alerts)

**Installation Experience:**
- **Tablets**: Prompt to "Add to Home Screen" on first visit (install as PWA)
- **Desktop**: Not promoted (browser access is fine)
- **TV**: Browser fullscreen/kiosk mode (no installation needed)

### Internal Notification Strategy

**Staff Alerts (Order Status Changes):**

**Desktop Notifications:**
- **When**: Order status changes (Created → Packing → Ready → Complete → Collected)
- **Who**: Yaron on desktop, Harel on admin desktop
- **How**: Browser notification + sound alert
- **Example**: "🟢 Order #47 (David) - Ready for Pickup!"

**Tablet Notifications:**
- **When**: None (tablets show real-time updates on-screen)
- **Why**: Tablets are always visible, notifications would be redundant/distracting

**TV Notifications:**
- **When**: None (read-only display)
- **Why**: TV auto-refreshes, customers see updates visually

**Notification Permissions:**
- Request browser notification permission on desktop login
- Optional: Allow Yaron to mute notifications during non-peak hours

## Functional Requirements

### Order Capture & Management

- FR1: System can automatically capture orders from WhatsApp messages
- FR2: System can send instant order confirmation to customers via WhatsApp with order number
- FR3: Owner can manually create orders via desktop interface including customer name, items, quantities, pickup time, and optional notes
- FR4: Owner can view complete order queue from any device (desktop, tablet, TV)
- FR5: System can assign sequential order numbers to all orders
- FR6: System can calculate total daily prep quantities across all orders
- FR7: Staff can filter orders by status (Created, Packing, Ready, Complete, Collected)
- FR8: Staff can filter orders by date and pickup time
- FR9: Staff can search for active orders by customer name or order number
- FR10: System can track order source (WhatsApp, email, phone, manual entry)
- FR11: Owner can edit existing orders (modify items, quantities, pickup time, customer name)
- FR12: Owner can cancel orders with confirmation dialog
- FR13: Owner can search historical orders (beyond current day) by customer name, order number, or date range
- FR14: System can restore cancelled orders within 24 hours

### Menu & Item Management

- FR15: Owner can view complete menu item list with current prices
- FR16: Owner can add new menu items (name, unit type, price per unit/weight)
- FR17: Owner can edit existing menu items (name, price, unit type)
- FR18: Owner can deactivate menu items (hide from order entry without deletion)
- FR19: System can display available menu items during manual order creation

### Kitchen Operations (Packing & Fulfillment)

- FR20: Kitchen staff can view order queue on tablet interface filtered by status
- FR21: Kitchen staff can select an order to begin packing (auto-marks status as "Packing")
- FR22: Kitchen staff can view order details including customer name, items, quantities, pickup time, and special notes
- FR23: Kitchen staff can enter actual weights for each item in an order
- FR24: System can calculate order price based on actual weights and current menu prices (mixed unit/weight items)
- FR25: Kitchen staff can mark order status as "Ready" when packing complete
- FR26: System can send payment link to customer via WhatsApp when order marked "Ready"
- FR27: Staff can see consistent order status across all devices (no concurrent edit conflicts)
- FR28: Kitchen staff can undo "Mark as Collected" within 5-second timeout window
- FR29: System can prevent concurrent modification of same order across multiple devices (optimistic locking)
- FR30: Kitchen staff can add special notes to orders during packing (e.g., "extra crispy kubana")

### Payment & Checkout

- FR31: Cashier can view orders ready for pickup on tablet interface
- FR32: Cashier can search pickup queue by customer name or order number
- FR33: System can display payment status for each order (Paid, Pending, Unpaid)
- FR34: System can generate Meshulam payment link for orders
- FR35: Cashier can display payment link QR code to customers
- FR36: Cashier can mark orders as "Collected" after customer pickup with confirmation
- FR37: System can automatically mark orders as "No-Show" after configurable cutoff time
- FR38: System can track payment method (card via Meshulam, cash, unpaid)
- FR39: Owner can generate end-of-day payment reconciliation report (total revenue, payment method breakdown)
- FR40: Owner can export payment data as CSV for accounting purposes

### Inventory Management

- FR41: Owner can set daily prep quantities for each menu item
- FR42: System can track available vs allocated inventory in real-time
- FR43: System can calculate inventory consumption as orders are created
- FR44: System can display low stock warnings when inventory falls below threshold (configurable per item, default 10 units or 15%)
- FR45: System can prevent order creation when available inventory is less than order quantity
- FR46: Staff can view current inventory status on tablet interface
- FR47: Owner can adjust inventory quantities via desktop interface with audit trail

### Customer Experience

- FR48: Customers can receive instant WhatsApp confirmation when they place orders
- FR49: Customers can view order number in confirmation message
- FR50: Customers can receive payment link via WhatsApp when order marked "Ready"
- FR51: Customers can view real-time order status on TV dashboard in store
- FR52: TV dashboard can display orders with color-coded status (🟡 Packing, 🟢 Ready)
- FR53: TV dashboard can display order number, customer first name, and pickup time (sanitized data, no prices)
- FR54: TV dashboard can auto-refresh every 5 seconds

### Owner/Admin Management

- FR55: Owner can access all order management features from desktop/laptop interface
- FR56: Owner can use optimized keyboard input methods for rapid order entry
- FR57: Owner can review complete order queue before end of day
- FR58: Owner can verify WhatsApp auto-capture accuracy and completeness
- FR59: Admin can monitor system health, real-time device connections, and performance metrics
- FR60: Admin can view event logs for complete order lifecycle tracking (created, modified, started, completed, collected, cancelled)
- FR61: Admin can export weekly KPI data as CSV (orders completed, revenue, average packing time, missed orders)
- FR62: Desktop users can receive browser notifications with sound alerts when order status changes
- FR63: Desktop users can mute notifications during non-peak hours
- FR64: Owner can export complete order database for business continuity and backup purposes

### System Reliability & Error Handling

- FR65: System can queue mutations locally when internet connection lost (IndexedDB)
- FR66: System can automatically sync queued mutations when connection restored (FIFO processing)
- FR67: System can display connection status indicator (🟢 Online, 🟡 Syncing, 🔴 Offline) on all interfaces
- FR68: System can fall back to 5-second polling when WebSocket connection fails
- FR69: System can resolve offline conflicts using priority-based model (Complete > Ready > Packing > Created)
- FR70: System can validate queued operations and skip invalid mutations on sync with error logging
- FR71: System can display clear error messages to users when operations fail (WhatsApp send failure, payment link generation failure, inventory depletion)
- FR72: System can provide visual loading indicators for operations exceeding 200ms
- FR73: System can queue failed external API calls for retry with exponential backoff (WhatsApp, Meshulam)
- FR74: System can handle burst order creation (50 orders in 60 seconds) without message delivery failure or performance degradation

### Audit & Logging

- FR75: System can log all order lifecycle events with timestamps (created, modified, started, completed, collected, cancelled)
- FR76: System can log all order modifications with actor identification (which device/user made the change)
- FR77: System can track system uptime and offline events for reliability monitoring
- FR78: System can cache active orders and last 7 days of history in browser storage (IndexedDB)
- FR79: System can auto-purge orders older than 7 days from local cache while maintaining server-side records

### Multi-Device Coordination

- FR80: System can support 7 concurrent device connections (4 tablets, 2 desktops, 1 TV)
- FR81: System can synchronize order status across all devices with target latency <500ms (acceptable <1s under load)
- FR82: System can display same order state on all devices simultaneously with consistency guarantees
- FR83: Tablets can function as both packing stations and cashier stations via view switching (bottom tab navigation)
- FR84: Desktop interface can provide complete visibility into all kitchen operations across all devices
- FR85: TV display can provide read-only customer-facing order status view with no interaction required
- FR86: System can handle network partition scenarios with graceful degradation (display warning, continue offline operation)

### User Experience & Feedback

- FR87: Tablet interface can provide immediate visual feedback on all tap actions (color change, animation, haptic if supported)
- FR88: Tablet interface can provide 48px minimum touch targets for elderly-accessible design
- FR89: Tablet interface can display 18px base font size for readability
- FR90: All interfaces can render Hebrew text in RTL (right-to-left) layout with proper text flow
- FR91: System can support zero-configuration operation (no user accounts, no preferences, instant usability)
- FR92: New staff can complete 3 test orders without assistance within 15 minutes (measured via user acceptance testing)
- FR93: Tablet interface can prevent accidental destructive actions with forgiving tap zones and confirmation dialogs
- FR94: Desktop interface can support full keyboard navigation with RTL-aware tab order
- FR95: System can provide audible sound notifications for critical kitchen events (new order arrival, order ready, low stock alert)

## Non-Functional Requirements

### Performance

**NFR-P1:** UI actions must complete within 100ms (target) to 150ms (acceptable) to maintain elderly user confidence

**NFR-P2:** Order list rendering must complete within 100ms for up to 50 active orders to prevent perceived lag during Friday rush

**NFR-P3:** Real-time sync latency must be <500ms (target) to <1 second (acceptable under load) from action on one device to update on all other devices (degraded mode: <2 seconds during burst load events per NFR-P7)

**NFR-P4:** Initial page load (Time to Interactive) must be <2 seconds (target) to <3 seconds (acceptable) on tablet devices

**NFR-P5:** Touch response feedback must appear within 100ms (target) to 150ms (acceptable) to confirm elderly user tap actions

**NFR-P6:** System must handle peak load of 7 concurrent device connections during Friday rush (6am-11am) without degrading sync latency beyond 1 second

**NFR-P7:** System must process burst order creation (25 orders in 60 seconds via WhatsApp automation) without message delivery failure or latency exceeding 3 seconds per order

**NFR-P8:** Database queries must return results within 200ms for datasets up to 10,000 orders to prevent performance degradation as order history grows

**NFR-P9:** Under peak load (7 devices, 50 active orders), system must maintain 95% of baseline performance metrics

### Reliability & Availability

**NFR-R1:** System must maintain 95% uptime during critical business hours (Thursday 6pm - Friday 2pm weekly) measured over 4-week rolling window

**NFR-R2:** System must automatically recover from WebSocket connection failures within 5 seconds by falling back to polling mode without user intervention

**NFR-R3:** Offline mutation queue must preserve all user actions during network outages and sync successfully when connection restored with <5 second processing time for queued operations

**NFR-R4:** System must prevent data loss during offline operations by persisting mutations to IndexedDB with automatic sync retry using exponential backoff (max 3 attempts)

**NFR-R5:** Conflict resolution must follow priority-based model (Complete > Ready > Packing > Created) with 100% deterministic outcomes for same-order concurrent modifications

**NFR-R6:** System must maintain data integrity across all devices with eventual consistency guarantee of <5 seconds under normal network conditions

**NFR-R7:** Failed external API calls (WhatsApp, Meshulam) must queue for retry with exponential backoff (1s, 2s, 4s delays) and alert owner via desktop browser notification after 3 failures

**NFR-R8:** System must cache active orders and last 7 days of history in IndexedDB with automatic purge of orders >7 days old to prevent quota exhaustion

**NFR-R9:** System must display clear connection status indicator (🟢 Online, 🟡 Syncing, 🔴 Offline) on all interfaces with <500ms status change latency

**NFR-R10:** System must maintain automated daily backups with 7-day retention and <1 hour recovery time objective

**NFR-R11:** System must gracefully handle IndexedDB quota exhaustion by prompting user to clear cache or upgrade browser storage limits

**NFR-R12:** System deployments must complete within 10 minutes with automatic rollback on failure

### Security

**NFR-S1:** All client-server communication must use TLS 1.3 encryption (enforced by Supabase and Vercel)

**NFR-S2:** System must NOT store credit card data locally or on server (Meshulam payment gateway handles all card data)

**NFR-S3:** WhatsApp API credentials and Meshulam API keys must be stored in environment variables (never committed to version control)

**NFR-S4:** Supabase Row Level Security policies must enforce data isolation if multi-tenant expansion occurs (future-proofing)

**NFR-S5:** System must sanitize customer data on TV dashboard (display first name only, no phone numbers, no prices, no addresses)

**NFR-S6:** IndexedDB offline cache must only store non-sensitive data (order details, menu items, status - no payment information)

**NFR-S7:** Event logs must record actor identification (device ID) for all order modifications to support audit trail and debugging

**NFR-S8:** Desktop admin interface must require authentication (Supabase Auth) with session timeout after 8 hours of inactivity

### Usability

**NFR-U1:** 80-year-old Malka must successfully complete packing workflow after 4 Fridays of usage with <5% error rate (measured as incorrect status transitions or accidental destructive actions)

**NFR-U2:** Touch targets must be minimum 48px × 48px on tablet interface (exceeds WCAG 2.1 AAA standard of 44px)

**NFR-U3:** Touch targets must have minimum 8px spacing between adjacent interactive elements to prevent accidental taps

**NFR-U4:** Base font size must be 18px on tablets and 16px on desktop (exceeds WCAG minimum of 16px for elderly readability)

**NFR-U5:** Color contrast ratio must be minimum 7:1 for all critical UI elements (WCAG AAA standard) with color never used as sole indicator (always paired with icons + text)

**NFR-U6:** Color-coded status indicators must maintain 7:1 contrast ratio across all states (default, active, disabled)

**NFR-U7:** Destructive actions ("Mark as Collected") must provide 5-second undo window with toast notification and clear undo button

**NFR-U8:** All successful actions must provide immediate visual confirmation (color change, animation, sound) within 100ms of tap

**NFR-U9:** Critical actions (Mark as Collected, Send Payment Link) must provide dual-mode confirmation (visual + auditory) for accessibility

**NFR-U10:** Error messages must be displayed in 18px font with paired icon, plain Hebrew language with actionable guidance (e.g., "אין חיבור לאינטרנט. נסה שוב בעוד כמה דקות" - "No internet connection. Try again in a few minutes"), and manual dismissal (no auto-dismiss for critical errors)

**NFR-U11:** All Hebrew text must render in RTL (right-to-left) layout with proper text flow and mirrored UI chrome (navigation, tabs, sidebar)

**NFR-U12:** Number formatting must use Hebrew locale (₪ symbol, DD/MM/YYYY dates)

**NFR-U13:** System must operate with zero configuration (no user accounts for staff, no preferences to set) - immediate usability on device pickup

**NFR-U14:** Visual loading indicators must appear for all operations exceeding 200ms to prevent perceived system freeze

**NFR-U15:** Active task screens must highlight critical information (current action required) with 2x visual weight compared to secondary information

**NFR-U16:** Tablet interface must limit concurrent information density to 3-5 primary elements per screen to reduce cognitive load for elderly users

**NFR-U17:** System must provide positive reinforcement for completed orders (e.g., green checkmark animation, success sound) to build user confidence

**NFR-U18:** Touch interface must function correctly with wet or flour-covered fingers (capacitive touch tolerance)

### Maintainability

**NFR-M1:** Codebase must maintain TypeScript strict mode with 100% type coverage for domain logic to prevent runtime errors

**NFR-M2:** All database schema changes must be versioned using Supabase migrations with rollback capability

**NFR-M3:** Event logging must capture all order lifecycle events (created, modified, started, completed, collected, cancelled) with timestamps for debugging and KPI analysis

**NFR-M4:** System must capture user error events (wrong status transitions, accidental actions) with device ID and timestamp for UX analysis

**NFR-M5:** System must provide CSV export functionality for weekly KPI data (orders completed, revenue, average packing time, missed orders) for business reporting

**NFR-M6:** Critical bugs affecting core workflow (order creation, status updates, payment links) must be acknowledged within 4 hours during business hours (Thursday 6pm - Friday 2pm) with resolution target of 24 hours

**NFR-M7:** Deployment pipeline must support zero-downtime deployments via Vercel preview deployments with rollback capability

**NFR-M8:** Admin dashboard must display real-time device connection status, sync latency, and error counts with 5-second refresh rate

**NFR-M9:** Documentation must include architecture decision records (ADRs) for key technical choices (offline-first, conflict resolution, real-time sync strategy)

**NFR-M10:** System must support test data reset functionality for development and staging environments without affecting production

**NFR-M11:** System must expose health check endpoint returning 200 OK when all critical services (database, realtime, external APIs) are operational

### Integration Reliability

**NFR-I1:** WhatsApp order auto-capture must achieve 98% accuracy rate (measured as correctly parsed orders / total WhatsApp messages) with manual fallback for failed parses

**NFR-I2:** Failed WhatsApp parses must alert owner within 30 seconds via desktop browser notification for manual entry

**NFR-I3:** WhatsApp confirmation messages must deliver within 3 seconds of order creation with retry logic for delivery failures

**NFR-I4:** Meshulam payment link generation must complete within 2 seconds with fallback to manual payment entry if API fails

**NFR-I5:** Payment link generation failure rate must be <1% with manual fallback notification to cashier via visual alert

**NFR-I6:** n8n WhatsApp automation workflow must queue failed message sends for retry with exponential backoff (max 3 attempts) and alert Harel via desktop notification after failures

**NFR-I7:** Supabase Realtime must reconnect automatically within 5 seconds of WebSocket disconnection without user intervention

**NFR-I8:** Payment status updates from Meshulam webhooks must sync to all devices within 5 seconds of payment completion (aligned with NFR-R6 eventual consistency guarantee)

### Compliance

**NFR-C1:** System must comply with Israeli data protection regulations for customer data storage and retention

**NFR-C2:** Payment processing must comply with PCI-DSS requirements via Meshulam proxy (no card data storage on KitchenOS servers or client devices)

### User Acceptance Criteria

**Note:** The following requirements are user acceptance metrics that will be validated during pilot testing and moved to the Success Criteria section:

- New staff must complete 3 test orders without assistance within 15 minutes (measured via user acceptance testing with rotating helpers)
- 80-year-old Malka's error rate target of <5% after 4 Fridays (operational metric, not system requirement)
