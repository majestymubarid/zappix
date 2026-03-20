import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const adsRouter = router({
  // Get all ad slots
  getSlots: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.adSlot.findMany({
      where: { userId: ctx.user.id },
      include: {
        numbers: { include: { number: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Create ad slot
  createSlot: protectedProcedure
    .input(z.object({
      name: z.string(),
      slotType: z.enum(['status', 'broadcast', 'combo']),
      estimatedReach: z.number(),
      price: z.number(),
      bookingMode: z.enum(['online', 'manual', 'both']).default('both'),
      maxBookingsPerDay: z.number().default(3),
      numberIds: z.array(z.string()),
      creativeRequirements: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { numberIds, ...slotData } = input

      return ctx.prisma.adSlot.create({
        data: {
          ...slotData,
          userId: ctx.user.id,
          numbers: {
            create: numberIds.map(numberId => ({ numberId })),
          },
        },
      })
    }),

  // Get all bookings
  getBookings: protectedProcedure
    .input(z.object({
      status: z.enum(['pending_approval', 'approved', 'rejected', 'delivered', 'cancelled']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.adBooking.findMany({
        where: {
          ownerId: ctx.user.id,
          ...(input.status && { status: input.status }),
        },
        include: {
          slot: true,
          delivery: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    }),

  // Approve booking
  approveBooking: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.adBooking.update({
        where: { id: input, ownerId: ctx.user.id },
        data: {
          status: 'approved',
          approvedAt: new Date(),
        },
      })
    }),

  // Reject booking
  rejectBooking: protectedProcedure
    .input(z.object({
      bookingId: z.string(),
      reason: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.adBooking.update({
        where: { id: input.bookingId, ownerId: ctx.user.id },
        data: {
          status: 'rejected',
          rejectionReason: input.reason,
        },
      })
    }),

  // Get revenue stats
  getRevenue: protectedProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      const bookings = await ctx.prisma.adBooking.findMany({
        where: {
          ownerId: ctx.user.id,
          status: 'delivered',
          deliveredAt: { gte: input.from, lte: input.to },
        },
        select: {
          amount: true,
          clientName: true,
          deliveredAt: true,
        },
      })

      const total = bookings.reduce((sum, b) => sum + b.amount, 0)
      
      return { total, bookings: bookings.length, data: bookings }
    }),
})
