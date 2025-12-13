# KitchenOS Claude Workflows

This directory contains workflow configurations and custom commands for working with the KitchenOS project.

## Methodology

**KitchenOS follows the BMad Method (BMM)** - a structured, phase-based software development approach.

📖 **[Read the BMad Method Guide](bmad-method.md)** for complete methodology documentation including:
- The four phases (Analysis, Planning, Solutioning, Implementation)
- 9 implementation epics with user stories
- Acceptance criteria and tasks
- Progress tracking dashboard

## Available Commands

Use these slash commands to streamline common tasks:

### BMad Method Commands (Phase 4: Implementation)

#### `/epic`
Start a new epic from the BMad Method plan. Shows objective, stories, and guides through implementation.

#### `/story`
Implement a specific user story. Shows acceptance criteria, creates task list, implements, and tracks progress.

#### `/feature`
Guided feature implementation. Use for stories or ad-hoc features. Walks through planning, implementation, and testing.

### Development Commands

#### `/component`
Create new React components with proper TypeScript types, styling, and Next.js conventions.

#### `/migrate`
Generate Supabase database migration files with proper naming and SQL structure.

#### `/fix`
Structured approach to investigating and fixing bugs or issues in the codebase.

### Quality & Deployment Commands

#### `/review`
Comprehensive code review checking for TypeScript errors, best practices, security, and performance.

#### `/deploy`
Pre-deployment checklist and preparation steps for deploying KitchenOS to production.

## Workflow File

**project.md** - Main project workflow containing:
- Project overview and tech stack
- Directory structure
- Development workflow
- Common tasks and patterns
- Best practices
- Environment setup

## Usage

1. Use slash commands directly: `/feature`, `/component`, etc.
2. Refer to `project.md` for project-specific context and conventions
3. All commands follow KitchenOS tech stack (Next.js 16, React 19, TypeScript, Supabase)

## Customization

Edit command files in `.claude/commands/` to customize workflows for your specific needs.
