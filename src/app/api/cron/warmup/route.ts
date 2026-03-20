import { prisma } from '@/lib/prisma'

export async function GET() {
  // Advance warm-up day for all numbers that are connected
  const numbers = await prisma.whatsappNumber.findMany({
    where: { warmupComplete: false, connectionStatus: 'connected' },
  })

  for (const number of numbers) {
    const newDay = number.warmupDay + 1
    await prisma.whatsappNumber.update({
      where: { id: number.id },
      data: {
        warmupDay: newDay,
        warmupComplete: newDay >= 21,
      },
    })
  }

  return Response.json({ updated: numbers.length })
}
