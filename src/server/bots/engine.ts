import { prisma } from '@/lib/prisma'

const OPT_OUT_KEYWORDS = ['stop', 'unsubscribe', 'no more', 'remove me', 'opt out']

interface BotHandlerInput {
  bot: any
  phone: string
  text: string
  numberId: string
  userId: string
}

export class BotEngine {
  static async handle({ bot, phone, text, numberId, userId }: BotHandlerInput) {
    const lowerText = text.toLowerCase().trim()

    // Check if human has taken over
    const session = await prisma.botSession.findFirst({
      where: { botId: bot.id, contactPhone: phone, status: 'paused' },
    })
    if (session) return // Bot paused, human handling

    // Check opt-out
    const isOptOut = OPT_OUT_KEYWORDS.some(kw => lowerText.includes(kw))
    if (isOptOut) {
      await this.handleOptOut(phone, userId)
      return
    }

    // Check for re-subscribe
    if (lowerText === 'join') {
      await this.handleResubscribe(phone, userId)
      return
    }

    // Check active hours
    if (!this.isWithinActiveHours(bot)) {
      await this.sendAwayMessage(bot, phone)
      return
    }

    // Route to appropriate handler
    const currentSession = await this.getOrCreateSession(bot.id, phone)

    if (currentSession.currentFlowId) {
      await this.handleFlowStep(bot, currentSession, text, phone)
    } else if (this.isMenuTrigger(text, bot)) {
      await this.sendMenu(bot, phone)
    } else if (await this.handleFAQ(bot, text, phone)) {
      // FAQ matched and responded
    } else {
      await this.sendMenu(bot, phone) // Default to menu
    }

    // Track broadcast reply if applicable
    await this.trackBroadcastReply(userId, phone, text)
  }

  private static async handleOptOut(phone: string, userId: string) {
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

    // TODO: Send opt-out confirmation via Baileys
    console.log(`Opted out: ${phone}`)
  }

  private static async handleResubscribe(phone: string, userId: string) {
    await prisma.contact.updateMany({
      where: { userId, phoneNumber: phone },
      data: { isOptedOut: false, optedOutAt: null },
    })
    await prisma.optOut.updateMany({
      where: { userId, contactPhone: phone },
      data: { isResubscribed: true, resubscribedAt: new Date() },
    })

    // TODO: Send resubscribe confirmation via Baileys
    console.log(`Resubscribed: ${phone}`)
  }

  private static isWithinActiveHours(bot: any): boolean {
    if (!bot.activeHoursStart || !bot.activeHoursEnd) return true

    const now = new Date()
    const currentHour = now.getHours() + now.getMinutes() / 60

    const [startH, startM] = bot.activeHoursStart.split(':').map(Number)
    const [endH, endM] = bot.activeHoursEnd.split(':').map(Number)
    const start = startH + startM / 60
    const end = endH + endM / 60

    return currentHour >= start && currentHour <= end
  }

  private static async sendAwayMessage(bot: any, phone: string) {
    if (!bot.awayMessage || !bot.awayMessage.isActive) return

    // Check if already sent recently
    const recentlySent = await prisma.botSession.findFirst({
      where: {
        botId: bot.id,
        contactPhone: phone,
        updatedAt: { gte: new Date(Date.now() - bot.awayMessage.oneReplyPerHours * 60 * 60 * 1000) },
      },
    })

    if (recentlySent) return

    // TODO: Send away message via Baileys
    console.log(`Away message sent to ${phone}`)
  }

  private static isMenuTrigger(text: string, bot: any): boolean {
    const triggers = ['hi', 'hello', 'menu', 'help', 'start']
    return triggers.some(t => text.toLowerCase().includes(t))
  }

  private static async sendMenu(bot: any, phone: string) {
    // TODO: Build and send menu via Baileys
    console.log(`Menu sent to ${phone}`)
  }

  private static async handleFAQ(bot: any, text: string, phone: string): Promise<boolean> {
    const lowerText = text.toLowerCase()

    for (const faq of bot.faqEntries || []) {
      if (!faq.isActive) continue

      const triggers = JSON.parse(faq.triggerPhrases) as string[]
      const matched = triggers.some(trigger => 
        lowerText.includes(trigger.toLowerCase())
      )

      if (matched) {
        // TODO: Send FAQ response via Baileys
        console.log(`FAQ response sent to ${phone}`)
        return true
      }
    }

    return false
  }

  private static async getOrCreateSession(botId: string, phone: string) {
    return prisma.botSession.upsert({
      where: { 
        botId_contactPhone: { botId, contactPhone: phone },
      },
      update: { updatedAt: new Date() },
      create: {
        botId,
        contactPhone: phone,
        status: 'active',
      },
    })
  }

  private static async handleFlowStep(bot: any, session: any, text: string, phone: string) {
    // TODO: Implement flow step handling
    console.log(`Flow step for ${phone}`)
  }

  private static async trackBroadcastReply(userId: string, phone: string, text: string) {
    const recentBroadcast = await prisma.broadcast.findFirst({
      where: { 
        userId, 
        status: 'sent', 
        completedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { completedAt: 'desc' },
    })

    if (recentBroadcast) {
      await prisma.broadcastReply.create({
        data: { 
          broadcastId: recentBroadcast.id, 
          contactPhone: phone, 
          message: text,
        },
      })
    }
  }
}
