# Phase 8 — Multi-Account Manager
**Weeks 14–15 | "v1.2"**

> At the end of this phase: Users can connect multiple numbers, create link groups, invite team members with roles, and view a full activity log.

---

## ✅ Acceptance Criteria
- [ ] Multiple WhatsApp numbers can be connected (up to plan limit)
- [ ] Each number has a status indicator (connected/disconnected/reconnecting)
- [ ] Numbers can be paused (stops all scheduled posts and bots)
- [ ] Link groups allow shared scheduling across grouped numbers
- [ ] Team member invite sends email and creates pending membership
- [ ] Editor role cannot connect/disconnect numbers or manage team
- [ ] Viewer role cannot create or edit anything
- [ ] Activity log records every action with actor, timestamp, number
- [ ] Disconnected number alerts sent via email

---

## Key Implementation Notes

### Connection Status Monitor
Run a health check every 60 seconds:

```typescript
// src/app/api/cron/check-connections/route.ts
export async function GET() {
  const numbers = await prisma.whatsappNumber.findMany({
    where: { isActive: true },
  })

  for (const number of numbers) {
    const isConnected = waManager.isConnected(number.id)
    const newStatus = isConnected ? 'connected' : 'disconnected'

    if (number.connectionStatus !== newStatus) {
      await prisma.whatsappNumber.update({
        where: { id: number.id },
        data: { connectionStatus: newStatus },
      })

      // Alert owner if disconnected
      if (newStatus === 'disconnected') {
        await sendDisconnectionAlert(number)
      }
    }
  }
}
```

Crontab:
```bash
* * * * * curl -s https://zappix.ng/api/cron/check-connections
```

### Role-Based Access in tRPC
```typescript
// Middleware to check team member access
export const teamProtectedProcedure = protectedProcedure.use(async ({ ctx, next, rawInput }) => {
  const targetUserId = (rawInput as any)?.ownerId || ctx.session.user.id

  if (targetUserId === ctx.session.user.id) return next({ ctx })

  const membership = await ctx.prisma.teamMember.findFirst({
    where: {
      ownerId: targetUserId,
      memberId: ctx.session.user.id,
      inviteStatus: 'accepted',
    },
  })

  if (!membership) throw new TRPCError({ code: 'FORBIDDEN' })

  return next({ ctx: { ...ctx, teamRole: membership.role, viewingAs: targetUserId } })
})
```

---

## Pages to Build
- `/app/accounts` — Number cards with status dots, warm-up progress bars, quick actions
- `/app/accounts/new` — QR code scan modal with step-by-step instructions
- `/app/accounts/[id]` — Number settings, warm-up status, bot assignment
- `/app/accounts/team` — Invite form, member list with role badges, revoke access
- `/app/accounts/activity` — Log table with filters

---

## ✅ Phase 8 Complete When:
- [ ] 3 numbers connected simultaneously without issues
- [ ] Editor team member can schedule posts but cannot add new numbers
- [ ] Activity log shows all actions from all team members
- [ ] Owner receives email when any number disconnects

**➡️ Next: [PHASE-09-ad-slot-manager.md](./PHASE-09-ad-slot-manager.md)**
