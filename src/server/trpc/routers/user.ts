import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = router({
  // Get current user with full details
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        plan: true,
        referralCode: true,
        whatsappNumbers: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return user
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        accountType: z.enum(['whatsapp_tv', 'business', 'agency']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: input,
      })
      return user
    }),

  // Accept risk disclosure
  acceptRiskDisclosure: protectedProcedure
    .input(z.object({ riskAccepted: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.riskAccepted) {
        throw new Error('You must accept the risk disclosure')
      }

      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          riskAccepted: true,
          riskAcceptedAt: new Date(),
        },
      })

      return user
    }),

  // Complete onboarding
  completeOnboarding: protectedProcedure
    .input(
      z.object({
        accountType: z.enum(['whatsapp_tv', 'business', 'agency']),
        riskAccepted: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.riskAccepted) {
        throw new Error('You must accept the risk disclosure to continue')
      }

      const user = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          accountType: input.accountType,
          riskAccepted: true,
          riskAcceptedAt: new Date(),
          onboarded: true,
        },
      })

      return user
    }),

  // Get dashboard stats
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const [
      numbersCount,
      contactsCount,
      scheduledStatusesCount,
      broadcastsCount,
    ] = await Promise.all([
      ctx.prisma.whatsappNumber.count({
        where: { userId: ctx.user.id, isActive: true },
      }),
      ctx.prisma.contact.count({
        where: { userId: ctx.user.id },
      }),
      ctx.prisma.scheduledStatus.count({
        where: { userId: ctx.user.id, status: 'pending' },
      }),
      ctx.prisma.broadcast.count({
        where: { userId: ctx.user.id, status: { in: ['draft', 'scheduled'] } },
      }),
    ])

    return {
      numbersCount,
      contactsCount,
      scheduledStatusesCount,
      broadcastsCount,
    }
  }),
})
