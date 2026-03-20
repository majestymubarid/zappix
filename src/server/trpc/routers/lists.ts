import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const listsRouter = router({
  // Get all contact lists
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.contactList.findMany({
      where: { userId: ctx.user.id },
      include: {
        _count: { select: { members: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Create list
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      isDefault: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contactList.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      })
    }),

  // Update list
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.contactList.update({
        where: { id, userId: ctx.user.id },
        data,
      })
    }),

  // Delete list
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.contactList.delete({
        where: { id: input, userId: ctx.user.id },
      })
    }),
})
