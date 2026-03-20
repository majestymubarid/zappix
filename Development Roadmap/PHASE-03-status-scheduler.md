# Phase 3 — Status Scheduler
**Weeks 5–6 | "First core feature"**

> At the end of this phase: Users can schedule single status posts, bulk upload 30 days of content, see everything in a calendar, and Zappix auto-posts at the right time.

---

## ✅ Acceptance Criteria
- [ ] Single post form works — pick media, set time, select numbers, save
- [ ] Bulk upload accepts multiple files and assigns them to time slots
- [ ] Content calendar shows all scheduled posts as thumbnails by day
- [ ] Cron job runs every minute and posts due statuses via Baileys
- [ ] Failed posts trigger owner notification and show retry button
- [ ] Status is marked "posted" in database after successful delivery
- [ ] Content gap highlighting — days with no posts shown in amber
- [ ] Estimated reach shown on each post (based on contact list size)

---

## Step 1 — Media Upload to Hetzner Volume

Create `src/server/services/storage.ts`:

```typescript
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const MEDIA_PATH = process.env.MEDIA_PATH || '/mnt/zappix-media/media'

export async function saveMediaFile(
  buffer: Buffer,
  originalName: string,
  userId: string
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase()
  const filename = `${userId}/${randomUUID()}${ext}`
  const fullPath = path.join(MEDIA_PATH, filename)

  // Create user directory if it doesn't exist
  fs.mkdirSync(path.dirname(fullPath), { recursive: true })
  fs.writeFileSync(fullPath, buffer)

  // Return relative URL path
  return `/media/${filename}`
}

export function getMediaPath(relativePath: string): string {
  return path.join(MEDIA_PATH, relativePath.replace('/media/', ''))
}

export function deleteMediaFile(relativePath: string): void {
  const fullPath = getMediaPath(relativePath)
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath)
  }
}
```

Serve media files via Next.js API route:

```typescript
// src/app/api/media/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const session = await auth()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const filePath = path.join(process.env.MEDIA_PATH!, ...params.path)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not found', { status: 404 })
  }

  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.png': 'image/png', '.gif': 'image/gif',
    '.mp4': 'video/mp4', '.pdf': 'application/pdf',
  }

  return new NextResponse(buffer, {
    headers: { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' },
  })
}
```

---

## Step 2 — BullMQ Status Queue

Create `src/server/queues/status.queue.ts`:

```typescript
import { Queue, Worker } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { waManager } from '@/server/baileys/manager'
import path from 'path'

export const statusQueue = new Queue('status-posts', { connection: redis })

export const statusWorker = new Worker(
  'status-posts',
  async (job) => {
    const { statusId } = job.data
    const post = await prisma.scheduledStatus.findUnique({
      where: { id: statusId },
      include: { targetNumbers: true },
    })

    if (!post || post.status !== 'pending') return

    await prisma.scheduledStatus.update({
      where: { id: statusId },
      data: { status: 'processing' },
    })

    // Get target numbers
    let numberIds: string[]
    if (post.targetAll) {
      const numbers = await prisma.whatsappNumber.findMany({
        where: { userId: post.userId, isActive: true, connectionStatus: 'connected' },
        select: { id: true },
      })
      numberIds = numbers.map(n => n.id)
    } else {
      numberIds = post.targetNumbers.map(t => t.numberId)
    }

    let allPosted = true

    for (const numberId of numberIds) {
      try {
        // Get all contacts who can see status on this number
        const contacts = await prisma.contact.findMany({
          where: { userId: post.userId, isOptedOut: false },
          select: { phoneNumber: true },
        })
        const viewers = contacts.map(c => `${c.phoneNumber}@s.whatsapp.net`)

        // Build media content
        let content: any
        const mediaPath = post.mediaUrl
          ? path.join(process.env.MEDIA_PATH!, post.mediaUrl.replace('/media/', ''))
          : null

        if (post.mediaType === 'text') {
          content = { text: post.caption || '' }
        } else if (post.mediaType === 'image' && mediaPath) {
          content = { image: { url: mediaPath }, caption: post.caption || '' }
        } else if (post.mediaType === 'video' && mediaPath) {
          content = { video: { url: mediaPath }, caption: post.caption || '' }
        } else if (post.mediaType === 'gif' && mediaPath) {
          content = { video: { url: mediaPath }, gifPlayback: true }
        }

        if (content) {
          await waManager.postStatus(numberId, content, viewers)
        }
      } catch (err) {
        console.error(`Failed to post status ${statusId} on number ${numberId}:`, err)
        allPosted = false
      }
    }

    await prisma.scheduledStatus.update({
      where: { id: statusId },
      data: {
        status: allPosted ? 'posted' : 'failed',
        postedAt: allPosted ? new Date() : undefined,
        errorMessage: allPosted ? undefined : 'Failed to post on one or more numbers',
      },
    })
  },
  { connection: redis, concurrency: 3 }
)
```

---

## Step 3 — Scheduler Cron Job

Create `src/app/api/cron/process-statuses/route.ts`:

```typescript
export async function GET() {
  const now = new Date()

  const duePosts = await prisma.scheduledStatus.findMany({
    where: {
      scheduledAt: { lte: now },
      status: 'pending',
    },
    take: 50, // Process in batches
  })

  for (const post of duePosts) {
    await statusQueue.add('post', { statusId: post.id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 30000 },
    })
  }

  return Response.json({ queued: duePosts.length })
}
```

Add to crontab:
```bash
# Run every minute
* * * * * curl -s https://zappix.ng/api/cron/process-statuses
```

---

## Step 4 — tRPC Scheduler Router

Create `src/server/trpc/routers/scheduler.ts`:

```typescript
import { z } from 'zod'
import { router, protectedProcedure } from '../context'
import { statusQueue } from '@/server/queues/status.queue'
import { saveMediaFile } from '@/server/services/storage'

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
          userId: ctx.session.user.id,
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
      let mediaUrl: string | undefined

      if (input.mediaBase64 && input.mediaFilename) {
        const buffer = Buffer.from(input.mediaBase64, 'base64')
        mediaUrl = await saveMediaFile(buffer, input.mediaFilename, ctx.session.user.id)
      }

      return ctx.prisma.scheduledStatus.create({
        data: {
          userId: ctx.session.user.id,
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
          mediaUrl = await saveMediaFile(buffer, post.mediaFilename, ctx.session.user.id)
        }

        const created_post = await ctx.prisma.scheduledStatus.create({
          data: {
            userId: ctx.session.user.id,
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
        where: { id: input, userId: ctx.session.user.id },
        data: { status: 'cancelled' },
      })
    }),

  // Retry failed post
  retry: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.scheduledStatus.update({
        where: { id: input, userId: ctx.session.user.id },
        data: { status: 'pending', errorMessage: null },
      })
      await statusQueue.add('post', { statusId: post.id })
      return post
    }),
})
```

---

## Pages to Build

- `/app/scheduler` — Calendar view (month/week/day, thumbnails per day, gap highlights)
- `/app/scheduler/new` — Single post form with media upload and datetime picker
- `/app/scheduler/bulk` — Multi-file upload with draggable grid and time assignment

---

## ✅ Phase 3 Complete When:
- [ ] Single post can be created and appears in calendar
- [ ] Bulk upload creates multiple posts across the calendar
- [ ] Cron job processes due posts every minute
- [ ] Status appears on connected WhatsApp numbers at scheduled time
- [ ] Failed posts shown in red with retry button
- [ ] Content gaps (days with no posts) highlighted in amber

**➡️ Next: [PHASE-04-broadcast-engine.md](./PHASE-04-broadcast-engine.md)**
