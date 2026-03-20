import { prisma } from '@/lib/prisma'
import { statusQueue } from '@/server/queues/status.queue'

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
