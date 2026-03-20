import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="mb-8 font-display text-5xl font-black text-gray-900">
            Privacy Policy
          </h1>
          <p className="mb-12 text-gray-600">
            Last updated: March 20, 2026
          </p>

          <div className="prose prose-lg prose-gray max-w-none">
            <h2>1. Information We Collect</h2>
            
            <h3>Information You Provide</h3>
            <ul>
              <li><strong>Account Information</strong>: Name, email address, Google account details when you sign up</li>
              <li><strong>Contact Data</strong>: Phone numbers, names, and other details of contacts you import or create</li>
              <li><strong>Content</strong>: Messages, media files, and other content you create or upload</li>
              <li><strong>Payment Information</strong>: Billing details processed securely via Paystack (we never store full card numbers)</li>
              <li><strong>Business Information</strong>: Account type, industry, WhatsApp number details</li>
            </ul>

            <h3>Information Automatically Collected</h3>
            <ul>
              <li><strong>Usage Data</strong>: Features used, pages visited, actions performed</li>
              <li><strong>Technical Data</strong>: IP address, browser type, device information, session data</li>
              <li><strong>WhatsApp Data</strong>: Connection status, message delivery status, conversation metadata</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Provide and maintain the Zappix service</li>
              <li>Process your payments and subscriptions</li>
              <li>Send scheduled messages and broadcasts on your behalf</li>
              <li>Generate analytics and reports</li>
              <li>Track referrals and calculate commissions</li>
              <li>Communicate with you about your account and our services</li>
              <li>Improve and develop new features</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>

            <h2>3. Data Storage and Security</h2>
            <p>
              Your data is stored securely on servers in Nigeria. We implement industry-standard security measures including:
            </p>
            <ul>
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure database access controls</li>
              <li>Regular security audits and updates</li>
              <li>Restricted employee access to user data</li>
            </ul>

            <h2>4. Data Sharing</h2>
            <p>We share your data only in these circumstances:</p>
            <ul>
              <li><strong>With WhatsApp</strong>: When you connect your WhatsApp number, message data is transmitted to WhatsApp servers</li>
              <li><strong>With Paystack</strong>: Payment processing and bank transfers</li>
              <li><strong>With Service Providers</strong>: Email delivery (Resend), hosting, and infrastructure partners</li>
              <li><strong>Legal Requirements</strong>: If required by Nigerian law or valid legal process</li>
              <li><strong>Business Transfers</strong>: In case of merger, acquisition, or sale of assets</li>
            </ul>
            <p>We never sell your personal data to third parties.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access</strong>: Request a copy of your data</li>
              <li><strong>Correction</strong>: Update or correct inaccurate data</li>
              <li><strong>Deletion</strong>: Request deletion of your account and data (subject to legal retention requirements)</li>
              <li><strong>Export</strong>: Download your data in a portable format</li>
              <li><strong>Opt-Out</strong>: Unsubscribe from marketing emails</li>
            </ul>

            <h2>6. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your login session</li>
              <li>Track referral sources (30-day cookies)</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
            </ul>

            <h2>7. WhatsApp Data</h2>
            <p>
              When you connect a WhatsApp number, Zappix stores session data locally and accesses WhatsApp 
              via the WhatsApp Web protocol. We:
            </p>
            <ul>
              <li>Do not store your WhatsApp messages permanently</li>
              <li>Only access data necessary to provide the Service</li>
              <li>Encrypt session data</li>
              <li>Delete session data when you disconnect a number</li>
            </ul>

            <h2>8. Data Retention</h2>
            <ul>
              <li><strong>Active Accounts</strong>: Data retained while your account is active</li>
              <li><strong>Cancelled Accounts</strong>: Data retained for 30 days, then deleted (except as required by law)</li>
              <li><strong>Legal Requirements</strong>: Some data may be retained longer for legal or regulatory compliance</li>
            </ul>

            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Zappix is not intended for users under 18 years of age. We do not knowingly collect data from children.
            </p>

            <h2>10. International Data Transfers</h2>
            <p>
              Your data is primarily stored in Nigeria. If transferred internationally, we ensure appropriate 
              safeguards are in place.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via 
              email or in-app notification.
            </p>

            <h2>12. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us at:{' '}
              <a href="mailto:privacy@zappix.ng" className="text-green-600 hover:underline">privacy@zappix.ng</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
