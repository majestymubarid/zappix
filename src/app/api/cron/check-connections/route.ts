import { prisma } from '@/lib/prisma'

export async function GET() {
  const numbers = await prisma.whatsappNumber.findMany({
    where: { isActive: true },
    include: { user: { select: { email: true, name: true } } },
  })

  let updated = 0

  for (const number of numbers) {
    // TODO: Check actual connection status via Baileys manager
    // const isConnected = waManager.isConnected(number.id)
    const isConnected = number.connectionStatus === 'connected' // Placeholder

    const newStatus = isConnected ? 'connected' : 'disconnected'

    if (number.connectionStatus !== newStatus) {
      await prisma.whatsappNumber.update({
        where: { id: number.id },
        data: { connectionStatus: newStatus },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: number.userId,
          actorId: number.userId,
          numberId: number.id,
          action: 'connection_status_changed',
          details: JSON.stringify({ from: number.connectionStatus, to: newStatus }),
        },
      })

      // TODO: Alert owner if disconnected via email

      updated++
    }
  }

  return Response.json({ checked: numbers.length, updated })
}
