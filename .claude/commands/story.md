Implement a specific user story from the BMad Method plan.

1. Ask me which story I want to implement (format: "Epic.Story" like "1.1" or "2.3")

2. Read the story details from `.claude/workflows/bmad-method.md`

3. Show me:
   - User story (As a... I want... So that...)
   - Acceptance criteria
   - All tasks for this story

4. Create a plan using TodoWrite with all tasks

5. Ask for confirmation to proceed

6. Implement the story:
   - Follow the task list
   - Create/modify files as needed
   - Follow Next.js 16 and TypeScript best practices
   - Ensure all acceptance criteria are met

7. After implementation:
   - Run `npm run lint` to check for issues
   - Ask me to test locally
   - Update story status in bmad-method.md to ✅ Complete
   - Update progress percentage in the tracking table

8. Ask if I want to:
   - Commit changes (offer to use /commit)
   - Move to next story in the epic
   - Take a break
