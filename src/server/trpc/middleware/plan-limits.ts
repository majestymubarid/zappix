import { TRPCError } from '@trpc/server'
import { prisma } from '@/lib/prisma'

export async function checkNumberLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      plan: true,
      whatsappNumbers: { where: { isActive: true } },
    },
  })

  if (!user?.plan) throw new TRPCError({ code: 'FORBIDDEN', message: 'No active plan' })
  if (user.plan.maxNumbers === null) return // unlimited

  if (user.whatsappNumbers.length >= user.plan.maxNumbers) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `Your ${user.plan.name} plan allows up to ${user.plan.maxNumbers} WhatsApp numbers. Upgrade to add more.`,
    })
  }
}

export async function checkContactLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true, _count: { select: { contacts: true } } },
  })

  if (!user?.plan || user.plan.maxContacts === null) return

  if (user._count.contacts >= user.plan.maxContacts) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have reached the contact limit on your ${user.plan.name} plan.`,
    })
  }
}

export async function checkBroadcastLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  })

  if (!user?.plan || user.plan.maxBroadcastsMonth === null) return

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const count = await prisma.broadcast.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
      status: { not: 'draft' },
    },
  })

  if (count >= user.plan.maxBroadcastsMonth) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have used all ${user.plan.maxBroadcastsMonth} broadcasts for this month. Upgrade for more.`,
    })
  }
}

export async function checkStatusLimit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  })

  if (!user?.plan || user.plan.maxStatusMonth === null) return

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const count = await prisma.scheduledStatus.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
      status: { not: 'cancelled' },
    },
  })

  if (count >= user.plan.maxStatusMonth) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: `You have used all ${user.plan.maxStatusMonth} status posts for this month. Upgrade for more.`,
    })
  }
}
