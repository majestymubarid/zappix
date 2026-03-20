# Zappix - The Operating System for WhatsApp TV Businesses

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)

**Zappix** is a comprehensive SaaS platform built for WhatsApp TV owners, agencies, and businesses in Nigeria. It provides all the tools needed to run a professional WhatsApp TV channel — from content scheduling to ad monetization to AI chatbots.

🌐 **Live**: [zappix.ng](https://zappix.ng)  
📧 **Support**: support@zappix.ng

---

## 🚀 Features

### Core Features (Phases 2-6)
- ✅ **Authentication & Billing** - Google OAuth, Paystack subscriptions, plan-based limits
- ✅ **Status Scheduler** - Schedule posts 30 days in advance with bulk upload
- ✅ **Broadcast Engine** - Personalized bulk messaging with smart throttling
- ✅ **Analytics Dashboard** - Real-time metrics, period comparison, export to CSV
- ✅ **Referral System** - 25% lifetime commissions with monthly leaderboard prizes

### Advanced Features (Phases 7-11)
- ✅ **Contact Manager** - CSV import, duplicate detection, lists, tags, smart segments
- ✅ **Team Management** - Role-based access (admin/editor/viewer), activity logging
- ✅ **Ad Slot Manager** - Public booking pages, Paystack payments, performance reports
- ✅ **Chatbot Builder** - Away messages, FAQ, lead capture, order collection
- ✅ **Menu Bot** - Interactive product catalogs with multi-level navigation

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis
- **Auth**: NextAuth.js with Google OAuth
- **Payments**: Paystack (subscriptions, transfers, webhooks)
- **WhatsApp**: @whiskeysockets/baileys
- **Email**: Resend

---

## 📁 Project Structure

```
zappix/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/               # Auth pages (login, signup, onboarding)
│   │   ├── ads/[username]/       # Public ad booking pages
│   │   ├── api/                  # API routes (webhooks, cron jobs, media)
│   │   ├── dashboard/            # Protected dashboard pages
│   │   ├── ref/[slug]/           # Referral landing pages
│   │   ├── features/             # Features showcase
│   │   ├── pricing/              # Pricing page
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact page
│   │   └── legal/                # Legal pages (terms, privacy, refund)
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   └── marketing/            # Marketing components (navbar, footer)
│   ├── lib/                      # Utilities (auth, prisma, redis, phone, utils)
│   └── server/                   # Backend logic
│       ├── bots/                 # Bot engines (chatbot, menu navigation)
│       ├── queues/               # BullMQ workers (status, broadcast)
│       ├── services/             # Business services (storage)
│       └── trpc/                 # tRPC routers and middleware
├── prisma/                       # Database schema and migrations
├── public/                       # Static assets
└── Development Roadmap/          # Phase-by-phase implementation docs
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis server
- Google OAuth credentials
- Paystack account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/majestymubarid/zappix.git
   cd zappix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/zappix"
   REDIS_URL="redis://localhost:6379"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   PAYSTACK_SECRET_KEY="sk_test_xxx"
   NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
   ```

4. **Run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed  # Seeds Creator, Growth, Agency plans
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with plans
npm run db:studio    # Open Prisma Studio
```

---

## 🔄 Cron Jobs (Production)

Set up these cron jobs on your server:

```bash
# Process scheduled status posts (every minute)
* * * * * curl -s https://zappix.ng/api/cron/process-statuses

# Advance warm-up day (daily at midnight WAT)
0 23 * * * curl -s https://zappix.ng/api/cron/warmup

# Aggregate analytics (hourly)
0 * * * * curl -s https://zappix.ng/api/cron/aggregate-analytics

# Release commissions (1st of month)
0 0 1 * * curl -s https://zappix.ng/api/cron/release-commissions

# Check WhatsApp connections (every minute)
* * * * * curl -s https://zappix.ng/api/cron/check-connections
```

---

## 🌐 API Structure

Zappix uses **tRPC** for type-safe API calls. All routers are located in `src/server/trpc/routers/`:

- `user` - User profile and onboarding
- `accounts` - WhatsApp number management
- `scheduler` - Status post scheduling
- `broadcasts` - Bulk message broadcasting
- `analytics` - Metrics and reporting
- `referrals` - Referral tracking and withdrawals
- `contacts` - Contact CRM operations
- `lists` - Contact list management
- `tags` - Contact tags
- `team` - Team member management
- `ads` - Ad slot and booking management
- `bots` - Chatbot configuration
- `menuBots` - Menu bot navigation

---

## 🔐 Authentication

Zappix uses **NextAuth.js** with:
- Google OAuth for sign-in/sign-up
- Database sessions via Prisma adapter
- Protected routes with middleware
- Automatic referral code generation on signup

---

## 💳 Payment Integration

**Paystack** is used for:
- Subscription billing (monthly/yearly)
- Ad booking payments
- Referral commission withdrawals

Webhooks handle:
- `subscription.create` - Activate plan on subscription
- `charge.success` - Credit referral commissions
- `subscription.disable` - Deactivate plan on cancellation
- `transfer.success/failed` - Update withdrawal status

---

## 📊 Database Schema

**13 core models** managed by Prisma:

- **Auth**: User, Account, Session
- **Plans**: Plan
- **WhatsApp**: WhatsappNumber
- **Contacts**: Contact, ContactList, Tag, CustomField
- **Content**: ScheduledStatus, Broadcast
- **Monetization**: AdSlot, AdBooking
- **Automation**: Bot, MenuBot, BotFlow
- **Referrals**: ReferralCode, Referral, Commission, Withdrawal
- **Team**: TeamMember
- **Analytics**: AnalyticsDaily, ActivityLog

---

## 🤖 WhatsApp Integration

Zappix uses **@whiskeysockets/baileys** for WhatsApp Web protocol. Key integration points in `src/server/baileys/manager.ts`:

- `connect(numberId)` - QR code generation and connection
- `sendMessage(numberId, jid, content)` - Send messages
- `postStatus(numberId, content, viewers)` - Post status updates
- `isConnected(numberId)` - Check connection health

---

## 🎯 Key Features Explained

### 21-Day Warm-Up Programme
New WhatsApp numbers are automatically enrolled in a warm-up schedule to avoid bans:
- **Days 0-3**: No sending allowed (connection stabilization)
- **Days 4-7**: Max 50 messages/day
- **Days 8-14**: Max 200 messages/day
- **Days 15-21**: Max 500 messages/day
- **Day 22+**: Full access

### Smart Throttling
Three broadcast speed modes:
- **Safe**: 2.5s delay (warmup numbers, sensitive content)
- **Normal**: 0.8s delay (established numbers, regular broadcasts)
- **Fast**: 0.45s delay (bulk announcements)

Random jitter (±500ms) added to all delays for natural sending patterns.

### Token Personalization
Messages support dynamic tokens:
- `{firstName}`, `{lastName}`, `{fullName}`
- `{city}`, `{phone}`
- `{custom1}`, `{custom2}`
- Fallback syntax: `{firstName|Guest}`

### Opt-Out Detection
Keywords automatically opt contacts out:
- STOP, unsubscribe, no more, remove me, opt out
- Sends confirmation message
- JOIN keyword for resubscribe

---

## 🏗 Architecture

```
┌──────────────────────────────────────┐
│    Frontend (Next.js + React)        │
│    - Server/Client Components        │
│    - tRPC hooks for API calls        │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│    tRPC API Layer (13 routers)       │
│    - Type-safe endpoints             │
│    - Middleware (auth, plan limits)  │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│    Business Logic Layer              │
│    - Queue workers (BullMQ)          │
│    - Bot engines                     │
│    - Plan limits enforcement         │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│    Data Layer                        │
│    - PostgreSQL (Prisma)             │
│    - Redis (queues + cache)          │
│    - File storage (local/volume)     │
└──────────────────────────────────────┘
```

---

## 📝 Environment Variables

See [`.env.example`](.env.example) for all required variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth session secret | Yes |
| `NEXTAUTH_URL` | App URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Yes |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | Yes |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | Yes |
| `MEDIA_PATH` | Media storage path | Yes |
| `RESEND_API_KEY` | Resend email API key | Optional |

---

## 🚀 Deployment

### Server Requirements
- Ubuntu 20.04+ or similar
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- PM2 for process management
- Nginx for reverse proxy

### Deployment Steps

1. **Clone and install on server**
   ```bash
   git clone https://github.com/majestymubarid/zappix.git
   cd zappix
   npm install
   npm run build
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Add production values
   ```

3. **Set up database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start with PM2**
   ```bash
   pm2 start npm --name "zappix" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```nginx
   server {
       server_name zappix.ng www.zappix.ng;
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Set up SSL**
   ```bash
   sudo certbot --nginx -d zappix.ng -d www.zappix.ng
   ```

7. **Configure cron jobs** (see Cron Jobs section above)

---

## 📖 Documentation

Detailed implementation guides for each phase:

- [Phase 1: Foundation & Infrastructure](Development%20Roadmap/PHASE-01-foundation.md)
- [Phase 2: Auth & Billing](Development%20Roadmap/PHASE-02-auth-billing.md)
- [Phase 3: Status Scheduler](Development%20Roadmap/PHASE-03-status-scheduler.md)
- [Phase 4: Broadcast Engine](Development%20Roadmap/PHASE-04-broadcast-engine.md)
- [Phase 5: Analytics](Development%20Roadmap/PHASE-05-analytics.md)
- [Phase 6: Referral System](Development%20Roadmap/PHASE-06-referral-system.md)
- [Phase 7: Contact Manager](Development%20Roadmap/PHASE-07-contact-manager.md)
- [Phase 8: Multi-Account](Development%20Roadmap/PHASE-08-multi-account.md)
- [Phase 9: Ad Slot Manager](Development%20Roadmap/PHASE-09-ad-slot-manager.md)
- [Phase 10: Chatbot Builder](Development%20Roadmap/PHASE-10-chatbot-builder.md)
- [Phase 11: Menu Bot](Development%20Roadmap/PHASE-11-menu-bot.md)

**Progress tracking**: See [`flow.md`](flow.md) for detailed implementation status.

---

## 🔧 Development

### File Structure
```
src/
├── app/                   # Pages and routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── marketing/        # Marketing site components
├── lib/                   # Shared utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── redis.ts          # Redis client
│   ├── phone.ts          # Phone normalization
│   └── utils.ts          # Helper functions
└── server/                # Backend logic
    ├── bots/             # Bot engines
    ├── queues/           # BullMQ workers
    ├── services/         # Business services
    └── trpc/             # tRPC routers
```

### Adding a New Feature

1. **Define database schema** in `prisma/schema.prisma`
2. **Run migration**: `npm run db:migrate`
3. **Create tRPC router** in `src/server/trpc/routers/`
4. **Add to root router** in `src/server/trpc/root.ts`
5. **Create UI pages** in `src/app/`
6. **Use tRPC hooks** in components

---

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build and check for errors
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- WhatsApp integration via [Baileys](https://github.com/WhiskeySockets/Baileys)
- Payments by [Paystack](https://paystack.com/)

---

## 📞 Support

- **Email**: support@zappix.ng
- **Documentation**: https://docs.zappix.ng
- **Issues**: [GitHub Issues](https://github.com/majestymubarid/zappix/issues)

---

**Built with ❤️ for WhatsApp TV owners in Nigeria**
