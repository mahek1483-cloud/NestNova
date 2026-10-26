You are building NESTNOVA, a real, production-grade, full-stack web app, autonomously, from start to finish, in this workspace. Work through ALL phases below in order without waiting for my approval between phases. Only stop early if you hit a true blocker that needs me (missing credential, destructive conflict with existing code). Everything else, decide sensibly, record in DECISIONS.md, and continue.

STEP 0 (do first): Inspect the workspace (file tree, package.json, git status). Preserve useful existing code; if something conflicts with this spec, note it in DECISIONS.md and choose the safest option. Then save this entire prompt as SPEC.md in the project root. Create PROGRESS.md (phase checklist) and DECISIONS.md. If your context ever resets or you feel unsure, re-read SPEC.md and PROGRESS.md and resume from the first unfinished item.

=== PRODUCT ===
NestNova. Tagline: "Know what you're getting before you move."
A trust-first student-living platform for students relocating for education/work to discover and compare PGs, hostels, student accommodation, mess services and tiffin providers. The differentiator is evidence-based TRUST: real photos, transparent total monthly cost, honest verification, and reviews only from people who actually visited or lived there. It is NOT a generic real-estate site.

=== NON-NEGOTIABLE RULES ===
1. No fake functionality. If something is not truly working end to end, label it "pending configuration" in the UI and in the final report. Never claim completion for visual-only features.
2. Seed/demo data must have is_demo=true, show a visible "Demo data" badge, and NEVER be verified, have verified reviews, verification evidence, payment success, or fake route data.
3. Verification is evidence-based only. Payment must NEVER grant or influence verification, ranking, or reviews. Enforce in the DB, not only the UI.
4. GPS alone never verifies a property. "Location-Verified Photo" (photo-level evidence) and "NestNova Verified Property" (admin decision on the whole property) are separate statuses with separate badges. Never merge them.
5. Authorization is enforced by Postgres RLS and server code. Frontend role checks are cosmetic only.
6. No secrets in client code or git. Never invent, print or request secret keys. If a credential is missing: add a placeholder to .env.example, build a safe "not configured" state, and tell me exactly what to provide.
7. Never invent library APIs. Check installed versions' types/docs in node_modules before using an API. If the installed Next.js changed a convention (middleware vs proxy, async cookies()/params), follow the installed docs, not memory.
8. Never rewrite working code without a reason. Never weaken types, skip tests, or disable lint rules to get green.

=== STACK (fixed) ===
Next.js (latest stable, App Router) + React + strict TypeScript + Tailwind + shadcn/ui; Server Actions for mutations, Route Handlers for webhooks/uploads/API proxies; Supabase (Postgres, Auth, Storage, RLS) via @supabase/ssr; PostGIS; Zod (shared validation) + React Hook Form; Google Maps Platform (Routes/Geocoding, server-side key only, graceful fallback); Razorpay (architecture only, see Payments); Vitest + Playwright + SQL RLS tests; pnpm; deploy GitHub -> Vercel -> Supabase. Do not use MongoDB, Firebase, Express, Django, Laravel, Flutter or Prisma. Use generated Supabase types.

=== ROLES ===
student, owner (covers PG/hostel owners AND mess/tiffin providers), admin.
- Public signup allows ONLY student or owner. Admin is never self-serve: create admins only via a documented SQL script run with the service role.
- Users must not be able to change their own role (RLS + trigger blocking role/verification fields for non-admins).
- Use SECURITY DEFINER helpers (is_admin(), is_owner_of(property_id)) with locked search_path.
- Owners start owner_status='pending'; they can create drafts but listings are public only after admin approves the owner.

=== LIFECYCLES ===
- listing_status: draft -> submitted -> published | rejected | archived. Only published listings of approved owners are publicly readable.
- Verification (admin-only writes): unverified -> pending -> verified | rejected | correction_requested; verified -> expired (when expires_at passes) -> pending. Every transition writes audit_logs. Admin sets verified_at and expires_at (default 12 months).
- Photo status: normal | location_verified | location_rejected (independent of property verification).
- Visit requests: pending -> accepted | proposed | rejected; accepted -> completed | cancelled. Transitions enforced in the DB. Never imply payment occurred.
- Availability: properties -> rooms (type, sharing, rent, deposit, bath/AC flags) -> beds (available | occupied | reserved). Derive counts from beds; no duplicated counters.

=== LOCATION-VERIFIED PHOTOS ===
Owner taps "Verify & Capture Photos". Use live camera (getUserMedia, no gallery for verified captures) + high-accuracy geolocation, with explicit consent screens. Slots: building entrance, room, bathroom, kitchen, common area (+ optional amenities). Server computes distance to the property's registered coordinates via PostGIS; radius configurable (LOCATION_VERIFY_RADIUS_METERS, default 100); also reject if GPS accuracy is worse than LOCATION_MAX_ACCURACY_METERS (default 50) or the capture timestamp is older than 2 minutes. Out of radius/low accuracy -> store as location_rejected with a clear human-readable reason; never label verified. Store photo, property_id, owner_id, client captured_at AND server uploaded_at, lat/lng, accuracy, distance, status. Be honest in UI copy: GPS can be spoofed, so this is supporting evidence reviewed by an admin, not proof. Strip EXIF GPS from publicly served images.

=== REVIEWS (core trust rule) ===
A review is allowed only if tied to the exact student and property/food provider via either:
- "Visited": a visit_request with status completed, confirmed by the owner (limited categories), or
- "Verified resident": an owner-confirmed stay_record of at least 14 days (full categories).
One review per student per stay. Reviews start pending -> published | rejected via moderation (admin override always). Owners can respond once but can never edit, hide or delete reviews. Signed-in users can report reviews. Reviews can never be bought or boosted. Enforce eligibility in RLS/DB constraints, not just actions.
Property categories: cleanliness, food, management, wifi, maintenance, overall (1-5) + text. Food categories: taste, hygiene, quantity, variety, timeliness, value (1-5) + text.

=== COST CALCULATOR ===
Lines: rent, food, electricity, maintenance, laundry, estimated transport = estimated monthly cost. Each line is labeled fixed, variable or estimated, with its source; never hide a charge; show a range when variable. Store money as integer paise or numeric(12,2), never floats. Put the calculation in a pure, unit-tested function.

=== SEARCH / COMPARE / COMMUTE ===
- Search: server-side, URL-driven (shareable params), paginated, via PostGIS and indexes. By city, locality, college, property name. Filters: budget, sharing, property type, gender/category, food, amenities, verified-only, distance. Sorts: relevance, price, distance, recently verified, rating.
- Compare up to 4 properties (rent, deposit, food, electricity, maintenance, estimated monthly cost, sharing, amenities, distance, commute, verification, reviews). Persist for signed-out users and merge on login. Must be easy on mobile (card stack or horizontal scroll with sticky label column).
- Commute: Google Routes API server-side only, short-TTL cache. If key missing/failing: show computed straight-line distance labeled "straight-line" and "Route estimates unavailable". Never fabricate durations.

=== MESS / TIFFIN ===
Providers list: name, location, pricing, menu, timings, veg/non-veg, delivery/pickup, contact, description, photos, availability. Students search, filter, view, save, and review after an eligible experience.

=== PAYMENTS (stub only) ===
Razorpay architecture: server creates orders; payment status changes ONLY from a verified webhook (HMAC signature, idempotent by event id) or server-side signature verification. Never trust frontend success. Keys server-side only. PAYMENTS_ENABLED=false by default; payment UI hidden when off.

=== DATABASE ===
Ordered migrations in supabase/migrations/. Enable pgcrypto + postgis. UUID PKs, timestamptz created_at/updated_at (+trigger), real FKs with explicit ON DELETE, CHECK constraints, indexes on every FK/filter/sort column, GiST on geography, trigram/FTS for text search.
Tables: profiles, owner_profiles, colleges, properties, rooms, beds, property_images, location_verified_photos, verification_records, visit_requests, stay_records, enquiries, saved_properties, saved_food_providers, reviews, review_responses, review_reports, listing_reports, food_providers, food_menu_items, food_reviews, payments, notifications, audit_logs, app_settings.
RLS enabled on EVERY public table with separate SELECT/INSERT/UPDATE/DELETE policies per role. No USING(true) on writes. Service-role key only in server-only modules, only where bypass is truly required. Public views expose only safe columns (no owner phone/email). Provide demo-flagged seed.sql, generated types/database.ts, and supabase/README.md for local setup.

=== STORAGE ===
Buckets: property-photos (public read; owner writes only to own {property_id}/ prefix), verified-captures (private, signed URLs for admin + owning owner), verification-docs (private), avatars. Server-side validation: MIME by magic bytes, jpeg/png/webp (pdf for docs), photos <=5MB, docs <=10MB, max files per property, re-encode and strip metadata, random filenames, never trust client paths.

=== SECURITY ===
@supabase/ssr cookie sessions refreshed in proxy/middleware; use supabase.auth.getUser() (not getSession()) for authorization. Every Server Action/Route Handler: authenticate -> authorize -> Zod-validate -> execute -> return {ok:true,data}|{ok:false,error}. Safe user-facing errors; details only in server logs. Rate-limit auth, enquiry, visit, report, upload, review endpoints (Upstash adapter when configured; documented in-memory dev fallback flagged non-production). Security headers: CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (camera/geolocation only on the capture route). Verify Origin on custom POST handlers. Password reset with generic responses. Audit-log all admin actions. .gitignore covers .env* except .env.example. Only genuinely browser-safe vars use NEXT_PUBLIC_.

=== PRIVACY (India / DPDP-aware) ===
Explicit consent before camera/location/personal data use, purpose-limited collection, account deletion and data export, minimal retention. Privacy Policy, Terms and Cookie pages as DRAFTS clearly marked "requires legal review". Never show student phone/email to an owner until the student submits an enquiry/visit request to that owner.

=== ENV VARS (.env.example) ===
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=   (server only)
GOOGLE_MAPS_API_KEY=   (server only)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=   (server only)
RAZORPAY_WEBHOOK_SECRET=   (server only)
PAYMENTS_ENABLED=false
LOCATION_VERIFY_RADIUS_METERS=100
LOCATION_MAX_ACCURACY_METERS=50
UPSTASH_REDIS_REST_URL=   (optional)
UPSTASH_REDIS_REST_TOKEN=   (optional, server only)
NEXT_PUBLIC_SITE_URL=

=== UI/UX (must look premium, not template-ish) ===
- Feel: calm, confident, warm, trustworthy; evidence over decoration. Do not copy another company's design.
- Palette: deep teal/ink primary, warm sand neutrals, one saffron/amber CTA accent. Green ONLY for verified states, amber for pending/expired, red for rejected/errors. Define as design tokens, AA contrast.
- Type: one distinctive display font for headings + one highly legible sans for UI via next/font. Fluid scale, generous spacing, 4/8 grid, consistent radius and shadows.
- Trust UI is a feature: distinct badges for "NestNova Verified Property" (with verified date + expiry), "Location-Verified Photo", "Verified resident"/"Visited", "Demo data", "Verification pending/expired/rejected". Each has a tooltip explaining exactly what it does and does not mean. Show "Last verified: <date>" prominently.
- Homepage: strong branding; hero "Find a place you'll actually feel comfortable living in." with sub-line "Compare verified information, transparent costs and real student experiences before you move."; college/location search with budget/sharing/food filters; how trust works; recently verified properties (real data only, else an honest empty state); compare feature; mess/tiffin discovery; student benefits; owner CTA; footer.
- Property page order: gallery -> price + true monthly cost -> verification evidence -> food -> rules/safety -> amenities -> commute -> reviews -> request visit (sticky bottom CTA on mobile).
- Mobile-first (design at 360px; test 360/768/1280): bottom nav or compact drawer, touch targets >=44px, no horizontal scroll.
- Every data view has skeleton loading, helpful empty state, error state with retry, success toast. Every form has inline Zod errors, disabled-while-submitting, double-submit prevention. Semantic HTML, labels, visible focus, keyboard support, reduced-motion respected.
- Performance: Server Components by default, next/image with sizes, lazy galleries, no unbounded queries.

=== CODE QUALITY ===
strict + noUncheckedIndexedAccess; no any; no unjustified @ts-ignore. Layout: app/(marketing), app/(auth), app/(student), app/(owner)/owner, app/(admin)/admin, app/api; components/{ui,shared,features}; lib/{supabase,validation,auth,db,geo,cost,maps,payments,rate-limit,utils}; types/; supabase/migrations; tests/{unit,e2e,rls}. Business logic (cost, eligibility, verification transitions, geo checks) in pure tested functions in lib/. Files ~300 lines max. ESLint + Prettier. Script "pnpm verify" = typecheck && lint && test && build. Conventional commits, one per completed phase.

=== EXECUTION PROTOCOL (this is how you avoid errors) ===
For EVERY phase: (1) plan a short checklist; (2) implement in small steps, running typecheck after each meaningful step; (3) write tests alongside code; (4) run pnpm verify and fix root causes; (5) smoke-test the phase's real flows in the running app (including unhappy paths); (6) update PROGRESS.md and DECISIONS.md; (7) commit; (8) move to the next phase. If a command fails repeatedly, diagnose and change approach instead of looping. Do not move on while a phase's Definition of Done is unmet unless you record exactly why in PROGRESS.md.
Priority: P0 = auth, roles, owner approval, property CRUD, search/detail, cost calculator, save, compare, visit requests, enquiries, location-verified photos, admin verification + moderation, reviews, RLS, tests. P1 = mess/tiffin, commute, owner analytics, notifications. P2 = Razorpay stub. If running short, protect P0 quality over breadth; never ship a half-built feature as finished.

=== PHASES AND DEFINITION OF DONE ===
1. Foundation: Next.js, strict TS, Tailwind, shadcn, design tokens, fonts, layout shell, responsive nav, base components, lint/format/test config, pnpm verify, .env.example, .gitignore, Supabase local config, security headers. DoD: app boots, verify passes, no secrets tracked.
2. Auth + roles: signup (student/owner), login, logout, password reset, session refresh, profiles, role-aware routing, server route guards, role-protection trigger, admin bootstrap script, owner approval. DoD: no self-assigned admin or role change; guards tested.
3. Database + RLS: all migrations, RLS on every table, helpers, demo-flagged seed, generated types, RLS tests. DoD: cross-owner access denied, anon sees only published, students can't write others' data.
4. Student search + property detail: URL-driven paginated search, filters, sorts, college search, detail page, gallery, cost calculator, save. DoD: filters run in the DB; calculator unit-tested; all states present.
5. Owner dashboard: property/room/bed CRUD, availability, pricing, food info, amenities, rules, validated photo upload, enquiries inbox, stats (total/occupied/available beds, new enquiries, visits, bookings), basic analytics. DoD: owner can touch only own data (tested); uploads validated server-side.
6. Verification + location photos: capture flow, server geo checks, statuses, admin workflow (approve/reject/request corrections/set dates), badges + explanations, audit logs. DoD: out-of-radius rejected with reason; payment path cannot set verification (tested); transitions enforced in DB.
7. Visit requests + enquiries: full status machine, owner accept/propose/reject, student status view, owner stay confirmation, in-app notifications. DoD: invalid transitions rejected by DB; contact details gated.
8. Reviews: eligibility, categories, moderation queue, reports, owner response, badges. DoD: ineligible student cannot create a review even via direct API call (tested).
9. Compare + commute. DoD: works without a Maps key; no fabricated data.
10. Mess/tiffin: onboarding, listing, search/filter, details, save, eligible food reviews. DoD: RLS/test parity with properties.
11. Admin dashboard: users, owners, properties, rooms, food providers, verification queue, reviews, reports, visit requests, expiry management, basic analytics. DoD: all admin routes/actions server-protected (tested as non-admin).
12. Hardening + testing + Razorpay stub: webhook verification (flag off), rate limiting, CSP review, dependency audit, full E2E for student/owner/admin journeys, secret-leak scan of the client bundle. Required tests: student (signup/login, search, filters, detail, save, compare, enquiry, visit, review authorization); owner (create/edit own, cannot edit another's, photo upload valid/invalid, rooms/beds, enquiries, review response); admin (protected access, verification, moderation, reports); security (anon blocked, cross-owner denied, no unauthorized verified reviews, role immutability, no secrets in bundle, bad webhook signature rejected, bad upload rejected). DoD: all pass.
13. Production prep: README, Supabase + Vercel guides, env table, privacy/terms drafts, 404/500 pages, SEO metadata, sitemap, Lighthouse >=90 (performance/accessibility/best-practices) on home and property pages, final pnpm verify. DoD: fresh clone -> documented steps -> running app; build green.

=== FINAL REPORT (after phase 13) ===
Provide: 1) what was implemented; 2) files created/changed; 3) dependencies; 4) tables/migrations; 5) env vars required; 6) integrations configured vs pending configuration; 7) tests/checks and results; 8) known limitations; 9) exactly what I must configure/provide; 10) how to run locally. Be honest about anything not fully working. Then stop.

BEGIN with STEP 0 now.
