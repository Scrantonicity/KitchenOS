# KitchenOS (Lacomida KDS)

> A tablet-first Kitchen Display System for Lacomida restaurant with WhatsApp ordering, AI-powered Hebrew parsing, and HITL approval workflows.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase, n8n, Meshulam, and Telegram credentials

# Run database migrations
# (In Supabase dashboard, run all migrations from supabase/migrations/)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📖 Methodology

**KitchenOS is built using the BMad Method (BMM)** - a structured, phase-based software development approach.

### Current Status
- ✅ **Phase 1: Analysis** (Complete)
- ✅ **Phase 2: Planning** (Complete - [PRD v2.0](PRD.md))
- ✅ **Phase 3: Solutioning** (Complete - Architecture Defined)
- 🟡 **Phase 4: Implementation** (In Progress - Epic 1: Core Infrastructure)

📖 **[Read the BMad Method Guide](.claude/workflows/bmad-method.md)** for:
- The four development phases
- 9 implementation epics with user stories
- Acceptance criteria and tasks
- Progress tracking dashboard

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS 4, Shadcn/ui (touch-optimized) |
| State | Zustand (offline queue), React Query (server state) |
| Backend | Next.js API Routes (Vercel serverless) |
| Database | Supabase (PostgreSQL 15) |
| Real-time | Supabase Realtime Channels |
| Workflows | n8n (WhatsApp bot automation) |
| Payments | Meshulam |
| WhatsApp | Wassenger |
| HITL | Telegram Bot |
| Hosting | Vercel |

### Key Features

- 🍽️ **Menu Management** - Dynamic menu with Hebrew GPT fuzzy matching
- 📱 **Tablet-First KDS** - Touch-optimized (48px targets), gesture support
- 🔄 **Offline-Resilient** - Queue mutations locally, sync when online
- ⚡ **Real-time Updates** - Instant updates across all stations via Supabase
- 🤖 **AI Order Parsing** - GPT-powered Hebrew order processing via WhatsApp
- 🛡️ **HITL Approval** - Human-in-the-loop fraud prevention (2+ no-shows)
- 💳 **Payment Integration** - Meshulam online payments
- 🔒 **Secure Webhooks** - HMAC-signed webhook authentication

---

## 📋 Documentation

### For Developers
- **[PRD (Product Requirements)](PRD.md)** - Complete technical specification
- **[BMad Method Guide](.claude/workflows/bmad-method.md)** - Development methodology
- **[Project Workflow](.claude/workflows/project.md)** - Development guidelines
- **[Database Schema](PRD.md#5-database-schema)** - 11 SQL migrations included
- **[API Contracts](PRD.md#6-api-contracts)** - All endpoint specifications
- **[Folder Structure](PRD.md#10-project-folder-structure)** - Complete file organization

### For Managers
- **[Sprint Plan](PRD.md#13-sprint-plan)** - 6 sprints (8 weeks total)
- **[Epic Tracking](.claude/workflows/bmad-method.md#epic-tracking)** - Progress dashboard
- **[Success Metrics](PRD.md#success-metrics)** - KPIs and business metrics

---

## 🎯 MVP Screens (8 total)

| Screen | Route | Priority | Status |
|--------|-------|----------|--------|
| Orders Dashboard | `/` | P0 | 🔵 Not Started |
| Packing & Weighing | `/orders/[id]` | P0 | 🔵 Not Started |
| Inventory Management | `/inventory` | P0 | 🔵 Not Started |
| Pickup Queue | `/pickup` | P0 | 🔵 Not Started |
| Risk Approvals (HITL) | `/approvals` | P1 | 🔵 Not Started |
| Reservations (שמור לי) | `/reservations` | P1 | 🔵 Not Started |
| Manual Order Entry | `/orders/new` | P1 | 🔵 Not Started |
| Menu Management | `/menu` | P1 | 🔵 Not Started |

---

## 🛠️ Development

### Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# BMad Method Commands (via Claude Code)
/epic               # Start a new epic
/story              # Implement a user story
/feature            # Add a feature (guided)
/component          # Create React component
/migrate            # Create database migration
/fix                # Fix bugs
/review             # Code review
/commit             # Git commit with story reference
/pr                 # Create pull request
```

### Project Structure

```
kitchenos/
├── app/                    # Next.js App Router
│   ├── (kds)/             # Kitchen Display System (tablet)
│   ├── (admin)/           # Admin interface (desktop)
│   └── api/               # API routes
├── components/
│   ├── ui/                # Shadcn/ui base components
│   ├── kds/               # KDS-specific components
│   └── admin/             # Admin components
├── lib/
│   ├── supabase/          # Database clients
│   ├── hooks/             # React hooks
│   ├── stores/            # Zustand stores
│   └── offline/           # Offline queue
├── supabase/
│   └── migrations/        # SQL migrations (001-011)
└── .claude/               # BMad Method workflows
```

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# n8n
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET=

# Meshulam
MESHULAM_API_KEY=
MESHULAM_WEBHOOK_SECRET=
MESHULAM_PAGE_CODE=

# Telegram HITL Bot
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=
```

---

## 🗄️ Database

### Migrations (11 total)

All SQL migrations are in [`supabase/migrations/`](supabase/migrations/):

1. `001_menu.sql` - Menu items with Hebrew GPT matching
2. `002_stations.sql` - Tablet devices
3. `003_customers.sql` - Customer records with HITL flags
4. `004_orders.sql` - Orders with 11 status states
5. `005_order_items.sql` - Line items (normalized)
6. `006_order_status_history.sql` - Audit trail
7. `007_daily_inventory.sql` - Daily prep quantities
8. `008_reserved_items.sql` - Reservations (שמור לי)
9. `009_error_log.sql` - System error tracking
10. `010_realtime_triggers.sql` - Supabase Realtime
11. `011_seed_data.sql` - Sample data

### Running Migrations

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run each migration file in order
4. Verify tables created successfully

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect GitHub**: Link repository to Vercel
2. **Configure Environment Variables**: Add all env vars in Vercel dashboard
3. **Deploy**: Auto-deploys on push to `main`

### Pre-Deployment Checklist

```bash
npm run lint         # No errors
npm run build        # Build succeeds
# Test all critical flows
# Verify environment variables
# Run database migrations in production
```

---

## 📊 Success Metrics

### KPIs
- **Order Accuracy**: >95% correct first-time
- **HITL Precision**: <10% false positives
- **No-Show Rate**: <5% overall
- **Average Order Time**: <8 minutes (order → ready)
- **Station Uptime**: >99.5%
- **Offline Sync Success**: >98%

---

## 🤝 Contributing

### Development Workflow (BMad Method)

1. **Pick a Story**: Review [bmad-method.md](.claude/workflows/bmad-method.md)
2. **Implement**: Run `/story` command with story number
3. **Test**: Verify acceptance criteria locally
4. **Commit**: Use `/commit` with story reference
5. **Track**: Update progress in [bmad-method.md](.claude/workflows/bmad-method.md)

### Code Standards
- TypeScript types (no `any`)
- Server components by default
- Touch-optimized (min 48px targets)
- RTL support for Hebrew
- Offline-first (queue mutations)
- Real-time updates

---

## 📄 License

Proprietary - Lacomida Restaurant

---

## 🆘 Support

### Documentation
- [BMad Method Guide](.claude/workflows/bmad-method.md)
- [PRD (Complete Spec)](PRD.md)
- [Project Workflow](.claude/workflows/project.md)

### Commands
```bash
/help               # Get help with Claude Code
/epic               # Start new epic
/story              # Implement user story
```

---

**Current Phase**: Phase 4 - Implementation
**Current Epic**: Epic 1 - Core Infrastructure
**Next Action**: Run `/story` and enter "1.1" to start Supabase Integration

Built with ❤️ using the BMad Method (BMM)
