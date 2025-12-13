# KitchenOS Project Workflow

## Methodology: BMad Method (BMM)

**KitchenOS follows the BMad Method** - a structured, phase-based approach to software development. See [bmad-method.md](bmad-method.md) for complete methodology documentation.

### Current Status
- ✅ Phase 1: Analysis (Complete)
- ✅ Phase 2: Planning (Complete - [PRD v2.0](../../PRD.md))
- ✅ Phase 3: Solutioning (Complete - Architecture Defined)
- 🟡 Phase 4: Implementation (In Progress - Epic 1)

---

## Project Overview
KitchenOS is a Next.js application with Supabase backend integration. This is a kitchen management/restaurant operations system for Lacomida restaurant.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Supabase (Authentication & Database)
- Tailwind CSS 4
- Lucide React (Icons)
- Zustand (offline queue state)
- React Query (server state)

## Project Structure
```
kitchenos/
├── app/              # Next.js App Router pages & layouts
│   ├── (kds)/        # Kitchen Display System layout group
│   └── (admin)/      # Admin layout group
├── components/       # React components
│   ├── ui/           # Shadcn/ui base components
│   ├── kds/          # KDS-specific components
│   └── admin/        # Admin-specific components
├── lib/              # Utility functions and configurations
│   ├── supabase/     # Supabase clients
│   ├── hooks/        # React hooks
│   ├── stores/       # Zustand stores
│   └── offline/      # Offline queue system
├── supabase/         # Database migrations
│   └── migrations/   # SQL migration files (001-011)
├── .claude/          # BMad Method workflows
│   ├── workflows/    # Methodology and project docs
│   └── commands/     # Custom slash commands
├── components.json   # shadcn/ui configuration
└── public/           # Static assets
```

---

## Development Workflow (BMad Method)

### Implementation Process
Work follows **Epic → Story → Task** hierarchy. See [bmad-method.md](bmad-method.md) for:
- 9 defined Epics with user stories
- Acceptance criteria for each story
- Implementation commands and tasks
- Progress tracking

### Starting Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### BMad Method Commands
```bash
/epic              # Start a new epic (guided)
/story             # Implement a specific user story
/feature           # Implement a user story (guided)
/component         # Create new React component
/fix               # Fix bugs with structured approach
/review            # Code review before PR
/commit            # Create git commit with story reference
/pr                # Create pull request for epic
```

---

## Code Organization Standards

### 1. Components
- **Functional components** with TypeScript
- **Props interfaces** defined inline or exported
- **Server components by default** (App Router)
- Use `'use client'` directive only when needed
- File naming: kebab-case (`order-card.tsx`)
- Component naming: PascalCase (`OrderCard`)

### 2. Styling
- **Tailwind CSS** utility classes
- **Touch-optimized** (min 48px targets)
- **RTL support** for Hebrew
- Use `cn()` utility for conditional classes

### 3. Database
- Migrations in `supabase/migrations/`
- Name format: `NNN_description.sql` (e.g., `001_menu.sql`)
- Use Supabase client from `lib/supabase/server.ts` for server components
- Use Supabase client from `lib/supabase/client.ts` for client components
- Apply RLS (Row Level Security) policies

### 4. State Management
- **React Query** for server state (fetching, caching)
- **Zustand** for client state (offline queue, UI state)
- Keep state close to where it's used
- Avoid prop drilling (use context when needed)

---

## Common Tasks (BMad Method)

### Implementing a User Story
1. **Find the story** in [bmad-method.md](bmad-method.md)
2. **Review acceptance criteria** - understand what "done" means
3. **Use /story or /feature command**:
   ```bash
   /story
   # Enter story number when prompted (e.g., "1.1")
   ```
   Or:
   ```bash
   /feature
   # Describe the story when prompted
   ```
4. **Review the plan** - Claude will create implementation steps
5. **Approve and implement** - Claude builds the feature
6. **Test locally** with `npm run dev`
7. **Run checks**:
   ```bash
   npm run lint
   npm run build
   ```
8. **Commit with story reference**:
   ```bash
   /commit
   # Message: "Implement Story X.Y: Story Name"
   ```
9. **Update story status** in [bmad-method.md](bmad-method.md) to ✅ Complete

### Adding a New Feature (Outside of Epics)
1. Identify which epic/story it belongs to
2. Add to appropriate epic in [bmad-method.md](bmad-method.md)
3. Follow story implementation process above
4. Or create ad-hoc feature:
   ```bash
   /feature
   # Describe: "Add [feature name] to [location]"
   ```

### Database Changes
1. **Check existing migrations** in `supabase/migrations/`
2. **Create new migration**:
   ```bash
   /migrate
   # Describe the database change
   ```
3. Name format: `012_description.sql` (next number after 011)
4. Write forward migration SQL
5. Test migration locally
6. Commit migration file with story reference

### Adding UI Components
1. **Use shadcn/ui patterns** when possible
2. **Create in appropriate directory**:
   - `components/ui/` - Base components
   - `components/kds/` - KDS-specific
   - `components/admin/` - Admin-specific
3. **Use /component command**:
   ```bash
   /component
   # Describe component when prompted
   ```
4. Use Tailwind for styling
5. Import icons from `lucide-react`
6. Ensure TypeScript types are defined

---

## Git Workflow (BMad Method)

### Branch Strategy
```bash
# Main branch
main                    # Production-ready code

# Epic branches
epic/core-infrastructure
epic/orders-dashboard
epic/packing-weighing

# Story branches (if needed)
story/1.1-supabase-integration
story/2.1-orders-list
```

### Commit Messages
Follow this format:
```
Implement Story X.Y: Story Name

- Task 1 completed
- Task 2 completed
- Task 3 completed

Closes #issue-number
```

Example:
```
Implement Story 1.1: Supabase Integration

- Created browser Supabase client
- Created server Supabase client
- Created admin Supabase client
- Generated TypeScript types from schema
- Configured environment variables

Epic: Core Infrastructure
```

### Pull Requests
Create PRs when an **epic is complete**:
```bash
/pr
# Describe the epic when prompted
```

PR should include:
- All stories in the epic
- Link to PRD section
- Screenshots/demos
- Test results
- Epic completion status

---

## Best Practices

### TypeScript
- Always use TypeScript types (no `any`)
- Define interfaces for all props
- Use `type` for unions, `interface` for objects
- Generate types from Supabase schema

### Next.js App Router
- Server components by default
- Use `'use client'` only when needed:
  - Event handlers (onClick, onChange)
  - useState, useEffect
  - Browser APIs
  - Third-party libraries that require client
- Fetch data in server components
- Use `loading.tsx` and `error.tsx`

### Components
- Keep components focused and single-responsibility
- Max 200 lines per component (split if larger)
- Extract reusable logic to hooks
- Use composition over props drilling

### Supabase
- Use RLS (Row Level Security) for all tables
- Never expose service role key to client
- Use typed clients from `lib/supabase/`
- Handle errors gracefully

### Offline-First
- Queue mutations when offline
- Sync when online
- Show sync status in UI
- Handle conflicts (server wins for terminal states)

### Touch Optimization
- Minimum 48px × 48px touch targets
- Large buttons (56px height)
- Large inputs (52px height)
- 8px spacing between targets
- Support gestures (swipe, pull-to-refresh)

---

## Environment Setup

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# n8n
N8N_WEBHOOK_URL=https://n8n.example.com/webhook/xxx
N8N_WEBHOOK_SECRET=xxx

# Meshulam
MESHULAM_API_KEY=xxx
MESHULAM_WEBHOOK_SECRET=xxx
MESHULAM_PAGE_CODE=xxx

# Telegram HITL Bot
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Setup Steps
1. Clone repository
2. Copy `.env.example` to `.env.local`
3. Fill in environment variables
4. Install dependencies: `npm install`
5. Run migrations (in Supabase dashboard)
6. Start dev server: `npm run dev`

---

## Dependencies

### Production
- `next` - Framework
- `react` - UI library
- `@supabase/ssr` - Supabase SSR
- `@supabase/supabase-js` - Supabase client
- `@tanstack/react-query` - Server state
- `zustand` - Client state
- `tailwindcss` - Styling
- `lucide-react` - Icons

### Development
- `typescript` - Type safety
- `eslint` - Linting
- `@types/*` - Type definitions

### Adding Dependencies
```bash
npm install [package-name]

# Document in this file if significant
# Update PRD if it affects architecture
```

---

## Testing Strategy

### Manual Testing
- Test each story's acceptance criteria
- Test on tablet device (iPad/Android)
- Test offline mode
- Test real-time updates
- Test touch gestures

### Automated Testing (Phase 2)
- Unit tests with Vitest
- Integration tests with Playwright
- E2E tests for critical flows

---

## Deployment

See [/deploy](.claude/commands/deploy.md) command for full checklist.

### Quick Deploy
```bash
npm run build           # Verify build succeeds
npm run lint            # Check for issues
git push                # Push to GitHub
# Vercel auto-deploys from main branch
```

---

## Resources

- **BMad Method Guide**: [bmad-method.md](bmad-method.md)
- **PRD**: [PRD.md](../../PRD.md)
- **Database Schema**: [PRD.md - Section 5](../../PRD.md#5-database-schema)
- **API Contracts**: [PRD.md - Section 6](../../PRD.md#6-api-contracts)
- **Sprint Plan**: [PRD.md - Section 13](../../PRD.md#13-sprint-plan)

---

## Quick Start (BMad Method)

### 1. Review Current Phase
```bash
# Read current status
cat .claude/workflows/bmad-method.md
# Look for "Current Epic" and "Current Story"
```

### 2. Start Next Story
```bash
/story
# Enter the story number (e.g., "1.1")
```

### 3. Implement, Test, Commit
```bash
# After implementation
npm run dev            # Test locally
npm run lint           # Check for issues
/commit                # Commit with story reference
```

### 4. Update Progress
Edit [bmad-method.md](bmad-method.md):
- Mark story as ✅ Complete
- Update progress percentage
- Move to next story

---

**Current Phase**: Phase 4 - Implementation
**Current Epic**: Epic 1 - Core Infrastructure
**Current Story**: Story 1.1 - Supabase Integration
**Next Action**: Run `/story` and enter "1.1"
