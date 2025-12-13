Create a new Supabase migration file:

1. Ask me what database changes are needed:
   - New tables?
   - Columns to add/modify?
   - Indexes to create?
   - RLS policies?

2. Generate timestamp for migration filename

3. Create migration file in `supabase/migrations/` with format: `YYYYMMDDHHMMSS_description.sql`

4. Write SQL migration with:
   - Clear comments explaining changes
   - Proper table creation with constraints
   - Indexes for performance
   - RLS policies for security
   - Any necessary seed data

5. Show me the migration file for review
