import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function PublicAdBookingPage({ params }: { params: { username: string } }) {
  // Find user by referral slug
  const referralCode = await prisma.referralCode.findFirst({
    where: { linkSlug: params.username },
    include: {
      user: {
        include: {
          adSlots: {
            where: { isActive: true },
            include: {
              numbers: { include: { number: true } },
            },
          },
        },
      },
    },
  })

  if (!referralCode || referralCode.user.adSlots.length === 0) {
    redirect('/signup')
  }

  const user = referralCode.user

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Book Ad Space with {user.name}</h1>
          <p className="text-gray-600 text-lg">
            Reach thousands of engaged WhatsApp TV viewers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.adSlots.map(slot => (
            <div key={slot.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{slot.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{slot.slotType} slot</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₦{(slot.price / 100).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated Reach</span>
                  <span className="font-semibold">{slot.estimatedReach.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Numbers</span>
                  <span className="font-semibold">{slot.numbers.length}</span>
                </div>
              </div>

              <a
                href={`/ads/${params.username}/${slot.id}/book`}
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Book This Slot
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by Zappix</p>
        </div>
      </div>
    </div>
  )
}
