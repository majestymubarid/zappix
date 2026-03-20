# Phase 5 — Analytics Dashboard
**Week 9 | "The intelligence layer"**

> At the end of this phase: Users see an overview dashboard with KPIs, charts for status estimated reach, broadcast send rates, and audience growth — with period comparison and CSV export.

---

## ✅ Acceptance Criteria
- [ ] Overview dashboard shows 6 KPI cards with period-over-period change
- [ ] Status analytics shows estimated reach (contact list size × numbers used)
- [ ] Broadcast analytics shows send rate, reply rate, opt-out trend
- [ ] Audience growth chart shows contact count over time
- [ ] Period selector works: Today, 7 Days, 30 Days, Custom
- [ ] Compare toggle shows current vs previous period side by side
- [ ] CSV export downloads a spreadsheet of broadcast history
- [ ] Analytics aggregation job runs hourly

---

## Step 1 — Analytics Aggregation Job

Create `src/app/api/cron/aggregate-analytics/route.ts`:

```typescript
import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all users
  const users = await prisma.user.findMany({ select: { id: true } })

  for (const user of users) {
    const [
      statusPosts,
      broadcasts,
      contacts,
      adBookings,
    ] = await Promise.all([
      // Status posts published today
      prisma.scheduledStatus.count({
        where: { userId: user.id, postedAt: { gte: today }, status: 'posted' },
      }),
      // Broadcasts data
      prisma.broadcast.findMany({
        where: { userId: user.id, completedAt: { gte: today } },
        include: { numbers: true, replies: true },
      }),
      // Total contacts
      prisma.contact.count({ where: { userId: user.id } }),
      // Ad revenue today
      prisma.adBooking.findMany({
        where: {
          ownerId: user.id,
          status: 'delivered',
          deliveredAt: { gte: today },
        },
        select: { amount: true },
      }),
    ])

    const messagesSent = broadcasts.reduce((sum, b) => sum + b.numbers.reduce((s, n) => s + n.sent, 0), 0)
    const messagesFailed = broadcasts.reduce((sum, b) => sum + b.numbers.reduce((s, n) => s + n.failed, 0), 0)
    const broadcastReplies = broadcasts.reduce((sum, b) => sum + b.replies.length, 0)
    const adRevenue = adBookings.reduce((sum, b) => sum + b.amount, 0)

    await prisma.analyticsDaily.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      update: {
        statusPostsPublished: statusPosts,
        broadcastsSent: broadcasts.length,
        messagesSent,
        messagesDelivered: messagesSent - messagesFailed,
        broadcastReplies,
        totalContacts: contacts,
        adRevenue,
        adBookingsCount: adBookings.length,
      },
      create: {
        userId: user.id,
        date: today,
        statusPostsPublished: statusPosts,
        broadcastsSent: broadcasts.length,
        messagesSent,
        messagesDelivered: messagesSent - messagesFailed,
        broadcastReplies,
        totalContacts: contacts,
        adRevenue,
        adBookingsCount: adBookings.length,
      },
    })
  }

  return Response.json({ processed: users.length })
}
```

Crontab — run hourly:
```bash
0 * * * * curl -s https://zappix.ng/api/cron/aggregate-analytics
```

---

## Step 2 — Analytics tRPC Router

```typescript
// src/server/trpc/routers/analytics.ts
export const analyticsRouter = router({
  overview: protectedProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
      compare: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const current = await ctx.prisma.analyticsDaily.aggregate({
        where: { userId: ctx.session.user.id, date: { gte: input.from, lte: input.to } },
        _sum: {
          statusEstimatedReach: true,
          broadcastsSent: true,
          messagesSent: true,
          broadcastReplies: true,
          optOuts: true,
          newContacts: true,
          adRevenue: true,
        },
        _max: { totalContacts: true },
      })

      let previous = null
      if (input.compare) {
        const diff = input.to.getTime() - input.from.getTime()
        const prevFrom = new Date(input.from.getTime() - diff)
        const prevTo = new Date(input.to.getTime() - diff)
        previous = await ctx.prisma.analyticsDaily.aggregate({
          where: { userId: ctx.session.user.id, date: { gte: prevFrom, lte: prevTo } },
          _sum: { broadcastsSent: true, messagesSent: true, adRevenue: true },
          _max: { totalContacts: true },
        })
      }

      return { current: current._sum, totalContacts: current._max.totalContacts, previous: previous?._sum }
    }),

  daily: protectedProcedure
    .input(z.object({ from: z.date(), to: z.date() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.analyticsDaily.findMany({
        where: { userId: ctx.session.user.id, date: { gte: input.from, lte: input.to } },
        orderBy: { date: 'asc' },
      })
    }),

  broadcastHistory: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.broadcast.findMany({
        where: { userId: ctx.session.user.id, status: 'sent' },
        include: { numbers: true, replies: true },
        orderBy: { completedAt: 'desc' },
        take: 50,
      })
    }),
})
```

---

## Pages to Build

- `/app/analytics` — Overview with KPI bar, period selector, combined activity chart (Recharts LineChart), audience growth area chart
- `/app/analytics/status` — Status estimated reach table, posts list, best time analysis
- `/app/analytics/broadcasts` — Delivery trend, reply rate trend, opt-out trend, best/worst broadcasts
- `/app/analytics/audience` — Contact growth area chart, list breakdown table
- `/app/analytics/revenue` — Ad revenue bars, top clients table

**Key Recharts components to use:**
- `LineChart` + `AreaChart` for trends
- `BarChart` for weekly/monthly comparison
- `ResponsiveContainer` to make charts fill their containers

---

## ✅ Phase 5 Complete When:
- [ ] KPI cards show correct numbers with up/down arrows vs previous period
- [ ] Line chart shows 7-day broadcast activity
- [ ] Status page shows estimated reach (not "view counts")
- [ ] CSV export downloads and opens correctly in Excel
- [ ] Aggregation job runs hourly without errors

**➡️ Next: [PHASE-06-referral-system.md](./PHASE-06-referral-system.md)**
