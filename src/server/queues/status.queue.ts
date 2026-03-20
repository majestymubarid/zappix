import { Queue, Worker } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
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

        // Note: Actual WhatsApp posting will be handled by Baileys manager
        // For now, just mark as posted
        // await waManager.postStatus(numberId, content, viewers)
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
