import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8)

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'database',
  },
  callbacks: {
    async signIn({ user, account }: any) {
      // Create referral code on first sign-in
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { referralCode: true },
        })

        if (existingUser && !existingUser.referralCode) {
          // Generate unique referral code
          let code = nanoid()
          let slug = user.email?.split('@')[0]?.toLowerCase() || nanoid().toLowerCase()
          
          // Ensure slug is unique
          let slugExists = await prisma.referralCode.findUnique({
            where: { linkSlug: slug },
          })
          
          if (slugExists) {
            slug = `${slug}-${nanoid().toLowerCase().substring(0, 4)}`
          }

          await prisma.referralCode.create({
            data: {
              userId: user.id,
              code,
              linkSlug: slug,
            },
          })
        }
      }
      return true
    },
    async session({ session, user }: any) {
      if (session?.user) {
        session.user.id = user.id
        // Add custom fields to session if needed
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            onboarded: true,
            planId: true,
            accountType: true,
          },
        })
        
        if (dbUser) {
          session.user.onboarded = dbUser.onboarded
          session.user.planId = dbUser.planId
          session.user.accountType = dbUser.accountType
        }
      }
      return session
    },
  },
  events: {
    async createUser({ user }: any) {
      console.log('New user created:', user.email)
    },
  },
})
