'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
              <span className="text-2xl font-black text-green-600">Z</span>
            </div>
            <span className="text-2xl font-black text-white">Zappix</span>
          </Link>
        </div>

        <div className="text-white">
          <h2 className="mb-6 font-display text-4xl font-black">
            Start growing your WhatsApp TV today
          </h2>
          <p className="mb-8 text-lg text-green-50">
            Join thousands of WhatsApp TV owners who are scaling their businesses with Zappix.
          </p>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">14-day free trial</p>
                <p className="text-sm text-green-100">Full access to all features, no credit card required</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Cancel anytime</p>
                <p className="text-sm text-green-100">No long-term contracts or commitments</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">7-day money-back guarantee</p>
                <p className="text-sm text-green-100">Full refund if you&apos;re not satisfied</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-green-100">
          <p>&quot;Zappix transformed how I run my WhatsApp TV. I went from posting manually to scheduling 
          30 days in advance. Game changer!&quot;</p>
          <p className="mt-2 font-semibold">— Tunde, WhatsApp TV Owner</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-gray-50 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center justify-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                <span className="text-2xl font-black text-white">Z</span>
              </div>
              <span className="text-2xl font-black text-gray-900">Zappix</span>
            </Link>
          </div>

          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="mb-2 font-display text-3xl font-black text-gray-900">
                Start your free trial
              </h1>
              <p className="text-gray-600">
                14 days free. No credit card required.
              </p>
            </div>

            <Button
              onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
              className="w-full bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 h-12 font-semibold"
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Free trial benefits</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Full access to all features
              </li>
              <li className="flex items-center">
                <svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No credit card required
              </li>
              <li className="flex items-center">
                <svg className="mr-2 h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cancel anytime
              </li>
            </ul>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-green-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="/legal/terms" className="text-green-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="text-green-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
