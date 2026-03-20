import { router } from './trpc'
import { userRouter } from './routers/user'
import { accountsRouter } from './routers/accounts'
import { schedulerRouter } from './routers/scheduler'
import { broadcastsRouter } from './routers/broadcasts'
import { analyticsRouter } from './routers/analytics'
import { referralsRouter } from './routers/referrals'

export const appRouter = router({
  user: userRouter,
  accounts: accountsRouter,
  scheduler: schedulerRouter,
  broadcasts: broadcastsRouter,
  analytics: analyticsRouter,
  referrals: referralsRouter,
})

export type AppRouter = typeof appRouter
