import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const referralsRouter = router({
  // Get referral stats and wallet balance
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [available, pending, referrals] = await Promise.all([
      ctx.prisma.commission.aggregate({
        where: { referrerId: ctx.user.id, status: 'available' },
        _sum: { amount: true },
      }),
      ctx.prisma.commission.aggregate({
        where: { referrerId: ctx.user.id, status: 'pending' },
        _sum: { amount: true },
      }),
      ctx.prisma.referral.count({
        where: { referrerId: ctx.user.id, status: 'active' },
      }),
    ])

    const referralCode = await ctx.prisma.referralCode.findUnique({
      where: { userId: ctx.user.id },
    })

    return {
      availableBalance: available._sum.amount || 0,
      pendingBalance: pending._sum.amount || 0,
      activeReferrals: referrals,
      referralCode: referralCode?.code,
      referralLink: referralCode ? `https://zappix.ng/ref/${referralCode.linkSlug}` : null,
    }
  }),

  // Get referral list
  getReferrals: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.referral.findMany({
      where: { referrerId: ctx.user.id },
      include: {
        referredUser: {
          select: { name: true, email: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Get commission history
  getCommissions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.commission.findMany({
      where: { referrerId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
  }),

  // Request withdrawal
  requestWithdrawal: protectedProcedure
    .input(z.object({ amount: z.number().min(500000) })) // min ₦5,000 in kobo
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id

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

  // Get leaderboard
  getLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const currentMonth = new Date().toISOString().slice(0, 7)

    const leaderboard = await ctx.prisma.commission.groupBy({
      by: ['referrerId'],
      where: { billingCycleMonth: currentMonth },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 50,
    })

    // Get user details for each entry
    const entries = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await ctx.prisma.user.findUnique({
          where: { id: entry.referrerId },
          select: { name: true, image: true },
        })
        return {
          rank: index + 1,
          name: user?.name || 'Anonymous',
          image: user?.image,
          earnings: entry._sum.amount || 0,
          referrals: entry._count.id,
          isCurrentUser: entry.referrerId === ctx.user.id,
        }
      })
    )

    return entries
  }),
})
