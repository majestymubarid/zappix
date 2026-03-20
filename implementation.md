Zappix — Detailed Build Plan
The Operating System for WhatsApp TV Businesses · zappix.ng

Project Status
There is no source code yet — the project consists only of:

zappix-product-spec-v3-1.md
 — 1,462-line product specification
Development Roadmap/
 — 12 files covering 11 phases across 21 weeks, with code snippets and acceptance criteria
The roadmap files already contain implementation-level detail (Prisma schemas, tRPC routers, BullMQ workers, Baileys manager code). This plan organises that material into an actionable build sequence.

Tech Stack
Layer	Technology
Framework	Next.js 14 (App Router) + TypeScript
Styling	Tailwind CSS + shadcn/ui
API	tRPC (end-to-end type safety)
ORM	Prisma → PostgreSQL 15
Cache / Queues	Redis + BullMQ
WhatsApp	Baileys (@whiskeysockets/baileys)
Auth	NextAuth v5 + Google OAuth
Payments	Paystack (subscriptions + one-time charges + transfers)
Email	Resend
Hosting	Oracle Cloud VPS + Nginx + PM2 + Certbot
CI/CD	GitHub Actions
Charts	Recharts
Monitoring	Sentry
Build Phases — What to Do, In Order
Phase 1 · Foundation & Infrastructure (Weeks 1–2)
Goal: Server live, project deployed, WhatsApp connection working.

#	Task	Details
1.1	Provision Oracle Cloud Compute	Ubuntu 24.04, public IPv4, backups enabled
1.2	Create 50 GB Oracle Block Volume	Mount at /mnt/zappix-media, create media/, sessions/, exports/, backups/
1.3	Configure firewall	TCP 22 (your IP), 80/443 (any). Never expose 5432/6379
1.4	Point zappix.ng DNS	A records for @ and www → server IP
1.5	Install server stack	Node.js 20, PostgreSQL 15, Redis, Nginx, PM2, Certbot, Git, build-essential
1.6	Create zappix app user	Non-root, owns /mnt/zappix-media
1.7	Set up PostgreSQL	Create zappix DB + zappix_user, local-only access
1.8	Scaffold Next.js project	create-next-app with TypeScript, Tailwind, App Router, src dir
1.9	Install all npm dependencies	tRPC, Prisma, NextAuth, BullMQ, Baileys, Zod, Recharts, shadcn/ui, etc.
1.10	Create full Prisma schema	30+ models covering all 9 features — see 
PHASE-01
1.11	Build Baileys connection manager	WhatsAppManager singleton — QR connect, send message, post status, reconnect, disconnect
1.12	Set up .env	DATABASE_URL, NEXTAUTH_SECRET, Google OAuth, Redis, Paystack, Resend, media paths
1.13	Configure Nginx + SSL	Reverse proxy → localhost:3000, WebSocket support, Certbot for HTTPS
1.14	Set up GitHub Actions CI/CD	SSH deploy: git pull → npm ci → prisma migrate → npm run build → pm2 restart
1.15	Set up daily DB backup cron	pg_dump at 2AM, 7-day retention to Oracle Block Volume
1.16	Run first migration + test Baileys	Verify QR scan connects, test message sends, test status posts
Acceptance: https://zappix.ng loads, CI/CD deploys, Baileys connects and sends.

Phase 2 · Auth, Onboarding & Billing (Weeks 3–4)
Goal: Complete user entry funnel: signup → onboarding → pay → dashboard.

#	Task	Details
2.1	Configure Google OAuth	Cloud Console project, OAuth consent screen, redirect URI
2.2	Set up NextAuth v5	PrismaAdapter, Google provider, auto-create referral code on first login
2.3	Build login page	/login — Google sign-in button
2.4	Build signup page	/signup — Google sign-in + referral code field
2.5	Build 5-step onboarding	Account type → Risk disclosure → Connect number (QR) → Choose plan → Done
2.6	Create Paystack plans	6 plans (3 tiers × monthly/yearly), seed into DB
2.7	Build Paystack webhook handler	subscription.create, charge.success, subscription.disable, transfer.success/failed
2.8	Build plan limits middleware	checkNumberLimit, checkContactLimit, checkBroadcastLimit
2.9	Build auth route middleware	Protect /app/*, redirect authenticated users away from /login
2.10	Build warm-up auto-enrolment	New numbers start Day 0, daily cron advances warmupDay, completes at Day 21
Acceptance: Full Google OAuth → onboarding → Paystack payment → dashboard redirect working.

Phase 3 · Status Scheduler (Weeks 5–6)
Goal: Schedule and auto-post WhatsApp Status updates.

#	Task	Details
3.1	Build media upload service	Save to Hetzner Volume, serve via authenticated API route
3.2	Build BullMQ status queue	Worker posts status via Baileys with retry (3 attempts, exponential backoff)
3.3	Build scheduler cron	Every-minute cron finds due posts, queues them
3.4	Build tRPC scheduler router	getAll (calendar data), create, bulkCreate, delete, retry
3.5	Build Calendar UI	/app/scheduler — month/week/day view with thumbnails, content gap highlighting
3.6	Build Single Post page	/app/scheduler/new — media upload, caption, datetime picker, number selector
3.7	Build Bulk Upload page	/app/scheduler/bulk — multi-file upload, draggable grid, auto-time assignment
Acceptance: Single + bulk posts appear in calendar. Cron auto-posts via Baileys at scheduled time.

Phase 4 · Broadcast Engine (Weeks 7–8)
Goal: Bulk messaging with throttling, warm-up protection, and opt-out handling.

#	Task	Details
4.1	Build broadcast BullMQ queue	3 throttle modes (Safe/Normal/Fast), warm-up limits, auto-split across numbers
4.2	Build token replacement utility	{firstName}, {lastName}, {fullName}, {city}, {custom1} with fallbacks
4.3	Build opt-out detection	Listen for STOP/unsubscribe keywords, auto-reply confirmation, track in DB
4.4	Build broadcast tRPC router	Create draft, send (with contact distribution + queue batching), get report
4.5	Build Broadcasts List page	/app/broadcasts — status pills, filters
4.6	Build Broadcast Composer	/app/broadcasts/new — 5-step wizard (type → compose → audience → numbers → schedule)
4.7	Build Broadcast Report	/app/broadcasts/[id] — sent/failed/replies/opt-outs chart + per-contact list
Acceptance: 5-step composer works. Throttle delays visible. Warm-up enforced. Opt-out works end-to-end.

Phase 5 · Analytics Dashboard (Week 9)
Goal: Data insights with KPIs, charts, period comparison, and exports.

#	Task	Details
5.1	Build analytics aggregation cron	Hourly job upserts AnalyticsDaily per user
5.2	Build analytics tRPC router	overview (with period comparison), daily, broadcastHistory
5.3	Build Analytics Overview	/app/analytics — 6 KPI cards, period selector, activity chart (Recharts)
5.4	Build Status Analytics	/app/analytics/status — estimated reach, posts list, best time analysis
5.5	Build Broadcast Analytics	/app/analytics/broadcasts — delivery/reply/opt-out trends
5.6	Build Audience Growth	/app/analytics/audience — contact growth area chart, list breakdown
5.7	Build Revenue Analytics	/app/analytics/revenue — ad revenue bars, top clients
5.8	Build CSV/PDF export	CSV for Growth+, PDF for Agency
Acceptance: KPIs correct with up/down arrows. Charts render. CSV downloads. Cron runs hourly.

Phase 6 · Referral System (Week 10)
Goal: Referral links, commission tracking, leaderboard, and bank withdrawals.

#	Task	Details
6.1	Build referral landing page	/ref/[slug] — sets 30-day cookie, shows invite UI
6.2	Track referrals on signup	Read cookie in NextAuth callback, create Referral record
6.3	Build monthly commission cron	1st of month: release pending → available, calculate leaderboard prizes
6.4	Build withdrawal via Paystack	Transfer API, bank account verification, withdrawal records
6.5	Build Referral Dashboard	/app/referrals — wallet, link/code copy, stats, referrals table, leaderboard
6.6	Build Withdrawal page	/app/referrals/withdraw — amount input, bank details, transaction history
6.7	Build Leaderboard page	/app/referrals/leaderboard — top 50, current rank, monthly prizes
Acceptance: Full ref link → signup → commission → withdrawal → Paystack transfer flow works.

🎉 v1.0 PUBLIC LAUNCH — Week 11
Phases 1–6 complete. 4 core features + referral + founding pricing live at zappix.ng.

Launch checklist:

All 4 core features QA tested end-to-end
Ban Risk Management fully active (warm-up, throttle, health monitor)
Risk disclosure shown and logged during onboarding
Oracle Cloud Compute + Nginx + SSL live
PostgreSQL, Redis, PM2 stable
GitHub Actions CI/CD deploying
Paystack live mode enabled — all 3 plans active
Founding member discount active (first 100 signups)
Marketing landing page live with 3-pillar structure
Sentry error monitoring installed
Phase 7 · Contact Manager (Weeks 12–13)
Goal: Lightweight CRM for organising WhatsApp contacts.

Manual entry, CSV import (up to 50K rows), bot auto-capture
Contact Lists, Tags, Custom Fields (up to 10), Smart Segments
Duplicate detection and merge
Bulk actions — add to list, tag, export, delete
Pages: /app/contacts, /app/contacts/[id], /app/contacts/import, /app/contacts/lists, /app/contacts/segments, /app/contacts/duplicates
Phase 8 · Multi-Account Manager (Weeks 14–15)
Goal: Manage multiple WhatsApp numbers with team roles.

QR code connection flow, number health dashboard
Team roles: Admin, Editor, Viewer with permission enforcement
Activity log for audit trail
Pages: /app/accounts, /app/accounts/new, /app/accounts/[id], /app/accounts/team, /app/accounts/activity
Phase 9 · Ad Slot Manager (Weeks 16–17) — ⭐ Killer Feature
Goal: Public booking pages where brands book, pay, and schedule ads.

Ad slot types: Status, Broadcast, Combo
Public booking page at zappix.ng/ads/[username] (no auth required)
Paystack one-time charge for ad bookings
Owner approval flow for creatives
Auto-delivery via BullMQ queue at scheduled time
Performance report auto-emailed to client 24hrs after delivery
Revenue dashboard with slot utilisation heatmap
Pages: zappix.ng/ads/[username], /app/ads, /app/ads/slots, /app/ads/slots/new, /app/ads/bookings, /app/ads/bookings/[id], /app/ads/revenue
Phase 10 · Chatbot Builder (Weeks 18–19)
Goal: Form-based chatbot builder — no code required.

Away Message (auto-reply with schedule)
Menu Bot (numbered/keyword navigation)
FAQ Bot (keyword-triggered answers, up to 100 entries)
Payment Link Sender (auto-send Paystack link on trigger)
Lead Capture & Order Collection conversational flows
Pages: /app/bots, /app/bots/[id], /app/bots/[id]/submissions
Phase 11 · WhatsApp Menu Bot (Weeks 20–21)
Goal: Interactive self-service storefront via WhatsApp.

Product Catalogue with categories, prices, descriptions
Service Menu with pricing and turnaround
Download Hub — auto-send PDFs, price lists, catalogues
Multi-level submenus (up to 3 levels deep)
Pages: /app/menu-bots, /app/menu-bots/[id]
🏁 v2.0 FULL PRODUCT — End of Week 21. All 9 features live.

Marketing & Public Pages (Built Across Phases)
Page	When to Build
Landing page (zappix.ng)	Phase 1 (placeholder) → Phase 6 (full 3-pillar page)
Pricing page (/pricing)	Phase 2 (with plans and founding discount)
Features page (/features)	Phase 3+ (add screenshots as features ship)
Blog (/blog)	Post-launch (SEO content)
About, Contact	Phase 2
Legal (Terms, Privacy, Refund)	Phase 2
Database Architecture Summary
The Prisma schema contains 30+ models across these domains:

Domain	Models
Auth	User, Account, Session
Plans	Plan
WhatsApp	WhatsappNumber
Contacts	Contact, ContactList, ContactListMember, Tag, ContactTag, CustomField, ContactCustomValue
Status	ScheduledStatus, StatusTargetNumber
Broadcasts	Broadcast, BroadcastNumber, BroadcastAudience, BroadcastDelivery, BroadcastReply, OptOut
Ads	AdSlot, AdSlotNumber, AdBooking, AdDelivery
Bots	Bot, AwayMessage, BotMenu, MenuItem, FaqEntry, BotFlow, BotSession, BotSubmission
Menu Bot	MenuBot, MenuBotItem
Referrals	ReferralCode, Referral, Commission, BankAccount, Withdrawal
Teams	TeamMember
Analytics	AnalyticsDaily
Activity	ActivityLog
Background Jobs (BullMQ Queues)
Queue	Trigger	Concurrency
status-posts	Cron every minute	3
broadcasts	Manual send or scheduled time	4
ad-delivery	Approved booking reaches scheduled date	2
Cron Jobs
Job	Schedule	Endpoint
Process due status posts	Every minute	/api/cron/process-statuses
Advance warm-up days	Daily 23:00 UTC	/api/cron/warmup
Aggregate analytics	Hourly	/api/cron/aggregate-analytics
Release commissions	1st of month	/api/cron/release-commissions
Database backup	Daily 2AM	Shell script on server
Brand Guidelines (For UI Implementation)
Element	Value
Primary colour	#16A34A (Zappix Green)
Hover/success	#22C55E
Card backgrounds	#F0FDF4
App background	#F8FAFC
Text primary	#0F172A
Text secondary	#334155
Display font	Fraunces (serif, 800-900) — headings, KPIs
UI font	Nunito (sans-serif, 400-800) — body, buttons, nav
Key Risks & Mitigations
Risk	Mitigation
WhatsApp account bans	Full Ban Risk Management: 21-day warm-up, smart throttle (Safe/Normal/Fast), anti-pattern detection, number health monitor, mandatory risk disclosure
High RAM usage from Baileys	~150-250 MB per connection. CX32 (8 GB) supports ~10 numbers. Scale to CX42/CX52 as users grow
Paystack webhook reliability	Verify signatures, idempotent handlers, log all events
Recommended Build Order for a Solo Developer
IMPORTANT

The existing roadmap is excellent and well-sequenced. Follow Phases 1–6 in order to reach v1.0 launch. Focus on one phase at a time rather than trying to build everything in parallel.

Start local — scaffold Next.js, set up Prisma schema, build pages with mock data
Deploy early — get the Oracle Cloud server and CI/CD working in Phase 1
Ship incrementally — each phase produces working, testable features
Test with real WhatsApp — connect a test number in Phase 1 and keep it connected throughout development
Verification Plan
Since there is no existing codebase or tests, verification will happen as each phase is built:

Automated
Prisma migrations: npx prisma migrate dev must complete without errors after schema creation
TypeScript compilation: npm run build must succeed with no type errors
Lint: ESLint/Next.js linting must pass
Manual (Per Phase)
Phase 1: Visit https://zappix.ng → page loads with valid SSL. Scan QR code → WhatsApp connects. Send test message → message delivered.
Phase 2: Click "Sign in with Google" → OAuth flow completes. Walk through 5 onboarding steps. Paystack payment → plan assigned in DB.
Phase 3–11: Each phase has explicit acceptance criteria in its roadmap file — use those as the test plan.
TIP

Each phase file contains a ✅ Phase X Complete When checklist at the bottom — use those as your definition of done.


Comment
Ctrl+Alt+M
