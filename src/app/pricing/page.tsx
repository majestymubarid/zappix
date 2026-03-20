import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Creator',
      price: '15,000',
      yearlyPrice: '150,000',
      description: 'Perfect for individual WhatsApp TV owners getting started',
      features: [
        'Up to 2 WhatsApp numbers',
        '10,000 contacts',
        '20 broadcasts per month',
        '60 status posts per month',
        '3 ad slots',
        '5GB media storage',
        'Basic analytics',
        'Email support',
      ],
      cta: 'Start Free Trial',
      highlighted: false,
    },
    {
      name: 'Growth',
      price: '35,000',
      yearlyPrice: '350,000',
      description: 'For established channels ready to scale',
      features: [
        'Up to 10 WhatsApp numbers',
        '100,000 contacts',
        '200 broadcasts per month',
        '500 status posts per month',
        'Up to 5 team members',
        '20 ad slots',
        '20GB media storage',
        'Advanced bot builder',
        'Full analytics & insights',
        'CSV export',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Agency',
      price: '75,000',
      yearlyPrice: '750,000',
      description: 'For agencies managing multiple clients',
      features: [
        'Unlimited WhatsApp numbers',
        'Unlimited contacts',
        'Unlimited broadcasts',
        'Unlimited status posts',
        'Unlimited team members',
        'Unlimited ad slots',
        '100GB media storage',
        'Advanced bot builder',
        'Full analytics & insights',
        'CSV & PDF export',
        'API access',
        'White-label options',
        'Dedicated account manager',
        '24/7 priority support',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 font-display text-5xl font-black text-gray-900">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'border-green-600 bg-green-50 shadow-xl ring-2 ring-green-600'
                    : 'bg-white shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 inline-flex rounded-full bg-green-600 px-4 py-1 text-sm font-bold text-white">
                    Most Popular
                  </div>
                )}

                <h3 className="mb-2 text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mb-6 text-sm text-gray-600">{plan.description}</p>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-black text-gray-900">₦{plan.price}</span>
                    <span className="ml-2 text-gray-600">/month</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    or ₦{plan.yearlyPrice}/year (save 2 months)
                  </div>
                </div>

                <Link href="/signup">
                  <Button
                    className={`mb-8 w-full py-6 font-bold ${
                      plan.highlighted
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <Check className="mr-3 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="mb-12 text-center font-display text-3xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto max-w-3xl space-y-6">
              {[
                {
                  q: 'Can I switch plans later?',
                  a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all Nigerian bank cards, USSD, and bank transfers via Paystack.',
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No setup fees. You only pay the monthly or yearly subscription price.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes, you can cancel your subscription at any time. Your data will be available for 30 days after cancellation.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'Yes, we offer a 7-day money-back guarantee. See our refund policy for details.',
                },
              ].map((faq, i) => (
                <div key={i} className="rounded-xl border bg-white p-6">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
