import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { statusQueue } from '@/server/queues/status.queue'
import { saveMediaFile } from '@/server/services/storage'
import { checkStatusLimit } from '../middleware/plan-limits'

export const schedulerRouter = router({
  // Get all scheduled posts for calendar
  getAll: protectedProcedure
    .input(z.object({
      from: z.date(),
      to: z.date(),
      numberId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.scheduledStatus.findMany({
        where: {
          userId: ctx.user.id,
          scheduledAt: { gte: input.from, lte: input.to },
          status: { not: 'cancelled' },
        },
        orderBy: { scheduledAt: 'asc' },
        include: { targetNumbers: true },
      })
    }),

  // Create single post
  create: protectedProcedure
    .input(z.object({
      mediaBase64: z.string().optional(),
      mediaType: z.enum(['image', 'video', 'gif', 'text']),
      mediaFilename: z.string().optional(),
      caption: z.string().optional(),
      label: z.string().optional(),
      scheduledAt: z.date(),
      targetAll: z.boolean().default(true),
      targetNumberIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await checkStatusLimit(ctx.user.id)

      let mediaUrl: string | undefined

      if (input.mediaBase64 && input.mediaFilename) {
        const buffer = Buffer.from(input.mediaBase64, 'base64')
        mediaUrl = await saveMediaFile(buffer, input.mediaFilename, ctx.user.id)
      }

      return ctx.prisma.scheduledStatus.create({
        data: {
          userId: ctx.user.id,
          mediaUrl,
          mediaType: input.mediaType,
          caption: input.caption,
          label: input.label,
          scheduledAt: input.scheduledAt,
          targetAll: input.targetAll,
          targetNumbers: input.targetNumberIds ? {
            create: input.targetNumberIds.map(id => ({ numberId: id })),
          } : undefined,
        },
      })
    }),

  // Bulk create posts
  bulkCreate: protectedProcedure
    .input(z.object({
      posts: z.array(z.object({
        mediaBase64: z.string().optional(),
        mediaType: z.enum(['image', 'video', 'gif', 'text']),
        mediaFilename: z.string().optional(),
        caption: z.string().optional(),
        scheduledAt: z.date(),
      })),
      targetAll: z.boolean().default(true),
      targetNumberIds: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const batchId = `batch_${Date.now()}`
      const created = []

      for (const post of input.posts) {
        let mediaUrl: string | undefined

        if (post.mediaBase64 && post.mediaFilename) {
          const buffer = Buffer.from(post.mediaBase64, 'base64')
          mediaUrl = await saveMediaFile(buffer, post.mediaFilename, ctx.user.id)
        }

        const created_post = await ctx.prisma.scheduledStatus.create({
          data: {
            userId: ctx.user.id,
            mediaUrl,
            mediaType: post.mediaType,
            caption: post.caption,
            scheduledAt: post.scheduledAt,
            targetAll: input.targetAll,
            bulkBatchId: batchId,
          },
        })
        created.push(created_post)
      }

      return { count: created.length, batchId }
    }),

  // Delete post
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.scheduledStatus.update({
        where: { id: input, userId: ctx.user.id },
        data: { status: 'cancelled' },
      })
    }),

  // Retry failed post
  retry: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.scheduledStatus.update({
        where: { id: input, userId: ctx.user.id },
        data: { status: 'pending', errorMessage: null },
      })
      await statusQueue.add('post', { statusId: post.id })
      return post
    }),
})
