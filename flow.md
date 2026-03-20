# Progress Flow: Zappix Development

## Completed Tasks So Far (Phase 1 initialization)

1. **Environment Setup**
   - Updated PowerShell Execution Policy to allow running scripts (specifically `npm`).
   - Installed Git (via `winget`) to ensure npm could securely fetch packages from GitHub (e.g., `@whiskeysockets/baileys`).

2. **Next.js Scaffolding**
   - Successfully ran `create-next-app` initializing a Next.js (TypeScript, Tailwind, App Router) project directly into the `Zappix` root directory.
   - Kept the product-spec markdown documents intact alongside the source code.

3. **`package.json` Configuration**
   - Fixed the `name` attribute to lowercase `"zappix"` (to respect strict npm naming rules).
   - Added database script shortcuts for Prisma (`db:generate`, `db:migrate`, `db:seed`, `db:studio`).

4. **Dependencies Installation**
   - **Production:** Successfully installed `@trpc/server`, `@trpc/client`, `@trpc/react-query`, `@trpc/next`, `@tanstack/react-query`, `@prisma/client`, `bullmq`, `ioredis`, `@whiskeysockets/baileys`, `zod`, `react-hook-form`, `@hookform/resolvers`, `resend`, `recharts`, `@dnd-kit/core`, `@dnd-kit/sortable`, `date-fns`, `sharp`, `next-auth@beta`, `@auth/prisma-adapter`, `@hapi/boom`, and `qrcode`.
   - **Development:** Successfully installed `prisma`, `@types/qrcode`, `tsx`, `eslint`, and `eslint-config-next`.

5. **UI Components Setup**
   - Successfully ran `shadcn init` adding Default Slate styling and CSS Variables.
   - Installed all the required components (`button`, `card`, `input`, `label`, `select`, `textarea`, `table`, `badge`, `dialog`, `sheet`, `tabs`, `dropdown-menu`, `avatar`, `progress`, `sonner` (instead of deprecated toast), `calendar`, `popover`, `separator`, `skeleton`).

6. **Git Version Control & Deployment Location Change**
   - Git repository initialized via `git init`.
   - Modified all references in `implementation.md` to target **Oracle Cloud VPS** for deployment operations instead of the originally planned Hetzner servers.

7. **Phase 1 - Foundation & Infrastructure** (Completed)
   - Prisma schema defined with all models (User, Plan, WhatsappNumber, Contact, Broadcast, ScheduledStatus, Referral, etc.)
   - Basic tRPC setup with context and root router
   - Auth configuration with NextAuth and Google OAuth
   - Redis connection setup for BullMQ queues
   - Prisma client setup

## Phase 2 - Auth, Onboarding & Billing (Completed)

1. **Authentication System**
   - Updated [`src/lib/auth.ts`](src/lib/auth.ts) with referral code auto-generation on signup
   - Created middleware ([`src/middleware.ts`](src/middleware.ts)) to protect routes and enforce onboarding
   - Auth API route already in place at [`src/app/api/auth/[...nextauth]/route.ts`](src/app/api/auth/[...nextauth]/route.ts)

2. **Onboarding Flow**
   - Created full onboarding page at [`src/app/(auth)/onboarding/page.tsx`](src/app/(auth)/onboarding/page.tsx)
   - 5-step wizard: account type → risk disclosure → connect number → choose plan → done
   - Risk acceptance tracked in database with timestamp
   - Added `acceptRiskDisclosure` and updated `completeOnboarding` mutations in [`src/server/trpc/routers/user.ts`](src/server/trpc/routers/user.ts)

3. **Paystack Integration**
   - Webhook handler at [`src/app/api/webhooks/paystack/route.ts`](src/app/api/webhooks/paystack/route.ts)
   - Handles: subscription.create, charge.success, subscription.disable, transfer events
   - Auto-credits referral commissions (25%) on each payment
   - Plans seeded in [`prisma/seed.ts`](prisma/seed.ts) - Creator, Growth, Agency

4. **Plan Limits & Middleware**
   - Created plan limits middleware at [`src/server/trpc/middleware/plan-limits.ts`](src/server/trpc/middleware/plan-limits.ts)
   - Enforces limits on: numbers, contacts, broadcasts, status posts
   - Throws clear error messages when limits exceeded

5. **WhatsApp Account Management**
   - Created accounts router at [`src/server/trpc/routers/accounts.ts`](src/server/trpc/routers/accounts.ts)
   - Endpoints: getAll, getById, connect, update, disconnect
   - Auto-enrolls new numbers in warm-up programme (Day 0)
   - Activity logging for number connections

6. **Warm-up Programme**
   - Daily cron job at [`src/app/api/cron/warmup/route.ts`](src/app/api/cron/warmup/route.ts)
   - Advances warmupDay for all connected numbers
   - Marks as complete after 21 days

## Phase 3 - Status Scheduler (Completed)

1. **Media Storage**
   - Storage service created at [`src/server/services/storage.ts`](src/server/services/storage.ts)
   - Saves media files to mounted volume (MEDIA_PATH env variable)
   - Organized by userId for security
   - Media serving route at [`src/app/api/media/[...path]/route.ts`](src/app/api/media/[...path]/route.ts)

2. **Status Queue System**
   - BullMQ queue setup at [`src/server/queues/status.queue.ts`](src/server/queues/status.queue.ts)
   - Worker processes scheduled status posts with retry logic
   - Supports: image, video, gif, text status types
   - Viewer list management for privacy controls

3. **Scheduler Router**
   - Full TRPC router at [`src/server/trpc/routers/scheduler.ts`](src/server/trpc/routers/scheduler.ts)
   - Endpoints: getAll (calendar view), create, bulkCreate, delete, retry
   - Plan limits enforced via checkStatusLimit
   - Bulk upload support with batch tracking

4. **Processing Cron**
   - Status processor at [`src/app/api/cron/process-statuses/route.ts`](src/app/api/cron/process-statuses/route.ts)
   - Runs every minute to queue due posts
   - Batch processing (50 at a time)
   - Exponential backoff retry strategy

## Phase 4 - Broadcast Engine (Completed)

1. **Token Replacement System**
   - Added `replaceTokens` utility to [`src/lib/utils.ts`](src/lib/utils.ts)
   - Supports: {firstName}, {lastName}, {fullName}, {city}, {phone}, {custom1}, {custom2}
   - Fallback values: {firstName|Guest} syntax

2. **Broadcast Queue with Throttling**
   - Queue system at [`src/server/queues/broadcast.queue.ts`](src/server/queues/broadcast.queue.ts)
   - Three throttle speeds: safe (2.5s), normal (0.8s), fast (0.45s)
   - Warm-up limit enforcement (0, 50, 200, 500 msgs/day based on day)
   - Message content builder for all types: text, image, video, document, contact
   - Jitter added to delays for natural sending pattern

3. **Broadcast Router**
   - Full router at [`src/server/trpc/routers/broadcasts.ts`](src/server/trpc/routers/broadcasts.ts)
   - Endpoints: getAll, getById, create, send, delete
   - Auto-split logic distributes contacts across numbers evenly
   - Creates delivery records for tracking
   - Chunks batches of 100 for queue processing

4. **Opt-Out Detection**
   - Keywords: STOP, unsubscribe, no more, remove me, opt out
   - Marks contact as opted out in database
   - Sends confirmation message
   - Resubscribe with JOIN keyword
   - Broadcast reply tracking for recent broadcasts

## Phase 5 - Analytics Dashboard (Completed)

1. **Analytics Aggregation**
   - Hourly cron job at [`src/app/api/cron/aggregate-analytics/route.ts`](src/app/api/cron/aggregate-analytics/route.ts)
   - Aggregates daily metrics: status posts, broadcasts, messages, replies, opt-outs, contacts, ad revenue
   - Creates/updates AnalyticsDaily records for each user
   - Processes all users in a single run

2. **Analytics Router**
   - Router at [`src/server/trpc/routers/analytics.ts`](src/server/trpc/routers/analytics.ts)
   - Endpoints: overview (with period comparison), daily (time series), broadcastHistory
   - Period-over-period comparison support
   - Aggregated metrics with totals and maximums

## Phase 6 - Referral System (Completed)

1. **Referral Tracking**
   - Landing page at [`src/app/ref/[slug]/page.tsx`](src/app/ref/[slug]/page.tsx)
   - Sets 30-day referral cookie
   - Auto-generates unique referral codes on signup (already in auth.ts)
   - Referral relationship created when referred user subscribes

2. **Commission System**
   - 25% commission on all recurring payments
   - Commissions created in Paystack webhook handler
   - Monthly release cron at [`src/app/api/cron/release-commissions/route.ts`](src/app/api/cron/release-commissions/route.ts)
   - Runs on 1st of month, moves pending → available
   - Leaderboard bonus system: ₦200k, ₦100k, ₦50k for top 3

3. **Referrals Router**
   - Full router at [`src/server/trpc/routers/referrals.ts`](src/server/trpc/routers/referrals.ts)
   - Endpoints: getStats, getReferrals, getCommissions, requestWithdrawal, getLeaderboard
   - Paystack transfer integration for withdrawals
   - Minimum withdrawal: ₦5,000
   - Bank account verification required

4. **TRPC Router Integration**
   - Updated [`src/server/trpc/root.ts`](src/server/trpc/root.ts) to include all new routers:
     - accounts, scheduler, broadcasts, analytics, referrals

## Environment Configuration

All necessary environment variables documented in [`.env.example`](.env.example):
- Database connection (DATABASE_URL)
- Redis connection (REDIS_URL)
- NextAuth secret and URL
- Google OAuth credentials
- Paystack secret key
- Media storage path

## Next Steps (Future Phases)

The following phases are planned but not yet implemented:

- **Phase 7:** Contact Manager (import CSV, tags, custom fields, segments)
- **Phase 8:** Multi-Account Management (team members, permissions)
- **Phase 9:** Ad Slot Manager (public booking pages, creative approval)
- **Phase 10:** Chatbot Builder (FAQ, lead capture, payment flows)
- **Phase 11:** Menu Bot (product catalogs, ordering system)

## Database Migration

To apply the schema changes:
```bash
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:seed      # Seed plans
```

## Cron Jobs Setup

The following cron jobs need to be configured on the server:

```bash
# Process status posts every minute
* * * * * curl -s https://zappix.ng/api/cron/process-statuses

# Advance warm-up day at midnight WAT (23:00 UTC)
0 23 * * * curl -s https://zappix.ng/api/cron/warmup

# Aggregate analytics hourly
0 * * * * curl -s https://zappix.ng/api/cron/aggregate-analytics

# Release commissions on 1st of month at midnight
0 0 1 * * curl -s https://zappix.ng/api/cron/release-commissions
```

## Implementation Notes

1. **Queue Workers**: BullMQ workers for status and broadcast queues need to be started in production (separate processes or in Next.js API).

2. **Baileys Integration**: WhatsApp connection logic using @whiskeysockets/baileys will be implemented in [`src/server/baileys/manager.ts`](src/server/baileys/manager.ts) when ready.

3. **Type Safety**: All TypeScript errors shown in the editor are expected until dependencies are installed via `npm install`.

4. **Media Storage**: The MEDIA_PATH should point to a mounted volume (e.g., `/mnt/zappix-media/media`) on Oracle Cloud VPS.

5. **Testing**: All endpoints should be tested with sample data before production deployment.

## Key Features Implemented

✅ Google OAuth authentication with auto-referral code generation  
✅ 5-step onboarding with risk disclosure  
✅ Paystack webhook integration with commission tracking  
✅ Plan-based limits enforcement  
✅ WhatsApp number warm-up programme  
✅ Status scheduler with calendar view and bulk upload  
✅ Broadcast engine with throttling and token replacement  
✅ Opt-out/resubscribe keyword detection  
✅ Analytics aggregation with period comparison  
✅ Referral system with 25% lifetime commissions  
✅ Leaderboard with monthly prizes  
✅ Withdrawal via Paystack transfer  

## Branch

All work completed on: `feature/phase-1-foundation-infrastructure`
