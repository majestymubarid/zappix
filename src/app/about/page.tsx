import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-6 font-display text-5xl font-black text-gray-900">
              About Zappix
            </h1>
            <p className="text-xl text-gray-600">
              We&apos;re building the operating system for WhatsApp TV businesses in Nigeria
            </p>
          </div>

          {/* Story */}
          <div className="prose prose-lg prose-gray mx-auto">
            <h2 className="font-display text-3xl font-black">Our Mission</h2>
            <p>
              WhatsApp TV is one of the fastest-growing media formats in Nigeria, with thousands of 
              channels reaching millions of viewers daily. But most WhatsApp TV owners still manage 
              everything manually — copying and pasting messages, posting statuses one by one, and 
              tracking ads in Excel spreadsheets.
            </p>
            <p>
              <strong>Zappix was built to change that.</strong>
            </p>
            <p>
              We believe WhatsApp TV owners deserve professional tools to run their businesses. Tools 
              that help them grow faster, earn more, and work smarter — not harder.
            </p>

            <h2 className="font-display text-3xl font-black">What We Built</h2>
            <p>
              Zappix is the all-in-one platform for WhatsApp TV businesses. It combines:
            </p>
            <ul>
              <li><strong>Scheduling</strong> — Plan your content calendar weeks in advance</li>
              <li><strong>Broadcasting</strong> — Send personalized bulk messages with smart throttling</li>
              <li><strong>Monetization</strong> — Public booking pages where brands can book and pay for ads automatically</li>
              <li><strong>Automation</strong> — AI chatbots that handle FAQs, capture leads, and take orders</li>
              <li><strong>Analytics</strong> — Beautiful dashboards showing your growth and revenue</li>
              <li><strong>Referrals</strong> — Earn 25% lifetime commission on everyone you refer</li>
            </ul>

            <h2 className="font-display text-3xl font-black">Built for Nigeria</h2>
            <p>
              Zappix is built specifically for the Nigerian market. We accept Naira payments via Paystack, 
              handle Nigerian phone number formats (+234), and understand the unique needs of WhatsApp TV 
              businesses in Nigeria.
            </p>
            <p>
              Our pricing is affordable, our support team understands your business, and our platform 
              is designed to help you succeed in the Nigerian WhatsApp TV ecosystem.
            </p>

            <h2 className="font-display text-3xl font-black">Our Values</h2>
            <ul>
              <li><strong>Transparency</strong> — No hidden fees. Simple pricing. Clear communication.</li>
              <li><strong>Reliability</strong> — Your business depends on us. We take uptime seriously.</li>
              <li><strong>Innovation</strong> — We ship new features every week based on your feedback.</li>
              <li><strong>Support</strong> — Real humans who understand WhatsApp TV businesses help you succeed.</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl border bg-gray-50 p-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-black text-gray-900">
              Join hundreds of WhatsApp TV owners
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-green-600 px-8 py-6 text-lg font-bold hover:bg-green-700">
                Start Free Trial →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
