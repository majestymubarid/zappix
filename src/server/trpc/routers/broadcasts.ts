import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { broadcastQueue } from '@/server/queues/broadcast.queue'
import { checkBroadcastLimit } from '../middleware/plan-limits'
import { TRPCError } from '@trpc/server'

export const broadcastsRouter = router({
  // Get all broadcasts for current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.broadcast.findMany({
      where: { userId: ctx.user.id },
      include: {
        numbers: true,
        audiences: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }),

  // Get single broadcast with details
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.broadcast.findFirst({
        where: { id: input, userId: ctx.user.id },
        include: {
          numbers: true,
          audiences: true,
          deliveries: true,
          replies: true,
        },
      })
    }),

  // Create broadcast
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      messageType: z.enum(['text', 'image', 'video', 'document', 'contact']),
      content: z.string(), // JSON string
      numberIds: z.array(z.string()),
      audienceListIds: z.array(z.string()),
      scheduledAt: z.date().optional(),
      throttleSpeed: z.enum(['safe', 'normal', 'fast']).default('safe'),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.broadcast.create({
        data: {
          userId: ctx.user.id,
          name: input.name,
          messageType: input.messageType,
          content: input.content,
          scheduledAt: input.scheduledAt,
          throttleSpeed: input.throttleSpeed,
          status: input.scheduledAt ? 'scheduled' : 'draft',
          numbers: {
            create: input.numberIds.map(id => ({ numberId: id })),
          },
          audiences: {
            create: input.audienceListIds.map(id => ({ contactListId: id })),
          },
        },
      })
    }),

  // Send broadcast
  send: protectedProcedure
    .input(z.object({ broadcastId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await checkBroadcastLimit(ctx.user.id)

      const broadcast = await ctx.prisma.broadcast.findUnique({
        where: { id: input.broadcastId, userId: ctx.user.id },
        include: {
          numbers: true,
          audiences: true,
        },
      })

      if (!broadcast) throw new TRPCError({ code: 'NOT_FOUND' })

      // Get all contacts from selected lists (excluding opted out)
      const contacts = await ctx.prisma.contact.findMany({
        where: {
          userId: ctx.user.id,
          isOptedOut: false,
          lists: {
            some: {
              listId: { in: broadcast.audiences.map(a => a.contactListId) },
            },
          },
        },
        include: { customValues: { include: { customField: true } } },
      })

      // Auto-split across numbers
      const numbers = broadcast.numbers
      const contactsPerNumber = Math.ceil(contacts.length / numbers.length)

      for (let i = 0; i < numbers.length; i++) {
        const batch = contacts.slice(i * contactsPerNumber, (i + 1) * contactsPerNumber)
        const numberId = numbers[i].numberId

        // Create delivery records
        await ctx.prisma.broadcastDelivery.createMany({
          data: batch.map(c => ({
            broadcastId: broadcast.id,
            contactId: c.id,
            numberId,
            status: 'queued',
          })),
        })

        // Queue in chunks of 100
        for (let j = 0; j < batch.length; j += 100) {
          await broadcastQueue.add('send', {
            broadcastId: broadcast.id,
            contactBatch: batch.slice(j, j + 100),
            numberId,
          })
        }
      }

      return ctx.prisma.broadcast.update({
        where: { id: broadcast.id },
        data: { status: 'sending', startedAt: new Date() },
      })
    }),

  // Delete broadcast
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.broadcast.update({
        where: { id: input, userId: ctx.user.id },
        data: { status: 'cancelled' },
      })
    }),
})
