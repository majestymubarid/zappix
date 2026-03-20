# Phase 11 — WhatsApp Menu Bot & Full Product
**Weeks 20–21 | "v2.0 — Full Product"**

> At the end of this phase: Every connected number can be a full interactive storefront with product catalogue, service menu, and download hub. All 9 features are live.

---

## ✅ Acceptance Criteria
- [ ] Product catalogue with categories and product detail views
- [ ] Service menu with descriptions, pricing, and CTAs
- [ ] Download hub sends files instantly on customer request
- [ ] Multi-level submenus work (up to 3 levels deep)
- [ ] 0 = back, 00 = main menu navigation works
- [ ] Keyword shortcuts work alongside numbered replies
- [ ] Session timeout resets after configured period
- [ ] Menu analytics tracks most visited sections and downloaded files
- [ ] Full regression test of all 9 features passes

---

## Key Implementation Notes

### Menu Navigation Engine
```typescript
// src/server/bots/menu-engine.ts
export async function handleMenuNavigation(
  menuBot: MenuBot & { items: MenuBotItem[] },
  session: MenuBotSession,
  input: string,
  phone: string,
  sock: WASocket
) {
  // Handle back navigation
  if (input === '0' || input.toLowerCase() === 'back') {
    const parent = await getParentItem(session.currentParentId)
    await updateSession(session.id, { currentParentId: parent?.parentId || null })
    await sendMenu(menuBot, parent?.parentId || null, phone, sock)
    return
  }

  // Handle main menu
  if (input === '00' || input.toLowerCase() === 'menu') {
    await updateSession(session.id, { currentParentId: null })
    await sendMainMenu(menuBot, phone, sock)
    return
  }

  // Find matching item by number or keyword
  const currentItems = menuBot.items.filter(
    i => i.parentId === session.currentParentId && i.isActive
  )

  const item = currentItems.find(
    i => String(i.number) === input ||
    (i.keyword && input.toLowerCase().includes(i.keyword.toLowerCase()))
  )

  if (!item) {
    await sock.sendMessage(`${phone}@s.whatsapp.net`, {
      text: "Sorry, I didn't get that 😅\nReply MENU to see options.",
    })
    return
  }

  // Handle item action
  switch (item.itemType) {
    case 'submenu':
      await updateSession(session.id, { currentParentId: item.id })
      await sendMenu(menuBot, item.id, phone, sock)
      break
    case 'product':
    case 'service':
      await sendItemDetail(item, phone, sock)
      break
    case 'download':
      await sendFile(item, phone, sock)
      await trackDownload(item.id, phone)
      break
  }
}
```

### File Delivery for Download Hub
```typescript
async function sendFile(item: MenuBotItem, phone: string, sock: WASocket) {
  const filePath = path.join(process.env.MEDIA_PATH!, item.fileUrl!.replace('/media/', ''))
  const ext = path.extname(filePath).toLowerCase()

  await sock.sendMessage(`${phone}@s.whatsapp.net`, {
    document: { url: filePath },
    fileName: item.title + ext,
    mimetype: ext === '.pdf' ? 'application/pdf' : 'application/octet-stream',
    caption: item.description || undefined,
  })
}
```

---

## Pages to Build
- `/app/menu-bots` — All menu bots with enable/disable toggle
- `/app/menu-bots/[id]` — Tree view of menu structure with add/edit/delete per item
- Item types: product (image + price + CTA), service (description + price + CTA), download (file upload + message), submenu (just a label)

---

## v2.0 Full Regression Checklist

Before declaring v2.0 complete, test every feature end-to-end:

### Infrastructure
- [ ] HTTPS working at zappix.ng
- [ ] GitHub Actions deploys without errors
- [ ] PostgreSQL backups running daily
- [ ] Redis responding
- [ ] PM2 auto-restarting app on crash

### Auth & Billing
- [ ] Google sign-in works
- [ ] Onboarding completes for new user
- [ ] Paystack subscription created and planId updated
- [ ] Plan limits enforced across all features

### Status Scheduler
- [ ] Single post scheduled and delivered
- [ ] Bulk upload creates 30 posts
- [ ] Calendar shows all posts
- [ ] Failed post retried successfully

### Broadcast Engine
- [ ] Broadcast sent to 100 contacts
- [ ] Personalisation tokens replaced correctly
- [ ] Opt-out stops future broadcasts to that contact
- [ ] Scheduled broadcast delivers on time

### Analytics
- [ ] All KPIs showing correct numbers
- [ ] Period comparison working
- [ ] CSV export downloads correctly

### Referral System
- [ ] Referral link tracks correctly
- [ ] Commission created on payment
- [ ] Monthly release cron works
- [ ] Withdrawal initiated successfully

### Contact Manager
- [ ] CSV import works
- [ ] Segment returns correct contacts
- [ ] Duplicate merge succeeds

### Multi-Account Manager
- [ ] 3 numbers connected simultaneously
- [ ] Team member with Editor role cannot add numbers
- [ ] Activity log records all actions

### Ad Slot Manager
- [ ] Public booking page accessible
- [ ] Full booking → delivery → report flow works

### Chatbot Builder
- [ ] Menu bot navigates correctly
- [ ] Lead captured and stored
- [ ] Human takeover works

### Menu Bot
- [ ] Product catalogue navigable
- [ ] File downloaded from download hub

---

## 🎉 You've built a full SaaS product.

**zappix.ng is live with all 9 features.**

### Next Steps After v2.0
1. Monitor error logs in Sentry for 1 week
2. Interview first 10 paying customers — what do they love, what's broken
3. Start secondary ICP outreach (agencies and e-commerce sellers)
4. Write 5 SEO blog posts targeting "WhatsApp TV Nigeria" keywords
5. Plan v3.0 features based on user feedback
