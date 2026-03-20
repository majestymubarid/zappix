import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const analyticsRouter = router({
  overview: protectedProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
      compare: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const current = await ctx.prisma.analyticsDaily.aggregate({
        where: { userId: ctx.user.id, date: { gte: input.from, lte: input.to } },
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
          where: { userId: ctx.user.id, date: { gte: prevFrom, lte: prevTo } },
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
        where: { userId: ctx.user.id, date: { gte: input.from, lte: input.to } },
        orderBy: { date: 'asc' },
      })
    }),

  broadcastHistory: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.broadcast.findMany({
        where: { userId: ctx.user.id, status: 'sent' },
        include: { numbers: true, replies: true },
        orderBy: { completedAt: 'desc' },
        take: 50,
      })
    }),
})
