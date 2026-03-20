# Phase 6 — Referral System
**Week 10 | "The growth engine"**

> At the end of this phase: Every user has a referral link (zappix.ng/ref/slug) and code. Referrals are tracked. Monthly commissions are calculated. The leaderboard is live. Users can withdraw to their bank account.

---

## ✅ Acceptance Criteria
- [ ] Every user has a unique referral link and code auto-generated on signup
- [ ] Visiting zappix.ng/ref/[slug] sets a referral cookie for 30 days
- [ ] Referral code can be entered at signup checkout
- [ ] Referral relationship created in database when referred user subscribes
- [ ] Commission (25%) created on every Paystack charge.success webhook
- [ ] Monthly cron on 1st of month moves pending → available
- [ ] User can add bank account (verified via Paystack name enquiry)
- [ ] Withdrawal request triggers Paystack transfer
- [ ] Leaderboard shows top 10 referrers with rankings
- [ ] Monthly earnings summary email sent on 1st of month

---

## Step 1 — Referral Landing Page

Create `src/app/ref/[slug]/page.tsx`:

```typescript
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ReferralPage({ params }: { params: { slug: string } }) {
  const code = await prisma.referralCode.findUnique({
    where: { linkSlug: params.slug },
    include: { user: { select: { name: true, image: true } } },
  })

  if (!code) redirect('/signup')

  // Set referral cookie (30 days)
  const cookieStore = cookies()
  cookieStore.set('zappix_ref', code.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold mb-2">
          {code.user.name} invited you to Zappix
        </h1>
        <p className="text-gray-500 mb-6">
          The operating system for WhatsApp TV businesses.
          Schedule posts, sell ad slots, grow your audience.
        </p>
        <a href="/signup"
          className="block bg-green-600 text-white py-3 px-8 rounded-full font-bold hover:bg-green-700">
          Start Free Trial →
        </a>
        <p className="text-xs text-gray-400 mt-4">No credit card required</p>
      </div>
    </div>
  )
}
```

---

## Step 2 — Track Referral on Signup

In `src/lib/auth.ts` signIn callback, read the referral cookie:

```typescript
async signIn({ user, account }) {
  if (account?.provider === 'google' && user.id) {
    // Check for referral cookie (set server-side from middleware)
    const refCodeId = await getReferralCookieFromSession()
    if (refCodeId) {
      const refCode = await prisma.referralCode.findUnique({
        where: { id: refCodeId },
      })
      if (refCode && refCode.userId !== user.id) {
        // Create referral relationship (pending until they subscribe)
        await prisma.referral.upsert({
          where: { referredUserId: user.id },
          update: {},
          create: {
            referrerId: refCode.userId,
            referredUserId: user.id,
            status: 'trial',
          },
        })
      }
    }
  }
  return true
}
```

---

## Step 3 — Monthly Commission Release Cron

Create `src/app/api/cron/release-commissions/route.ts`:

```typescript
import { prisma } from '@/lib/prisma'
import { sendMonthlyEarningsSummary } from '@/server/services/email'

export async function GET() {
  const now = new Date()
  const isFirstOfMonth = now.getDate() === 1

  if (!isFirstOfMonth) {
    return Response.json({ skipped: 'Not the 1st of the month' })
  }

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const monthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`

  // Release all pending commissions from last month
  const released = await prisma.commission.updateMany({
    where: { status: 'pending', billingCycleMonth: monthKey },
    data: { status: 'available', releasedAt: now },
  })

  // Get all referrers who earned commissions last month
  const earners = await prisma.commission.groupBy({
    by: ['referrerId'],
    where: { billingCycleMonth: monthKey },
    _sum: { amount: true },
    _count: { id: true },
  })

  // Send monthly summary emails
  for (const earner of earners) {
    const user = await prisma.user.findUnique({
      where: { id: earner.referrerId },
      select: { email: true, name: true },
    })
    if (user && earner._sum.amount) {
      await sendMonthlyEarningsSummary({
        email: user.email!,
        name: user.name || 'there',
        amount: earner._sum.amount,
        month: monthKey,
      })
    }
  }

  // Calculate and award leaderboard bonuses
  await awardLeaderboardBonuses(monthKey)

  return Response.json({ released: released.count, emailsSent: earners.length })
}

async function awardLeaderboardBonuses(monthKey: string) {
  const prizes = [20000000, 10000000, 5000000] // ₦200k, ₦100k, ₦50k in kobo

  const leaderboard = await prisma.commission.groupBy({
    by: ['referrerId'],
    where: { billingCycleMonth: monthKey },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3,
  })

  for (let i = 0; i < leaderboard.length; i++) {
    if (prizes[i]) {
      await prisma.commission.create({
        data: {
          referralId: leaderboard[i].referrerId, // Using referrerId as placeholder
          referrerId: leaderboard[i].referrerId,
          amount: prizes[i],
          status: 'available',
          billingCycleMonth: monthKey,
          paymentReference: `leaderboard_bonus_${i + 1}_${monthKey}`,
          releasedAt: new Date(),
        },
      })
    }
  }
}
```

Crontab — run at midnight on 1st of every month:
```bash
0 0 1 * * curl -s https://zappix.ng/api/cron/release-commissions
```

---

## Step 4 — Withdrawal via Paystack Transfer

```typescript
// src/server/trpc/routers/referrals.ts
requestWithdrawal: protectedProcedure
  .input(z.object({ amount: z.number().min(500000) })) // min ₦5,000 in kobo
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id

    // Check available balance
    const balance = await ctx.prisma.commission.aggregate({
      where: { referrerId: userId, status: 'available' },
      _sum: { amount: true },
    })

    const available = balance._sum.amount || 0
    if (available < input.amount) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Insufficient balance' })
    }

    const bankAccount = await ctx.prisma.bankAccount.findUnique({
      where: { userId },
    })

    if (!bankAccount?.paystackRecipientCode) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'No verified bank account' })
    }

    // Initiate Paystack transfer
    const response = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: input.amount,
        recipient: bankAccount.paystackRecipientCode,
        reason: 'Zappix Referral Commission',
      }),
    })

    const data = await response.json()

    if (!data.status) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Transfer initiation failed' })
    }

    // Mark commissions as withdrawn
    const commissions = await ctx.prisma.commission.findMany({
      where: { referrerId: userId, status: 'available' },
      orderBy: { releasedAt: 'asc' },
    })

    let remaining = input.amount
    for (const commission of commissions) {
      if (remaining <= 0) break
      const deduct = Math.min(remaining, commission.amount)
      await ctx.prisma.commission.update({
        where: { id: commission.id },
        data: { status: 'withdrawn' },
      })
      remaining -= deduct
    }

    return ctx.prisma.withdrawal.create({
      data: {
        userId,
        bankAccountId: bankAccount.id,
        amount: input.amount,
        paystackTransferId: data.data.transfer_code,
        status: 'processing',
      },
    })
  }),
```

---

## Pages to Build

- `/app/referrals` — Wallet (available + pending), link + code copy, stats, referrals table, leaderboard preview
- `/app/referrals/withdraw` — Amount input, bank details confirmation, transaction history
- `/app/referrals/leaderboard` — Full top 50, current user rank highlighted, monthly prizes shown
- `zappix.ng/ref/[slug]` — Public referral landing page (already built above)

---

## ✅ Phase 6 Complete When:
- [ ] Visiting zappix.ng/ref/tunde sets cookie and shows referral page
- [ ] Signing up after visiting referral page creates a Referral record
- [ ] Commission created on subscription payment
- [ ] 1st of month cron releases commissions
- [ ] Leaderboard shows correct rankings
- [ ] Withdrawal request initiates Paystack transfer
- [ ] Monthly email sent with earnings summary

**🎉 v1.0 LAUNCH — Week 11**

After Phase 6 completes, run the v1.0 launch checklist from the roadmap and go live at zappix.ng.
