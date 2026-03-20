import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      onboarded?: boolean
      planId?: string | null
      accountType?: string | null
    }
  }

  interface User {
    onboarded?: boolean
    planId?: string | null
    accountType?: string | null
  }
}
