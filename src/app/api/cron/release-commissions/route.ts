```ts
import { prisma } from '@/lib/prisma'

export async function GET() {
  const now = new Date()
  const isFirstOfMonth = now.getDate() === 1

  if (!isFirstOfMonth) {
    return Response.json({ skipped: 'Not the 1st of the month' })
  }

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
  const monthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`

  const released = await prisma.commission.updateMany({
    where: { status: 'pending', billingCycleMonth: monthKey },
    data: { status: 'available', releasedAt: now },
  })

  const earners = await prisma.commission.groupBy({
    by: ['referrerId'],
    where: { billingCycleMonth: monthKey },
    _sum: { amount: true },
    _count: { id: true },
  })

  await awardLeaderboardBonuses(monthKey)

  return Response.json({ released: released.count, earners: earners.length })
}

async function awardLeaderboardBonuses(monthKey: string) {
  const prizes = [20000000, 10000000, 5000000]

  const leaderboard = await prisma.commission.groupBy({
    by: ['referrerId'],
    where: { billingCycleMonth: monthKey },
    _sum: { amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 3,
  })

  for (let i = 0; i < leaderboard.length; i++) {
    const amount = leaderboard[i]._sum?.amount ?? 0
    if (prizes[i] && amount > 0) {
      const referral = await prisma.referral.findFirst({
        where: { referrerId: leaderboard[i].referrerId },
      })

      if (referral) {
        await prisma.commission.create({
          data: {
            referralId: referral.id,
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
}
```
