# Phase 2 — Auth, Onboarding & Billing
**Weeks 3–4 | "Get users in the door"**

> At the end of this phase: A user can sign up with Google, go through onboarding, connect a WhatsApp number, choose a plan, and pay via Paystack. The full entry funnel is working end-to-end.

---

## ✅ Acceptance Criteria
- [ ] Google OAuth sign-in and sign-up working at zappix.ng/login
- [ ] New user lands on onboarding after first login
- [ ] Onboarding: account type → connect number → choose plan → done
- [ ] Risk disclosure shown and checkbox acceptance logged to database
- [ ] QR code scan flow working in onboarding (connects real WhatsApp number)
- [ ] Warm-up programme starts automatically on number connection
- [ ] Paystack subscription created on plan selection
- [ ] Paystack webhook updates user plan in database
- [ ] Plan limits enforced — user on Creator plan cannot exceed 2 numbers
- [ ] Billing page shows current plan and payment history
- [ ] User lands on /app/dashboard after completing onboarding

---

## Step 1 — Configure Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → "Zappix"
3. **APIs & Services** → **OAuth consent screen**
   - User Type: External
   - App name: Zappix
   - Support email: your email
   - Authorised domain: `zappix.ng`
4. **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: Web application
   - Authorised redirect URIs: `https://zappix.ng/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret** to your `.env`

---

## Step 2 — NextAuth Configuration

Create `src/lib/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
    async signIn({ user }) {
      // Auto-create referral code on first signup
      const existing = await prisma.referralCode.findUnique({
        where: { userId: user.id! },
      })
      if (!existing && user.id) {
        const slug = generateSlug(user.name || user.email || user.id)
        await prisma.referralCode.create({
          data: {
            userId: user.id,
            code: slug.toUpperCase(),
            linkSlug: slug,
          },
        })
      }
      return true
    },
  },
  pages: {
    signIn: '/login',
    newUser: '/onboarding',
  },
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 12) + Math.random().toString(36).slice(2, 6)
}
```

---

## Step 3 — Auth API Route

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

---

## Step 4 — Login & Signup Pages

Create `src/app/(auth)/login/page.tsx`:

```typescript
'use client'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your Zappix account</p>
        </div>
        <Button
          onClick={() => signIn('google', { callbackUrl: '/app/dashboard' })}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          Continue with Google
        </Button>
        <p className="text-center text-sm text-gray-500 mt-4">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-green-600 font-semibold">Start free trial</a>
        </p>
      </div>
    </div>
  )
}
```

---

## Step 5 — Onboarding Flow

Create `src/app/(auth)/onboarding/page.tsx`:

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc/client'

const STEPS = ['account-type', 'risk-disclosure', 'connect-number', 'choose-plan', 'done']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [accountType, setAccountType] = useState('')
  const router = useRouter()

  const completeOnboarding = trpc.user.completeOnboarding.useMutation({
    onSuccess: () => router.push('/app/dashboard'),
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-lg p-8">

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-green-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {/* Step 1 — Account Type */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">What best describes you?</h2>
            <p className="text-gray-500 mb-6">This helps us set up your account correctly.</p>
            <div className="grid gap-3">
              {[
                { id: 'whatsapp_tv', label: '📺 WhatsApp TV Owner', desc: 'I run a WhatsApp TV channel and sell ad slots' },
                { id: 'business', label: '🏢 Business Owner', desc: 'I use WhatsApp to sell products or services' },
                { id: 'agency', label: '🏛️ Agency / Marketer', desc: 'I manage WhatsApp accounts for multiple clients' },
              ].map(type => (
                <button key={type.id}
                  onClick={() => { setAccountType(type.id); setStep(1) }}
                  className="text-left p-4 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all">
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Risk Disclosure */}
        {step === 1 && (
          <RiskDisclosureStep onAccept={() => setStep(2)} />
        )}

        {/* Step 3 — Connect Number */}
        {step === 2 && (
          <ConnectNumberStep onConnected={() => setStep(3)} onSkip={() => setStep(3)} />
        )}

        {/* Step 4 — Choose Plan */}
        {step === 3 && (
          <ChoosePlanStep onSelected={() => setStep(4)} />
        )}

        {/* Step 5 — Done */}
        {step === 4 && (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
            <p className="text-gray-500 mb-6">Your Zappix account is ready. Let&apos;s grow your WhatsApp TV.</p>
            <button
              onClick={() => completeOnboarding.mutate({ accountType })}
              className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700">
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Risk Disclosure Component
function RiskDisclosureStep({ onAccept }: { onAccept: () => void }) {
  const [accepted, setAccepted] = useState(false)
  const acceptRisk = trpc.user.acceptRiskDisclosure.useMutation({
    onSuccess: onAccept,
  })

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">⚠️ Important — Please Read</h2>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-gray-700 space-y-2">
        <p>Zappix connects to WhatsApp using the WhatsApp Web protocol — the same technology that powers WhatsApp Web on your browser.</p>
        <p><strong>Please understand:</strong></p>
        <ul className="list-disc pl-4 space-y-1">
          <li>WhatsApp may restrict or ban numbers used with third-party tools</li>
          <li>Zappix is not responsible for account bans</li>
          <li>Use established numbers (12+ months old) for best results</li>
          <li>New numbers must complete our 21-day warm-up programme</li>
          <li>Never use Zappix to send spam or unsolicited messages</li>
        </ul>
      </div>
      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 accent-green-600" />
        <span className="text-sm text-gray-700">
          I understand the risks and agree to use Zappix responsibly. I accept the{' '}
          <a href="/legal/terms" target="_blank" className="text-green-600 underline">Terms of Service</a>.
        </span>
      </label>
      <button
        disabled={!accepted || acceptRisk.isPending}
        onClick={() => acceptRisk.mutate()}
        className="w-full bg-green-600 text-white py-3 rounded-full font-bold disabled:opacity-50 hover:bg-green-700">
        {acceptRisk.isPending ? 'Saving...' : 'I Understand — Continue →'}
      </button>
    </div>
  )
}
```

---

## Step 6 — Paystack Plans Setup

In your Paystack dashboard, create these subscription plans:

| Plan Code | Name | Amount | Interval |
|-----------|------|--------|----------|
| PLN_creator_monthly | Creator Monthly | ₦15,000 | monthly |
| PLN_creator_yearly | Creator Yearly | ₦150,000 | annually |
| PLN_growth_monthly | Growth Monthly | ₦35,000 | monthly |
| PLN_growth_yearly | Growth Yearly | ₦350,000 | annually |
| PLN_agency_monthly | Agency Monthly | ₦75,000 | monthly |
| PLN_agency_yearly | Agency Yearly | ₦750,000 | annually |

Seed these into your database:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const plans = [
    {
      id: 'creator',
      name: 'creator',
      monthlyPrice: 1500000,    // ₦15,000 in kobo
      yearlyPrice: 15000000,
      founderMonthlyPrice: 1200000,
      founderYearlyPrice: 12000000,
      maxNumbers: 2,
      maxContacts: 10000,
      maxBroadcastsMonth: 20,
      maxStatusMonth: 60,
      maxTeamMembers: 1,
      maxAdSlots: 3,
      storageGb: 5,
      hasAdvancedBot: false,
      hasApiAccess: false,
      hasFullAnalytics: false,
      hasCsvExport: false,
      hasPdfExport: false,
      paystackPlanCode: 'PLN_creator_monthly',
      paystackYearlyCode: 'PLN_creator_yearly',
    },
    {
      id: 'growth',
      name: 'growth',
      monthlyPrice: 3500000,
      yearlyPrice: 35000000,
      founderMonthlyPrice: 2900000,
      founderYearlyPrice: 29000000,
      maxNumbers: 10,
      maxContacts: 100000,
      maxBroadcastsMonth: 200,
      maxStatusMonth: 500,
      maxTeamMembers: 5,
      maxAdSlots: 20,
      storageGb: 20,
      hasAdvancedBot: true,
      hasApiAccess: false,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: false,
      paystackPlanCode: 'PLN_growth_monthly',
      paystackYearlyCode: 'PLN_growth_yearly',
    },
    {
      id: 'agency',
      name: 'agency',
      monthlyPrice: 7500000,
      yearlyPrice: 75000000,
      founderMonthlyPrice: 6500000,
      founderYearlyPrice: 65000000,
      maxNumbers: null,
      maxContacts: null,
      maxBroadcastsMonth: null,
      maxStatusMonth: null,
      maxTeamMembers: null,
      maxAdSlots: null,
      storageGb: 100,
      hasAdvancedBot: true,
      hasApiAccess: true,
      hasFullAnalytics: true,
      hasCsvExport: true,
      hasPdfExport: true,
      paystackPlanCode: 'PLN_agency_monthly',
      paystackYearlyCode: 'PLN_agency_yearly',
    },
  ]

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    })
  }
  console.log('Plans seeded')
}

main()
```

---

## Step 7 — Paystack Webhook Handler

Create `src/app/api/webhooks/paystack/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  // Verify webhook authenticity
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex')

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  switch (event.event) {
    case 'subscription.create':
      await handleSubscriptionCreate(event.data)
      break
    case 'charge.success':
      await handleChargeSuccess(event.data)
      break
    case 'subscription.disable':
      await handleSubscriptionDisable(event.data)
      break
    case 'transfer.success':
      await handleTransferSuccess(event.data)
      break
    case 'transfer.failed':
      await handleTransferFailed(event.data)
      break
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionCreate(data: any) {
  const userEmail = data.customer.email
  const planCode = data.plan.plan_code

  const plan = await prisma.plan.findFirst({
    where: {
      OR: [
        { paystackPlanCode: planCode },
        { paystackYearlyCode: planCode },
      ],
    },
  })

  if (plan) {
    await prisma.user.update({
      where: { email: userEmail },
      data: { planId: plan.id },
    })

    // Credit referral commission if applicable
    await creditReferralCommission(userEmail, plan)
  }
}

async function handleChargeSuccess(data: any) {
  // Handle recurring charge — trigger new commission for referrer
  const userEmail = data.customer.email
  const planCode = data.plan?.plan_code

  if (planCode) {
    const plan = await prisma.plan.findFirst({
      where: {
        OR: [
          { paystackPlanCode: planCode },
          { paystackYearlyCode: planCode },
        ],
      },
    })

    if (plan) {
      await creditReferralCommission(userEmail, plan)
    }
  }
}

async function handleSubscriptionDisable(data: any) {
  const userEmail = data.customer.email
  await prisma.user.update({
    where: { email: userEmail },
    data: { planId: null },
  })
}

async function handleTransferSuccess(data: any) {
  await prisma.withdrawal.updateMany({
    where: { paystackTransferId: data.transfer_code },
    data: { status: 'completed', completedAt: new Date() },
  })
}

async function handleTransferFailed(data: any) {
  await prisma.withdrawal.updateMany({
    where: { paystackTransferId: data.transfer_code },
    data: { status: 'failed' },
  })
}

async function creditReferralCommission(userEmail: string, plan: any) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } })
  if (!user) return

  const referral = await prisma.referral.findUnique({
    where: { referredUserId: user.id },
  })
  if (!referral || referral.status !== 'active') return

  const commission = Math.floor(plan.monthlyPrice * 0.25)
  const month = new Date().toISOString().slice(0, 7) // "2026-03"

  await prisma.commission.create({
    data: {
      referralId: referral.id,
      referrerId: referral.referrerId,
      amount: commission,
      status: 'pending',
      billingCycleMonth: month,
    },
  })
}
```

---

## Step 8 — Plan Limits Middleware

Create `src/server/trpc/middleware/plan-limits.ts`:

```typescript
import { TRPCError } from '@trpc/server'
import { prisma } from '@/lib/prisma'

export async function checkNumberLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plan: true,
      whatsappNumbers: { where: { isActive: true } },
    },
  })

  if (!user?.plan) throw new TRPCError({ code: 'FORBIDDEN', message: 'No active plan' })
  if (user.plan.maxNumbers === null) return // unlimited

  if (user.whatsappNumbers.length >= user.plan.maxNumbers) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Your ${user.plan.name} plan allows up to ${user.plan.maxNumbers} WhatsApp numbers. Upgrade to add more.`,
    })
  }
}

export async function checkContactLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true, _count: { select: { contacts: true } } },
  })

  if (!user?.plan || user.plan.maxContacts === null) return

  if (user._count.contacts >= user.plan.maxContacts) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have reached the contact limit on your ${user.plan.name} plan.`,
    })
  }
}

export async function checkBroadcastLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  })

  if (!user?.plan || user.plan.maxBroadcastsMonth === null) return

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const count = await prisma.broadcast.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
      status: { not: 'draft' },
    },
  })

  if (count >= user.plan.maxBroadcastsMonth) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have used all ${user.plan.maxBroadcastsMonth} broadcasts for this month. Upgrade for more.`,
    })
  }
}
```

---

## Step 9 — Protected Route Middleware

Create `src/middleware.ts`:

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAppRoute = req.nextUrl.pathname.startsWith('/app')
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/signup')

  if (isAppRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/app/dashboard', req.nextUrl))
  }

  // Redirect to onboarding if not completed
  if (isAppRoute && isLoggedIn && !req.auth?.user) {
    return NextResponse.redirect(new URL('/onboarding', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/app/:path*', '/login', '/signup', '/onboarding'],
}
```

---

## Step 10 — Warm-Up Auto-Enrolment

When a number connects, automatically enrol it in the warm-up programme. Add to your tRPC accounts router:

```typescript
// src/server/trpc/routers/accounts.ts
connectNumber: protectedProcedure
  .input(z.object({ displayName: z.string(), phoneNumber: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await checkNumberLimit(ctx.session.user.id)

    const number = await ctx.prisma.whatsappNumber.create({
      data: {
        userId: ctx.session.user.id,
        phoneNumber: input.phoneNumber,
        displayName: input.displayName,
        warmupDay: 0,
        warmupComplete: false,
        connectionStatus: 'disconnected',
      },
    })

    // Log activity
    await ctx.prisma.activityLog.create({
      data: {
        userId: ctx.session.user.id,
        actorId: ctx.session.user.id,
        numberId: number.id,
        action: 'number_connected',
        details: JSON.stringify({ displayName: input.displayName }),
      },
    })

    return number
  }),
```

Add a daily cron to advance warm-up days:

```typescript
// src/app/api/cron/warmup/route.ts
export async function GET() {
  // Advance warm-up day for all numbers that are connected
  const numbers = await prisma.whatsappNumber.findMany({
    where: { warmupComplete: false, connectionStatus: 'connected' },
  })

  for (const number of numbers) {
    const newDay = number.warmupDay + 1
    await prisma.whatsappNumber.update({
      where: { id: number.id },
      data: {
        warmupDay: newDay,
        warmupComplete: newDay >= 21,
      },
    })
  }

  return Response.json({ updated: numbers.length })
}
```

Schedule in crontab on server:
```bash
# Run daily warm-up advancement at midnight WAT (23:00 UTC)
echo "0 23 * * * curl -s https://zappix.ng/api/cron/warmup" | crontab -l | { cat; echo "0 23 * * * curl -s https://zappix.ng/api/cron/warmup"; } | crontab -
```

---

## ✅ Phase 2 Complete When:
- [ ] Sign in with Google works end-to-end
- [ ] Risk disclosure stored in database with timestamp
- [ ] QR code displays in onboarding and connects a real number
- [ ] Number stored in database with warmupDay: 0
- [ ] Plan selection triggers Paystack checkout
- [ ] Paystack webhook updates planId on User record
- [ ] Creator plan user cannot add a 3rd number (limit enforced)
- [ ] /app/dashboard accessible only when logged in
- [ ] Unauthenticated users redirected to /login

**➡️ Next: [PHASE-03-status-scheduler.md](./PHASE-03-status-scheduler.md)**
