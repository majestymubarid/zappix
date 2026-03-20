import { router } from './trpc'
import { userRouter } from './routers/user'

export const appRouter = router({
  user: userRouter,
  // Additional routers will be added in respective phases:
  // Phase 2: auth, onboarding, billing
  // Phase 3: scheduler
  // Phase 4: broadcasts
  // Phase 5: analytics
  // Phase 6: referrals
  // Phase 7: contacts
  // Phase 8: accounts (multi-account)
  // Phase 9: ads
  // Phase 10: bots
  // Phase 11: menuBots
})

export type AppRouter = typeof appRouter
