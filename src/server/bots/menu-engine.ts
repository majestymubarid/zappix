import { prisma } from '@/lib/prisma'

interface MenuBotSession {
  id: string
  currentParentId: string | null
}

export class MenuEngine {
  static async handleNavigation(
    menuBot: any,
    input: string,
    phone: string
  ) {
    // Get or create session
    let session = await prisma.botSession.findFirst({
      where: { botId: menuBot.id, contactPhone: phone },
    })

    if (!session) {
      session = await prisma.botSession.create({
        data: {
          botId: menuBot.id,
          contactPhone: phone,
          status: 'active',
        },
      })
    }

    const currentParentId = session.collectedData 
      ? JSON.parse(session.collectedData).currentParentId 
      : null

    // Handle back navigation
    if (input === '0' || input.toLowerCase() === 'back') {
      await this.handleBack(menuBot, session, phone)
      return
    }

    // Handle main menu
    if (input === '00' || input.toLowerCase() === 'menu') {
      await this.sendMainMenu(menuBot, phone)
      await this.updateSession(session.id, { currentParentId: null })
      return
    }

    // Find matching item by number or keyword
    const currentItems = await prisma.menuBotItem.findMany({
      where: {
        menuBotId: menuBot.id,
        parentId: currentParentId,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    })

    const item = currentItems.find(
      i => String(i.number) === input ||
      (i.keyword && input.toLowerCase().includes(i.keyword.toLowerCase()))
    )

    if (!item) {
      // TODO: Send error message via Baileys
      console.log(`Invalid option for ${phone}`)
      return
    }

    // Handle item action
    switch (item.itemType) {
      case 'submenu':
        await this.updateSession(session.id, { currentParentId: item.id })
        await this.sendSubmenu(menuBot, item, phone)
        break
      case 'product':
      case 'service':
        await this.sendItemDetail(item, phone)
        break
      case 'download':
        await this.sendFile(item, phone)
        await this.trackDownload(item.id, phone)
        break
    }
  }

  private static async handleBack(menuBot: any, session: any, phone: string) {
    const currentParentId = session.collectedData 
      ? JSON.parse(session.collectedData).currentParentId 
      : null

    if (currentParentId) {
      const parentItem = await prisma.menuBotItem.findUnique({
        where: { id: currentParentId },
      })

      await this.updateSession(session.id, { currentParentId: parentItem?.parentId || null })
      
      if (parentItem?.parentId) {
        const grandParent = await prisma.menuBotItem.findUnique({
          where: { id: parentItem.parentId },
        })
        await this.sendSubmenu(menuBot, grandParent!, phone)
      } else {
        await this.sendMainMenu(menuBot, phone)
      }
    } else {
      await this.sendMainMenu(menuBot, phone)
    }
  }

  private static async sendMainMenu(menuBot: any, phone: string) {
    // TODO: Build and send main menu via Baileys
    console.log(`Main menu sent to ${phone}`)
  }

  private static async sendSubmenu(menuBot: any, item: any, phone: string) {
    // TODO: Build and send submenu via Baileys
    console.log(`Submenu sent to ${phone}`)
  }

  private static async sendItemDetail(item: any, phone: string) {
    // TODO: Send item detail with image via Baileys
    console.log(`Item detail sent to ${phone}`)
  }

  private static async sendFile(item: any, phone: string) {
    // TODO: Send file via Baileys
    console.log(`File sent to ${phone}`)
  }

  private static async trackDownload(itemId: string, phone: string) {
    // Track download analytics
    console.log(`Download tracked: ${itemId} by ${phone}`)
  }

  private static async updateSession(sessionId: string, data: { currentParentId: string | null }) {
    await prisma.botSession.update({
      where: { id: sessionId },
      data: {
        collectedData: JSON.stringify(data),
        updatedAt: new Date(),
      },
    })
  }
}
