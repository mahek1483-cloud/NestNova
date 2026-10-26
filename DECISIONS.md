# Architectural & Implementation Decisions

## STEP 0: Existing Workspace Conflict
**Context:** The existing workspace (`src/app/`, `src/components/`, `src/store/clientStore.tsx`, `src/data/mockData.ts`) contains an MVP built purely on the client-side with mock data.
**Conflict:** The new specification requires a strict real full-stack Next.js + Supabase Postgres App Router structure (e.g., `app/(marketing)`, `app/(auth)`, `app/(student)`, server actions, explicit RLS, real DB seed data with `is_demo=true`).
**Decision (Safest Option):** 
1. The existing UI components (`src/components/ui/`, layout components) and styles will be preserved and iteratively adapted.
2. The current page routes (`src/app/page.tsx`, etc.) will be moved into the specified route groups (`(marketing)`, `(student)`, `(owner)`, etc.) incrementally.
3. The mock data (`src/data/mockData.ts`) and client store (`clientStore.tsx`) will be phased out and replaced by real Supabase queries and Server Actions, as "fake functionality" is strictly prohibited. For now, they might be kept as reference until the new DB schemas and seeding are complete, but they will not be used in the final production paths.
4. I will set up `pnpm` as requested for package management (replacing `npm` if currently used).
