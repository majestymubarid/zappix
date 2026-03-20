# Phase 10 — Chatbot Builder
**Weeks 18–19 | "v1.4"**

> At the end of this phase: Every connected number can have a bot — away messages, menu navigation, FAQ responses, lead capture, order collection, and Paystack payment links.

---

## ✅ Acceptance Criteria
- [ ] Away message sends when someone messages outside active hours
- [ ] Menu bot responds to "Hi" with the menu
- [ ] Numbered replies (1, 2, 3) and keyword replies both navigate menu
- [ ] FAQ bot matches keywords and sends correct answers
- [ ] Lead capture flow collects name, email, phone step by step
- [ ] Order collection flow collects item, qty, address, confirms order
- [ ] Payment link auto-sent when customer triggers PAY keyword
- [ ] Human takeover pauses bot when owner manually replies
- [ ] Bot submissions (leads and orders) stored and exportable
- [ ] Owner notified of new lead or order via WhatsApp

---

## Key Implementation Notes

### Incoming Message Router
This is the core of the chatbot. Add to `src/server/baileys/manager.ts`:

```typescript
import { BotEngine } from '@/server/bots/engine'

// In messages.upsert handler:
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe || !msg.message) continue

    const jid = msg.key.remoteJid!
    const phone = jid.replace('@s.whatsapp.net', '')
    const text = msg.message.conversation ||
                 msg.message.extendedTextMessage?.text || ''

    // Find bot for this number
    const bot = await prisma.bot.findFirst({
      where: { numberId, isEnabled: true },
      include: { awayMessage: true, menus: { include: { items: true } }, faqEntries: true, flows: true },
    })

    if (!bot) continue

    await BotEngine.handle({ bot, phone, text, numberId, sock })
  }
})
```

### Bot State Machine
```typescript
// src/server/bots/engine.ts
export class BotEngine {
  static async handle({ bot, phone, text, numberId, sock }: BotHandlerInput) {
    // Check if human has taken over
    const session = await prisma.botSession.findFirst({
      where: { botId: bot.id, contactPhone: phone, status: 'paused' },
    })
    if (session) return // Bot paused, human handling

    // Check opt-out
    await handleOptOut(phone, text, numberId, bot.userId)

    // Check active hours
    if (!isWithinActiveHours(bot)) {
      await sendAwayMessage(bot, phone, sock)
      return
    }

    // Route to appropriate handler
    const currentSession = await getOrCreateSession(bot.id, phone)

    if (currentSession.currentFlowId) {
      await handleFlowStep(bot, currentSession, text, phone, sock)
    } else if (isMenuTrigger(text, bot)) {
      await sendMenu(bot, phone, sock)
    } else if (await handleFAQ(bot, text, phone, sock)) {
      // FAQ matched and responded
    } else {
      await sendMenu(bot, phone, sock) // Default to menu
    }
  }
}
```

---

## Pages to Build
- `/app/bots` — Bot cards per number with enable/disable toggle
- `/app/bots/[id]` — Tabbed builder: Away | Menu | FAQ | Flows
- `/app/bots/[id]/submissions` — Leads and orders table with export
- Live chat panel in dashboard showing active/escalated conversations

---

## ✅ Phase 10 Complete When:
- [ ] Away message received outside business hours
- [ ] Full menu navigation working (numbers + keywords + 0 to go back)
- [ ] Lead capture stores name, email, phone in database
- [ ] Order captured and owner notified on WhatsApp
- [ ] Human takeover pauses bot and resumes after 30 minutes

**➡️ Next: [PHASE-11-menu-bot.md](./PHASE-11-menu-bot.md)**
