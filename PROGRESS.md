# Progress Checklist

## Phase 1: Foundation
- [x] Next.js, strict TS, Tailwind, shadcn, design tokens, fonts, layout shell, responsive nav, base components
- [x] lint/format/test config
- [x] pnpm verify
- [x] .env.example
- [x] .gitignore
- [x] Supabase local config
- [x] security headers

## Phase 2: Auth + roles
- [x] signup (student/owner)
- [x] login, logout, password reset, session refresh
- [x] profiles
- [x] role-aware routing, server route guards
- [x] role-protection trigger
- [x] admin bootstrap script
- [x] owner approval

## Phase 3: Database + RLS
- [x] all migrations
- [x] RLS on every table
- [x] helpers
- [x] demo-flagged seed
- [ ] generated types
- [ ] RLS tests

## Phase 4: Student search + property detail
- [ ] URL-driven paginated search, filters, sorts
- [ ] college search
- [ ] detail page, gallery
- [ ] cost calculator
- [ ] save

## Phase 5: Owner dashboard
- [ ] property/room/bed CRUD, availability, pricing, food info, amenities, rules
- [ ] validated photo upload
- [ ] enquiries inbox
- [ ] stats (total/occupied/available beds, new enquiries, visits, bookings)
- [ ] basic analytics

## Phase 6: Verification + location photos
- [ ] capture flow, server geo checks, statuses
- [ ] admin workflow (approve/reject/request corrections/set dates)
- [ ] badges + explanations
- [ ] audit logs

## Phase 7: Visit requests + enquiries
- [ ] full status machine
- [ ] owner accept/propose/reject
- [ ] student status view
- [ ] owner stay confirmation
- [ ] in-app notifications

## Phase 8: Reviews
- [ ] eligibility, categories
- [ ] moderation queue, reports
- [ ] owner response
- [ ] badges

## Phase 9: Compare + commute
- [ ] compare functionality
- [ ] commute integration (Google Routes API)

## Phase 10: Mess/tiffin
- [ ] onboarding, listing
- [ ] search/filter, details, save
- [ ] eligible food reviews

## Phase 11: Admin dashboard
- [ ] users, owners, properties, rooms, food providers
- [ ] verification queue, reviews, reports, visit requests, expiry management
- [ ] basic analytics

## Phase 12: Hardening + testing + Razorpay stub
- [ ] webhook verification (flag off)
- [ ] rate limiting, CSP review, dependency audit
- [ ] full E2E for student/owner/admin journeys
- [ ] secret-leak scan of the client bundle

## Phase 13: Production prep
- [ ] README, Supabase + Vercel guides, env table, privacy/terms drafts, 404/500 pages, SEO metadata, sitemap
- [ ] Lighthouse >=90 (performance/accessibility/best-practices) on home and property pages
- [ ] final pnpm verify
