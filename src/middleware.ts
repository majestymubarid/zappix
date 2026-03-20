import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAppRoute = req.nextUrl.pathname.startsWith('/dashboard')
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') ||
                      req.nextUrl.pathname.startsWith('/signup')
  const isOnboarding = req.nextUrl.pathname.startsWith('/onboarding')

  if (isAppRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  // Redirect to onboarding if not completed
  if (isAppRoute && isLoggedIn && req.auth?.user && !req.auth.user.onboarded && !isOnboarding) {
    return NextResponse.redirect(new URL('/onboarding', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/onboarding'],
}
