import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const botsRouter = router({
  // Get all bots
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.bot.findMany({
      where: { userId: ctx.user.id },
      include: {
        number: { select: { displayName: true, phoneNumber: true } },
        awayMessage: true,
        _count: { select: { sessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }),

  // Get bot by ID with full config
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.bot.findFirst({
        where: { id: input, userId: ctx.user.id },
        include: {
          awayMessage: true,
          menus: { include: { items: true } },
          faqEntries: true,
          flows: true,
        },
      })
    }),

  // Create bot
  create: protectedProcedure
    .input(z.object({
      numberId: z.string(),
      activeHoursStart: z.string().optional(),
      activeHoursEnd: z.string().optional(),
      language: z.string().default('en'),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.bot.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      })
    }),

  // Update bot settings
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      isEnabled: z.boolean().optional(),
      activeHoursStart: z.string().optional(),
      activeHoursEnd: z.string().optional(),
      humanTakeoverMins: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.bot.update({
        where: { id, userId: ctx.user.id },
        data,
      })
    }),

  // Create/update away message
  setAwayMessage: protectedProcedure
    .input(z.object({
      botId: z.string(),
      message: z.string(),
      scheduleType: z.enum(['always', 'custom_hours', 'weekends']).default('always'),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ ctx, input }) => {
      const { botId, ...data } = input

      return ctx.prisma.awayMessage.upsert({
        where: { botId },
        update: data,
        create: { botId, ...data },
      })
    }),

  // Add FAQ entry
  addFAQ: protectedProcedure
    .input(z.object({
      botId: z.string(),
      triggerPhrases: z.string(), // JSON array
      responseText: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.faqEntry.create({
        data: {
          ...input,
          isActive: true,
        },
      })
    }),

  // Get bot submissions (leads & orders)
  getSubmissions: protectedProcedure
    .input(z.object({
      botId: z.string(),
      type: z.enum(['lead', 'order']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const bot = await ctx.prisma.bot.findFirst({
        where: { id: input.botId, userId: ctx.user.id },
      })

      if (!bot) return []

      return ctx.prisma.botSubmission.findMany({
        where: {
          flow: { botId: bot.id },
          ...(input.type && { submissionType: input.type }),
        },
        include: { flow: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
    }),
})
