import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-8 font-display text-5xl font-black text-gray-900">
            Terms of Service
          </h1>
          <p className="mb-12 text-gray-600">
            Last updated: March 20, 2026
          </p>

          <div className="prose prose-lg prose-gray max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Zappix (&quot;the Service&quot;), you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Zappix provides a software platform for managing WhatsApp business accounts, including but not limited to:
            </p>
            <ul>
              <li>WhatsApp message scheduling and broadcasting</li>
              <li>Contact management and CRM features</li>
              <li>Ad slot management and booking</li>
              <li>Chatbot and automation tools</li>
              <li>Analytics and reporting</li>
              <li>Referral and commission system</li>
            </ul>

            <h2>3. Use of WhatsApp</h2>
            <p>
              Zappix connects to WhatsApp using the WhatsApp Web protocol. You acknowledge and agree that:
            </p>
            <ul>
              <li>Zappix is not affiliated with, endorsed by, or officially connected with WhatsApp Inc. or Meta Platforms Inc.</li>
              <li>WhatsApp may restrict or ban accounts that use third-party tools, including Zappix</li>
              <li>Zappix is not responsible for any account restrictions, bans, or suspensions imposed by WhatsApp</li>
              <li>You use Zappix at your own risk and accept full responsibility for compliance with WhatsApp&apos;s Terms of Service</li>
              <li>You will not use Zappix to send spam, unsolicited messages, or violate any applicable laws</li>
            </ul>

            <h2>4. Account Registration</h2>
            <p>
              To use Zappix, you must:
            </p>
            <ul>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Be at least 18 years of age</li>
              <li>Accept our risk disclosure regarding WhatsApp account restrictions</li>
            </ul>

            <h2>5. Subscription and Payment</h2>
            <p>
              Zappix offers subscription plans with monthly or yearly billing:
            </p>
            <ul>
              <li>All prices are in Nigerian Naira (₦) unless otherwise stated</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Payment is processed via Paystack</li>
              <li>You are responsible for all applicable taxes</li>
              <li>See our Refund Policy for cancellation terms</li>
            </ul>

            <h2>6. Acceptable Use</h2>
            <p>
              You agree not to use Zappix to:
            </p>
            <ul>
              <li>Send spam or unsolicited commercial messages</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Distribute malware or harmful content</li>
              <li>Impersonate others or provide false information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>

            <h2>7. Data and Privacy</h2>
            <p>
              Your use of Zappix is also governed by our Privacy Policy. We collect and process data as described 
              in that policy to provide and improve the Service.
            </p>

            <h2>8. Intellectual Property</h2>
            <p>
              The Service, including all content, features, and functionality, is owned by Zappix and is protected 
              by international copyright, trademark, and other intellectual property laws.
            </p>

            <h2>9. Service Availability</h2>
            <p>
              While we strive for 99.9% uptime, we do not guarantee uninterrupted access to the Service. We may 
              suspend or discontinue features with reasonable notice.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              Zappix is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
            </p>
            <ul>
              <li>WhatsApp account restrictions or bans</li>
              <li>Loss of data or business interruption</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Third-party actions or service failures</li>
            </ul>

            <h2>11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms. You may cancel 
              your subscription at any time from your account settings.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Service after changes constitutes 
              acceptance of the new Terms.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be 
              resolved in Nigerian courts.
            </p>

            <h2>14. Contact Us</h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@zappix.ng" className="text-green-600 hover:underline">legal@zappix.ng</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
