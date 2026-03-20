import { router } from './trpc'
import { userRouter } from './routers/user'
import { accountsRouter } from './routers/accounts'
import { schedulerRouter } from './routers/scheduler'
import { broadcastsRouter } from './routers/broadcasts'
import { analyticsRouter } from './routers/analytics'
import { referralsRouter } from './routers/referrals'
import { contactsRouter } from './routers/contacts'
import { listsRouter } from './routers/lists'
import { tagsRouter } from './routers/tags'
import { teamRouter } from './routers/team'
import { adsRouter } from './routers/ads'
import { botsRouter } from './routers/bots'
import { menuBotsRouter } from './routers/menu-bots'

export const appRouter = router({
  // Phase 1 & 2
  user: userRouter,
  accounts: accountsRouter,
  
  // Phase 3
  scheduler: schedulerRouter,
  
  // Phase 4
  broadcasts: broadcastsRouter,
  
  // Phase 5
  analytics: analyticsRouter,
  
  // Phase 6
  referrals: referralsRouter,
  
  // Phase 7
  contacts: contactsRouter,
  lists: listsRouter,
  tags: tagsRouter,
  
  // Phase 8
  team: teamRouter,
  
  // Phase 9
  ads: adsRouter,
  
  // Phase 10 & 11
  bots: botsRouter,
  menuBots: menuBotsRouter,
})

export type AppRouter = typeof appRouter
