# Zappix - The Operating System for WhatsApp TV Businesses

**Run your WhatsApp TV like a real media company.**

Zappix is a comprehensive platform for WhatsApp TV businesses to schedule posts, automate broadcasts, sell ad slots, and grow their audience.

## 🚀 Project Status

**Current Phase:** Phase 1 - Foundation & Infrastructure ✅

This implementation includes:
- ✅ Complete database schema (30+ models)
- ✅ Next.js 14 with App Router
- ✅ tRPC for type-safe APIs
- ✅ NextAuth v5 for authentication
- ✅ Baileys WhatsApp manager
- ✅ BullMQ queue infrastructure
- ✅ Landing, auth, and dashboard pages

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| API | tRPC (end-to-end type safety) |
| ORM | Prisma → PostgreSQL 15 |
| Cache / Queues | Redis + BullMQ |
| WhatsApp | Baileys (@whiskeysockets/baileys) |
| Auth | NextAuth v5 + Google OAuth |
| Payments | Paystack |
| Email | Resend |
| Charts | Recharts |

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis
- Google OAuth credentials (for authentication)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
   
   Then edit `.env` and fill in your credentials:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
   - `REDIS_URL` - Redis connection string
   - Other API keys as needed

4. **Set up the database**
   ```bash
   # Run migrations
   npm run db:migrate
   
   # Generate Prisma client
   npm run db:generate
   
   # Seed initial data (plans)
   npm run db:seed
   ```

5. **Create storage directories**
   ```bash
   mkdir -p storage/{media,sessions,exports}
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
zappix/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Auth pages (login, signup)
│   │   ├── (marketing)/         # Public pages
│   │   ├── api/                 # API routes
│   │   │   ├── auth/            # NextAuth routes
│   │   │   └── trpc/            # tRPC routes
│   │   ├── dashboard/           # Dashboard pages
│   │   └── layout.tsx           # Root layout
│   ├── server/
│   │   ├── trpc/                # tRPC configuration
│   │   │   ├── routers/         # tRPC routers
│   │   │   ├── context.ts       # tRPC context
│   │   │   └── trpc.ts          # tRPC setup
│   │   ├── baileys/             # WhatsApp Baileys manager
│   │   └── queues/              # BullMQ queues
│   ├── lib/
│   │   ├── prisma.ts            # Prisma client
│   │   ├── redis.ts             # Redis client
│   │   ├── auth.ts              # NextAuth config
│   │   └── trpc/                # tRPC client
│   └── components/
│       └── ui/                  # shadcn/ui components
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Database seeding
├── .env.example                 # Environment variables template
└── package.json
```

## 🗺️ Development Roadmap

### Phase 1: Foundation & Infrastructure ✅ (Current)
- Server setup and deployment
- Database schema and migrations
- Authentication (Google OAuth)
- Basic pages and routing
- Baileys WhatsApp manager

### Phase 2: Auth, Onboarding & Billing (Weeks 3-4)
- Complete onboarding flow
- Paystack integration
- Plan limits middleware
- Warm-up auto-enrollment

### Phase 3: Status Scheduler (Weeks 5-6)
- Media upload service
- Status scheduling queue
- Calendar UI
- Bulk upload

### Phase 4: Broadcast Engine (Weeks 7-8)
- Broadcast queue with throttling
- Token replacement
- Opt-out handling
- Broadcast analytics

### Phase 5: Analytics Dashboard (Week 9)
- KPI cards with period comparison
- Activity charts (Recharts)
- CSV/PDF exports

### Phase 6: Referral System (Week 10)
- Referral links and tracking
- Commission calculation
- Bank account withdrawal via Paystack

**🎉 v1.0 Public Launch - Week 11**

### Phase 7-11: Additional Features (Weeks 12-21)
- Contact Manager (CRM)
- Multi-Account Manager
- Ad Slot Manager (Killer Feature)
- Chatbot Builder
- WhatsApp Menu Bot

**🏁 v2.0 Full Product - Week 21**

## 🔒 Environment Variables

See [`.env.example`](.env.example) for all required environment variables.

**Critical variables:**
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_SECRET` - Auth secret key
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `REDIS_URL` - Redis connection
- `PAYSTACK_SECRET_KEY` - Paystack API key
- `RESEND_API_KEY` - Email service

## 🧪 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

## 📦 Key Dependencies

- **next** - React framework
- **@trpc/server** & **@trpc/client** - Type-safe APIs
- **@prisma/client** - Database ORM
- **next-auth** - Authentication
- **@whiskeysockets/baileys** - WhatsApp Web API
- **bullmq** - Background job processing
- **ioredis** - Redis client
- **tailwindcss** - Utility-first CSS
- **shadcn/ui** - UI components
- **zod** - Schema validation

## 🚧 Development Notes

### Database Migrations

When making schema changes:

```bash
# Create a new migration
npm run db:migrate

# Reset database (dev only)
npx prisma migrate reset
```

### WhatsApp Sessions

WhatsApp sessions are stored in `./storage/sessions/`. These files contain authentication credentials and should never be committed to git.

### Queue Management

BullMQ queues are defined in `src/server/queues/index.ts`. Workers for each queue will be implemented in their respective phases.

## 📝 License

Copyright © 2026 Zappix. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

**Built with ❤️ for WhatsApp TV businesses**
