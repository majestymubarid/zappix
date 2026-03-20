import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="container mx-auto">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              <span className="mr-2">🚀</span> The #1 WhatsApp TV Management Platform
            </div>
            
            <h1 className="mb-6 font-display text-5xl font-black tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Run your WhatsApp TV like a{' '}
              <span className="text-green-600">real media company</span>
            </h1>
            
            <p className="mb-10 text-xl leading-relaxed text-gray-600">
              Schedule posts, automate broadcasts, sell ad slots, and grow your audience. 
              Zappix is the operating system for WhatsApp TV businesses in Nigeria.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="w-full bg-green-600 px-8 py-6 text-lg font-bold hover:bg-green-700 sm:w-auto">
                  Start Free Trial →
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="w-full px-8 py-6 text-lg font-bold sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Audience Growth</h3>
              <p className="leading-relaxed text-gray-600">
                Schedule status updates, send bulk messages, and use smart engagement tools to grow your reach organically.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Monetization</h3>
              <p className="leading-relaxed text-gray-600">
                Public booking pages where brands can book and pay for ads automatically. Full analytics and performance reports included.
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">Automation</h3>
              <p className="leading-relaxed text-gray-600">
                AI-powered chatbots, auto-replies, smart menus, and scheduled workflows. Work smarter, not harder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-black text-gray-900">
              Everything you need to scale
            </h2>
            <p className="text-lg text-gray-600">
              Built specifically for WhatsApp TV owners, agencies, and businesses in Nigeria
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '📅', title: 'Status Scheduler', desc: 'Schedule posts 30 days in advance. Never miss a post again.' },
              { icon: '📢', title: 'Broadcast Engine', desc: 'Send personalized bulk messages with smart throttling and warm-up protection.' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Track reach, engagement, revenue, and growth with beautiful charts.' },
              { icon: '💰', title: 'Ad Slot Manager', desc: 'Public booking pages with Paystack payment and auto-delivery.' },
              { icon: '👥', title: 'Contact CRM', desc: 'Import contacts, create segments, manage lists and tags.' },
              { icon: '🤖', title: 'Smart Chatbots', desc: 'Auto-replies, FAQ, lead capture, order collection, and payment links.' },
              { icon: '🏪', title: 'Menu Bot', desc: 'Turn your WhatsApp into an interactive storefront with product catalog.' },
              { icon: '🎁', title: 'Referral System', desc: 'Earn 25% lifetime commission on all referred customers.' },
              { icon: '👨‍💼', title: 'Team Management', desc: 'Invite team members with role-based access control.' },
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-3 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/features">
              <Button variant="outline" size="lg" className="font-semibold">
                View All Features →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-black text-gray-900">
              Trusted by WhatsApp TV owners across Nigeria
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { stat: '10,000+', label: 'Messages sent daily' },
              { stat: '500+', label: 'WhatsApp TV owners' },
              { stat: '₦50M+', label: 'Ad revenue processed' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="mb-2 font-display text-5xl font-black text-green-600">{item.stat}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h2 className="mb-6 font-display text-4xl font-black sm:text-5xl">
              Ready to grow your WhatsApp TV?
            </h2>
            <p className="mb-10 text-xl text-green-50">
              Join hundreds of WhatsApp TV owners who are scaling their businesses with Zappix.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white px-8 py-6 text-lg font-bold text-green-600 hover:bg-gray-100">
                Start Your Free Trial →
              </Button>
            </Link>
            <p className="mt-4 text-sm text-green-100">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
