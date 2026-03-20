import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const teamRouter = router({
  // Get team members
  getMembers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.teamMember.findMany({
      where: { ownerId: ctx.user.id },
      include: {
        member: { select: { name: true, email: true, image: true } },
      },
      orderBy: { invitedAt: 'desc' },
    })
  }),

  // Invite team member
  invite: protectedProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(['admin', 'editor', 'viewer']),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if already invited
      const existing = await ctx.prisma.teamMember.findFirst({
        where: {
          ownerId: ctx.user.id,
          inviteEmail: input.email,
          inviteStatus: { not: 'revoked' },
        },
      })

      if (existing) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already invited' })
      }

      // Find or create user
      let member = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      })

      const invite = await ctx.prisma.teamMember.create({
        data: {
          ownerId: ctx.user.id,
          memberId: member?.id || '',
          inviteEmail: input.email,
          role: input.role,
          inviteStatus: member ? 'pending' : 'pending',
        },
      })

      // TODO: Send invite email via Resend

      return invite
    }),

  // Accept invite
  acceptInvite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.teamMember.update({
        where: { id: input, inviteEmail: ctx.user.email! },
        data: {
          memberId: ctx.user.id,
          inviteStatus: 'accepted',
          acceptedAt: new Date(),
        },
      })
    }),

  // Update member role
  updateRole: protectedProcedure
    .input(z.object({
      memberId: z.string(),
      role: z.enum(['admin', 'editor', 'viewer']),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.teamMember.update({
        where: { id: input.memberId, ownerId: ctx.user.id },
        data: { role: input.role },
      })
    }),

  // Revoke access
  revoke: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.teamMember.update({
        where: { id: input, ownerId: ctx.user.id },
        data: { inviteStatus: 'revoked' },
      })
    }),
})
