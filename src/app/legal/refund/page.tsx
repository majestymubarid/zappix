import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-8 font-display text-5xl font-black text-gray-900">
            Refund Policy
          </h1>
          <p className="mb-12 text-gray-600">
            Last updated: March 20, 2026
          </p>

          <div className="prose prose-lg prose-gray max-w-none">
            <h2>7-Day Money-Back Guarantee</h2>
            <p>
              We want you to be completely satisfied with Zappix. If you&apos;re not happy with your subscription 
              within the first 7 days, we&apos;ll give you a full refund — no questions asked.
            </p>

            <h2>How to Request a Refund</h2>
            <p>To request a refund within the 7-day window:</p>
            <ol>
              <li>Email us at <a href="mailto:support@zappix.ng" className="text-green-600 hover:underline">support@zappix.ng</a></li>
              <li>Include your account email and reason for cancellation (optional)</li>
              <li>We&apos;ll process your refund within 3-5 business days</li>
            </ol>

            <h2>Refund Method</h2>
            <p>
              Refunds are processed back to your original payment method via Paystack. Depending on your bank, 
              it may take 3-5 business days for the funds to appear in your account.
            </p>

            <h2>What Happens After Refund</h2>
            <p>Once a refund is issued:</p>
            <ul>
              <li>Your subscription will be cancelled immediately</li>
              <li>Access to premium features will be revoked</li>
              <li>Your data will be retained for 30 days in case you want to reactivate</li>
              <li>After 30 days, your data will be permanently deleted</li>
            </ul>

            <h2>Refunds After 7 Days</h2>
            <p>
              After the 7-day guarantee period, refunds are not automatically provided. However, we may offer 
              refunds on a case-by-case basis for:
            </p>
            <ul>
              <li>Extended service outages (beyond our SLA)</li>
              <li>Billing errors or duplicate charges</li>
              <li>Other exceptional circumstances</li>
            </ul>
            <p>
              To request a refund after 7 days, contact{' '}
              <a href="mailto:support@zappix.ng" className="text-green-600 hover:underline">support@zappix.ng</a>{' '}
              with details of your situation.
            </p>

            <h2>Cancellation Without Refund</h2>
            <p>
              You can cancel your subscription at any time from your account settings. When you cancel:
            </p>
            <ul>
              <li>You&apos;ll have access until the end of your current billing period</li>
              <li>No further charges will be made</li>
              <li>No refund will be provided for the current billing period (unless within 7-day guarantee)</li>
            </ul>

            <h2>Pro-Rated Refunds for Downgrades</h2>
            <p>
              If you downgrade from a higher plan to a lower plan mid-cycle, we do not provide pro-rated refunds. 
              The downgrade will take effect at the start of your next billing cycle.
            </p>

            <h2>Referral Commission Refunds</h2>
            <p>
              Referral commissions are earned when your referred customers make payments. If a referred customer 
              requests a refund within their 7-day window:
            </p>
            <ul>
              <li>The associated commission will be reversed</li>
              <li>If the commission has already been withdrawn, it will be deducted from your next earnings</li>
            </ul>

            <h2>Chargebacks</h2>
            <p>
              If you initiate a chargeback instead of contacting us first, your account will be immediately 
              suspended pending investigation. We strongly encourage you to contact our support team first 
              to resolve any billing issues.
            </p>

            <h2>Contact Us</h2>
            <p>
              For refund requests or questions about this policy:{' '}
              <a href="mailto:support@zappix.ng" className="text-green-600 hover:underline">support@zappix.ng</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
