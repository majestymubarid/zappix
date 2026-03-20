import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ReferralPage({ params }: { params: { slug: string } }) {
  const code = await prisma.referralCode.findUnique({
    where: { linkSlug: params.slug },
    include: { user: { select: { name: true, image: true } } },
  })

  if (!code) redirect('/signup')

  // Set referral cookie (30 days)
  const cookieStore = cookies()
  cookieStore.set('zappix_ref', code.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
    httpOnly: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm border max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold mb-2">
          {code.user.name} invited you to Zappix
        </h1>
        <p className="text-gray-500 mb-6">
          The operating system for WhatsApp TV businesses.
          Schedule posts, sell ad slots, grow your audience.
        </p>
        <Link 
          href="/signup"
          className="block bg-green-600 text-white py-3 px-8 rounded-full font-bold hover:bg-green-700"
        >
          Start Free Trial →
        </Link>
        <p className="text-xs text-gray-400 mt-4">No credit card required</p>
      </div>
    </div>
  )
}
