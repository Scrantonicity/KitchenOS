Start a new epic from the BMad Method implementation plan.

1. Ask me which epic I want to start (1-9):
   - Epic 1: Core Infrastructure
   - Epic 2: Orders Dashboard
   - Epic 3: Packing & Weighing
   - Epic 4: Inventory Management
   - Epic 5: Pickup & Completion
   - Epic 6: HITL Approval System
   - Epic 7: Reservations (שמור לי)
   - Epic 8: Manual Order Entry
   - Epic 9: Menu Management

2. Read the epic details from `.claude/workflows/bmad-method.md`

3. Show me:
   - Epic objective
   - All user stories in this epic
   - Acceptance criteria for each story
   - Dependencies (if any)

4. Create a feature branch:
   ```bash
   git checkout -b epic/[epic-name]
   ```

5. Ask which story to start with

6. Use the TodoWrite tool to create todos for:
   - Each story in the epic
   - Each task within the first story

7. Guide me through implementing the first story using the /feature workflow
