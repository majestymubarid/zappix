import { initTRPC, TRPCError } from '@trpc/server'
import { Context } from './context'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape
  },
})

// Middleware to check if user is authenticated
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  })
})

// Middleware to check if user has completed onboarding
const isOnboarded = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { onboarded: true },
  })

  if (!user?.onboarded) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Please complete onboarding first',
    })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.session.user,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
export const onboardedProcedure = t.procedure.use(isAuthed).use(isOnboarded)
