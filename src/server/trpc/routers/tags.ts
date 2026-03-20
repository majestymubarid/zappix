import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const tagsRouter = router({
  // Get all tags
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.tag.findMany({
      where: { userId: ctx.user.id },
      include: {
        _count: { select: { contacts: true } },
      },
      orderBy: { name: 'asc' },
    })
  }),

  // Create tag
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      colour: z.string().default('green'),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tag.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      })
    }),

  // Update tag
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      colour: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.tag.update({
        where: { id, userId: ctx.user.id },
        data,
      })
    }),

  // Delete tag
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tag.delete({
        where: { id: input, userId: ctx.user.id },
      })
    }),
})
