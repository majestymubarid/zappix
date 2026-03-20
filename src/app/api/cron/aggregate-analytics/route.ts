import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get all users
  const users = await prisma.user.findMany({ select: { id: true } })

  for (const user of users) {
    const [
      statusPosts,
      broadcasts,
      contacts,
      adBookings,
    ] = await Promise.all([
      // Status posts published today
      prisma.scheduledStatus.count({
        where: { userId: user.id, postedAt: { gte: today }, status: 'posted' },
      }),
      // Broadcasts data
      prisma.broadcast.findMany({
        where: { userId: user.id, completedAt: { gte: today } },
        include: { numbers: true, replies: true },
      }),
      // Total contacts
      prisma.contact.count({ where: { userId: user.id } }),
      // Ad revenue today
      prisma.adBooking.findMany({
        where: {
          ownerId: user.id,
          status: 'delivered',
          deliveredAt: { gte: today },
        },
        select: { amount: true },
      }),
    ])

    const messagesSent = broadcasts.reduce((sum, b) => sum + b.numbers.reduce((s, n) => s + n.sent, 0), 0)
    const messagesFailed = broadcasts.reduce((sum, b) => sum + b.numbers.reduce((s, n) => s + n.failed, 0), 0)
    const broadcastReplies = broadcasts.reduce((sum, b) => sum + b.replies.length, 0)
    const adRevenue = adBookings.reduce((sum, b) => sum + b.amount, 0)

    await prisma.analyticsDaily.upsert({
      where: { userId_date: { userId: user.id, date: today } },
      update: {
        statusPostsPublished: statusPosts,
        broadcastsSent: broadcasts.length,
        messagesSent,
        messagesDelivered: messagesSent - messagesFailed,
        broadcastReplies,
        totalContacts: contacts,
        adRevenue,
        adBookingsCount: adBookings.length,
      },
      create: {
        userId: user.id,
        date: today,
        statusPostsPublished: statusPosts,
        broadcastsSent: broadcasts.length,
        messagesSent,
        messagesDelivered: messagesSent - messagesFailed,
        broadcastReplies,
        totalContacts: contacts,
        adRevenue,
        adBookingsCount: adBookings.length,
      },
    })
  }

  return Response.json({ processed: users.length })
}
