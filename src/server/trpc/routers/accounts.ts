import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'
import { checkNumberLimit } from '../middleware/plan-limits'

export const accountsRouter = router({
  // Get all WhatsApp numbers for current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.whatsappNumber.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Get single WhatsApp number
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.whatsappNumber.findFirst({
        where: { id: input, userId: ctx.user.id },
      })
    }),

  // Connect new WhatsApp number
  connect: protectedProcedure
    .input(z.object({
      displayName: z.string(),
      phoneNumber: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await checkNumberLimit(ctx.user.id)

      const number = await ctx.prisma.whatsappNumber.create({
        data: {
          userId: ctx.user.id,
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
          userId: ctx.user.id,
          actorId: ctx.user.id,
          numberId: number.id,
          action: 'number_connected',
          details: JSON.stringify({ displayName: input.displayName }),
        },
      })

      return number
    }),

  // Update WhatsApp number
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      displayName: z.string().optional(),
      colourTag: z.string().optional(),
      category: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.whatsappNumber.update({
        where: { id, userId: ctx.user.id },
        data,
      })
    }),

  // Disconnect WhatsApp number
  disconnect: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.whatsappNumber.update({
        where: { id: input, userId: ctx.user.id },
        data: { 
          isActive: false,
          connectionStatus: 'disconnected',
        },
      })
    }),
})
