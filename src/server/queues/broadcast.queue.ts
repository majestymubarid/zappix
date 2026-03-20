import { Queue, Worker, Job } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
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

        // Note: Actual WhatsApp sending will be handled by Baileys manager
        // await waManager.sendMessage(numberId, jid, messageContent)

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
