# ⚡ Zappix — Development Roadmap

> The Operating System for WhatsApp TV Businesses  
> Domain: **zappix.ng**

---

## 📋 Overview

This roadmap is split into **11 phases** across **21 weeks** — from a blank server to a fully launched SaaS product with all 9 features live.

Each phase has its own markdown file with:
- Exact tasks to complete
- Code snippets and commands
- File structures to create
- Acceptance criteria (how to know the phase is done)

---

## 🗂️ Phase Files

| File | Phase | Weeks | Milestone |
|------|-------|-------|-----------|
| [PHASE-01-foundation.md](./PHASE-01-foundation.md) | Foundation & Infrastructure | 1–2 | Hetzner live, Baileys sends test message |
| [PHASE-02-auth-billing.md](./PHASE-02-auth-billing.md) | Auth, Onboarding & Billing | 3–4 | Signup → Pay → Dashboard working |
| [PHASE-03-status-scheduler.md](./PHASE-03-status-scheduler.md) | Status Scheduler | 5–6 | Auto-posting live |
| [PHASE-04-broadcast-engine.md](./PHASE-04-broadcast-engine.md) | Broadcast Engine | 7–8 | Bulk messaging live |
| [PHASE-05-analytics.md](./PHASE-05-analytics.md) | Analytics Dashboard | 9 | Data insights live |
| [PHASE-06-referral-system.md](./PHASE-06-referral-system.md) | Referral System | 10 | Growth engine live |
| [PHASE-07-contact-manager.md](./PHASE-07-contact-manager.md) | Contact Manager | 12–13 | CRM live |
| [PHASE-08-multi-account.md](./PHASE-08-multi-account.md) | Multi-Account Manager | 14–15 | Teams & accounts live |
| [PHASE-09-ad-slot-manager.md](./PHASE-09-ad-slot-manager.md) | Ad Slot Manager | 16–17 | Booking pages & ad delivery live |
| [PHASE-10-chatbot-builder.md](./PHASE-10-chatbot-builder.md) | Chatbot Builder | 18–19 | Automation live |
| [PHASE-11-menu-bot.md](./PHASE-11-menu-bot.md) | WhatsApp Menu Bot | 20–21 | Full product live |

---

## 🚀 Launch Gates

### v1.0 Public Launch — End of Week 11
Phases 1–6 complete. Core product live at zappix.ng with:
- Status Scheduler
- Broadcast Engine  
- Analytics Dashboard
- Referral System
- Founding member pricing active

### v2.0 Full Product — End of Week 21
All 11 phases complete. Every feature live.

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| API | tRPC |
| Database | PostgreSQL 15 (self-hosted on Hetzner) |
| ORM | Prisma |
| Cache/Queues | Redis + BullMQ |
| WhatsApp | Baileys (@whiskeysockets/baileys) |
| Auth | NextAuth v5 + Google OAuth |
| Payments | Paystack |
| Hosting | Hetzner VPS (CX32 → CX42 → CX52) |
| Web Server | Nginx + Certbot (Let's Encrypt) |
| Process Manager | PM2 |
| CI/CD | GitHub Actions |
| Email | Resend |
| Styling | Tailwind CSS + shadcn/ui |

---

## ⚠️ Before You Start

1. Register **zappix.ng** domain
2. Create **Hetzner Cloud** account at hetzner.com
3. Create **Paystack** account at paystack.com
4. Create **Google Cloud Console** project for OAuth credentials
5. Create **Resend** account at resend.com
6. Create **GitHub** repository for the codebase
7. Create **Sentry** account for error monitoring

---

*Built for Nigeria's WhatsApp economy.*
