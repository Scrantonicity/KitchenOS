Prepare KitchenOS for deployment:

1. Run pre-deployment checks:
   - `npm run lint` - Check for linting errors
   - `npm run build` - Verify production build succeeds
   - Review environment variables needed

2. Check deployment configuration:
   - Verify `next.config.ts` settings
   - Ensure all environment variables are documented
   - Review Supabase connection settings

3. Database preparation:
   - List all pending migrations
   - Verify migrations are ready for production
   - Check RLS policies are in place

4. Provide deployment checklist:
   - Environment variables to set
   - Database migrations to run
   - Build commands
   - Any post-deployment steps

5. Suggest deployment platform if not decided:
   - Vercel (recommended for Next.js)
   - Custom server setup
   - Other options

Ask if I'd like help with the actual deployment process.
