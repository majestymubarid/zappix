# Phase 4 — Broadcast Engine
**Weeks 7–8 | "The power tool"**

> At the end of this phase: Users can compose a broadcast, select contact lists, pick WhatsApp numbers, set throttle speed, schedule or send now, and see a full send/reply/opt-out report.

---

## ✅ Acceptance Criteria
- [ ] 5-step broadcast composer works end-to-end
- [ ] All 5 message types (text, image, video, doc, contact) send correctly
- [ ] Personalisation tokens ({firstName} etc) are replaced before sending
- [ ] Safe throttle mode delays 2-3 seconds between each message
- [ ] Warm-up number limits enforced (max 50/day in Days 4-7)
- [ ] Auto-split distributes contacts evenly across selected numbers
- [ ] Opt-out keyword detection works (contact replies STOP → opted out)
- [ ] Opt-out auto-reply sent to contact
- [ ] Broadcast report shows: sent, failed, replies, opt-outs
- [ ] Scheduled broadcasts send at the right time

---

## Step 1 — Broadcast Queue with Throttling

Create `src/server/queues/broadcast.queue.ts`:

```typescript
import { Queue, Worker, Job } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { waManager } from '@/server/baileys/manager'
import { replaceTokens } from '@/lib/utils'
import path from 'path'

export const broadcastQueue = new Queue('broadcasts', { connection: redis })

const THROTTLE_DELAYS = {
  safe: 2500,    // 2.5 seconds
  normal: 800,   // 0.8 seconds
  fast: 450,     // 0.45 seconds
}

export const broadcastWorker = new Worker(
  'broadcasts',
  async (job: Job) => {
    const { broadcastId, contactBatch, numberId } = job.data

    const broadcast = await prisma.broadcast.findUnique({
      where: { id: broadcastId },
    })

    if (!broadcast || broadcast.status === 'cancelled') return

    const delay = THROTTLE_DELAYS[broadcast.throttleSpeed as keyof typeof THROTTLE_DELAYS] || 2500
    const content = JSON.parse(broadcast.content)

    for (const contact of contactBatch) {
      try {
        // Check warm-up limits before each send
        const number = await prisma.whatsappNumber.findUnique({ where: { id: numberId } })
        if (number && !number.warmupComplete) {
          const todaySent = await getTodaySentCount(numberId)
          const limit = getWarmupLimit(number.warmupDay)
          if (todaySent >= limit) {
            // Skip this contact — daily limit reached
            await prisma.broadcastDelivery.updateMany({
              where: { broadcastId, contactId: contact.id, numberId },
              data: { status: 'failed', errorMessage: 'Warm-up daily limit reached' },
            })
            continue
          }
        }

        const jid = `${contact.phoneNumber}@s.whatsapp.net`
        const messageContent = buildMessageContent(content, contact)

        await waManager.sendMessage(numberId, jid, messageContent)

        await prisma.broadcastDelivery.updateMany({
          where: { broadcastId, contactId: contact.id, numberId },
          data: { status: 'sent', sentAt: new Date() },
        })

        await prisma.broadcastNumber.updateMany({
          where: { broadcastId, numberId },
          data: { sent: { increment: 1 } },
        })

      } catch (err) {
        await prisma.broadcastDelivery.updateMany({
          where: { broadcastId, contactId: contact.id, numberId },
          data: {
            status: 'failed',
            errorMessage: err instanceof Error ? err.message : 'Unknown error',
          },
        })

        await prisma.broadcastNumber.updateMany({
          where: { broadcastId, numberId },
          data: { failed: { increment: 1 } },
        })
      }

      // Throttle — wait between messages
      await sleep(delay + Math.random() * 500) // Add jitter
    }
  },
  { connection: redis, concurrency: 4 }
)

function buildMessageContent(content: any, contact: any): any {
  const text = content.text ? replaceTokens(content.text, contact) : undefined

  switch (content.type) {
    case 'text':
      return { text: text! }
    case 'image':
      return {
        image: { url: path.join(process.env.MEDIA_PATH!, content.mediaUrl.replace('/media/', '')) },
        caption: text,
      }
    case 'video':
      return {
        video: { url: path.join(process.env.MEDIA_PATH!, content.mediaUrl.replace('/media/', '')) },
        caption: text,
      }
    case 'document':
      return {
        document: { url: path.join(process.env.MEDIA_PATH!, content.mediaUrl.replace('/media/', '')) },
        fileName: content.fileName,
        caption: text,
      }
    case 'contact':
      return {
        contacts: {
          displayName: content.contactName,
          contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${content.contactName}\nTEL:${content.contactPhone}\nEND:VCARD` }],
        },
      }
    default:
      return { text: text || '' }
  }
}

function getWarmupLimit(day: number): number {
  if (day <= 3) return 0
  if (day <= 7) return 50
  if (day <= 14) return 200
  if (day <= 21) return 500
  return Infinity
}

async function getTodaySentCount(numberId: string): Promise<number> {
  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  return prisma.broadcastDelivery.count({
    where: {
      numberId,
      status: 'sent',
      sentAt: { gte: startOfDay },
    },
  })
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
```

---

## Step 2 — Token Replacement Utility

Add to `src/lib/utils.ts`:

```typescript
export function replaceTokens(template: string, contact: {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  city?: string | null
  phoneNumber?: string
  customValues?: Array<{ customField: { name: string }, value: string | null }>
}): string {
  const fallback = (value: string | null | undefined, fb: string) => value || fb

  return template
    .replace(/\{firstName\|([^}]+)\}/g, (_, fb) => fallback(contact.firstName, fb))
    .replace(/\{firstName\}/g, fallback(contact.firstName, 'there'))
    .replace(/\{lastName\|([^}]+)\}/g, (_, fb) => fallback(contact.lastName, fb))
    .replace(/\{lastName\}/g, fallback(contact.lastName, ''))
    .replace(/\{fullName\}/g, [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'there')
    .replace(/\{city\}/g, fallback(contact.city, ''))
    .replace(/\{phone\}/g, contact.phoneNumber || '')
    .replace(/\{custom1\}/g, contact.customValues?.find(v => v.customField.name === 'custom1')?.value || '')
    .replace(/\{custom2\}/g, contact.customValues?.find(v => v.customField.name === 'custom2')?.value || '')
}
```

---

## Step 3 — Opt-Out Detection

In your Baileys incoming message handler (`src/server/baileys/manager.ts`), add:

```typescript
import { prisma } from '@/lib/prisma'

const OPT_OUT_KEYWORDS = ['stop', 'unsubscribe', 'no more', 'remove me', 'opt out']

async function handleIncomingMessage(numberId: string, jid: string, text: string, userId: string) {
  const phone = jid.replace('@s.whatsapp.net', '').replace('@g.us', '')
  const lowerText = text.toLowerCase().trim()

  // Check for opt-out
  const isOptOut = OPT_OUT_KEYWORDS.some(kw => lowerText.includes(kw))

  if (isOptOut) {
    // Mark contact as opted out
    await prisma.contact.updateMany({
      where: { userId, phoneNumber: phone },
      data: { isOptedOut: true, optedOutAt: new Date() },
    })

    // Upsert opt-out record
    await prisma.optOut.upsert({
      where: { userId_contactPhone: { userId, contactPhone: phone } },
      update: { isResubscribed: false, resubscribedAt: null },
      create: { userId, contactPhone: phone },
    })

    // Send opt-out confirmation
    const sock = await waManager.connect(numberId)
    await sock.sendMessage(jid, {
      text: "You've been unsubscribed ✅\nYou won't receive further messages.\nReply JOIN anytime to resubscribe.",
    })
  }

  // Check for re-subscribe
  if (lowerText === 'join') {
    await prisma.contact.updateMany({
      where: { userId, phoneNumber: phone },
      data: { isOptedOut: false, optedOutAt: null },
    })
    await prisma.optOut.updateMany({
      where: { userId, contactPhone: phone },
      data: { isResubscribed: true, resubscribedAt: new Date() },
    })
  }

  // Track as broadcast reply
  const recentBroadcast = await prisma.broadcast.findFirst({
    where: { userId, status: 'sent', completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    orderBy: { completedAt: 'desc' },
  })

  if (recentBroadcast) {
    await prisma.broadcastReply.create({
      data: { broadcastId: recentBroadcast.id, contactPhone: phone, message: text },
    })
  }
}
```

---

## Step 4 — Send Broadcast tRPC Mutation

```typescript
// In src/server/trpc/routers/broadcasts.ts
send: protectedProcedure
  .input(z.object({ broadcastId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await checkBroadcastLimit(ctx.session.user.id)

    const broadcast = await ctx.prisma.broadcast.findUnique({
      where: { id: input.broadcastId, userId: ctx.session.user.id },
      include: {
        numbers: true,
        audiences: true,
      },
    })

    if (!broadcast) throw new TRPCError({ code: 'NOT_FOUND' })

    // Get all contacts from selected lists (excluding opted out)
    const contacts = await ctx.prisma.contact.findMany({
      where: {
        userId: ctx.session.user.id,
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
```

---

## Pages to Build

- `/app/broadcasts` — List page with status pills (sending, sent, scheduled, draft, failed)
- `/app/broadcasts/new` — 5-step wizard (type → compose → audience → numbers → schedule)
- `/app/broadcasts/[id]` — Report page with charts and per-contact failed list + retry

---

## ✅ Phase 4 Complete When:
- [ ] Broadcast composer completes all 5 steps
- [ ] Text broadcast sent to 100 test contacts successfully
- [ ] Throttle delays visible in logs (2.5s between messages on Safe)
- [ ] Warm-up limit prevents >50 sends on a Day 5 number
- [ ] Reply STOP → contact opted out and confirmation sent
- [ ] Broadcast report shows correct sent/failed/replies/opt-outs
- [ ] Scheduled broadcast sends at the right time

**➡️ Next: [PHASE-05-analytics.md](./PHASE-05-analytics.md)**
