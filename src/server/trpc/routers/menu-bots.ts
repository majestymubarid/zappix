import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const menuBotsRouter = router({
  // Get all menu bots
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.menuBot.findMany({
      where: { userId: ctx.user.id },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Get menu bot with full structure
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.menuBot.findFirst({
        where: { id: input, userId: ctx.user.id },
        include: {
          items: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
    }),

  // Create menu bot
  create: protectedProcedure
    .input(z.object({
      numberId: z.string(),
      triggerKeyword: z.string().default('any'),
      welcomeMessage: z.string(),
      footerText: z.string().optional(),
      sessionTimeoutMins: z.number().default(10),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.menuBot.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      })
    }),

  // Add menu item
  addItem: protectedProcedure
    .input(z.object({
      menuBotId: z.string(),
      parentId: z.string().optional(),
      itemType: z.enum(['product', 'service', 'download', 'submenu', 'action']),
      number: z.number(),
      keyword: z.string().optional(),
      title: z.string(),
      description: z.string().optional(),
      price: z.string().optional(),
      imageUrl: z.string().optional(),
      fileUrl: z.string().optional(),
      ctaType: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.menuBotItem.create({
        data: {
          ...input,
          isActive: true,
        },
      })
    }),

  // Update menu item
  updateItem: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      isActive: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      
      // Verify ownership via menuBot
      const item = await ctx.prisma.menuBotItem.findFirst({
        where: {
          id,
          menuBot: { userId: ctx.user.id },
        },
      })

      if (!item) throw new Error('Not found')

      return ctx.prisma.menuBotItem.update({
        where: { id },
        data,
      })
    }),

  // Delete menu item
  deleteItem: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.menuBotItem.findFirst({
        where: {
          id: input,
          menuBot: { userId: ctx.user.id },
        },
      })

      if (!item) throw new Error('Not found')

      return ctx.prisma.menuBotItem.delete({
        where: { id: input },
      })
    }),

  // Toggle menu bot
  toggle: protectedProcedure
    .input(z.object({
      id: z.string(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.menuBot.update({
        where: { id: input.id, userId: ctx.user.id },
        data: { isActive: input.isActive },
      })
    }),
})
