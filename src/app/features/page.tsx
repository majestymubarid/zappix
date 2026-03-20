import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/marketing/navbar'
import { Footer } from '@/components/marketing/footer'

export default function FeaturesPage() {
  const features = [
    {
      category: 'Content Management',
      icon: '📅',
      items: [
        {
          title: 'Status Scheduler',
          description: 'Schedule WhatsApp status posts up to 30 days in advance. Upload in bulk, set exact times, and never miss a post again. Content gap detection highlights days without posts.',
        },
        {
          title: 'Bulk Upload',
          description: 'Upload 30 media files at once and assign them to time slots automatically. Perfect for planning your entire month in one sitting.',
        },
        {
          title: 'Calendar View',
          description: 'Visual calendar showing all scheduled posts as thumbnails. Drag and drop to reschedule, quick edit, and see your entire content strategy at a glance.',
        },
      ],
    },
    {
      category: 'Broadcasting',
      icon: '📢',
      items: [
        {
          title: 'Personalized Messages',
          description: 'Use tokens like {firstName}, {city}, {custom1} to personalize every message. Make your broadcasts feel personal and increase engagement.',
        },
        {
          title: 'Smart Throttling',
          description: 'Three speed modes (Safe, Normal, Fast) with intelligent delays between messages. Protects your number from bans while maximizing delivery speed.',
        },
        {
          title: 'Auto-Split',
          description: 'Distribute contacts evenly across multiple numbers automatically. Send to 10,000 contacts using 5 numbers without manual distribution.',
        },
        {
          title: '21-Day Warm-Up',
          description: 'New numbers are automatically enrolled in a warm-up programme. Daily limits increase gradually (0→50→200→500) to build WhatsApp trust.',
        },
        {
          title: 'Opt-Out Management',
          description: 'Keywords like STOP automatically opt users out. JOIN lets them resubscribe. Full compliance with best practices.',
        },
      ],
    },
    {
      category: 'Monetization',
      icon: '💰',
      items: [
        {
          title: 'Ad Slot Manager',
          description: 'Create ad slots (status, broadcast, or combo) and set your price. Each slot gets a unique booking page.',
        },
        {
          title: 'Public Booking Pages',
          description: 'Clients visit zappix.ng/ads/yourname to see available slots, pick dates, upload creatives, and pay via Paystack — all automatic.',
        },
        {
          title: 'Creative Approval',
          description: 'Review uploaded ads before they go live. Approve or reject with one click. Auto-delivery at scheduled time after approval.',
        },
        {
          title: 'Performance Reports',
          description: 'Clients receive a detailed report 24 hours after their ad runs. Shows reach, engagement, and results.',
        },
        {
          title: 'Referral System',
          description: 'Earn 25% lifetime commission on all referred customers. Monthly leaderboard with ₦200k, ₦100k, ₦50k prizes. Withdraw anytime.',
        },
      ],
    },
    {
      category: 'Contact Management',
      icon: '👥',
      items: [
        {
          title: 'CSV Import',
          description: 'Import thousands of contacts in seconds. Column mapper handles any CSV format. Automatic duplicate detection and phone normalization.',
        },
        {
          title: 'Lists & Tags',
          description: 'Organize contacts into lists and apply tags for easy segmentation. Create audiences for targeted broadcasts.',
        },
        {
          title: 'Smart Segments',
          description: 'Build dynamic segments with filters (tag, city, opt-out status, source). Segments update automatically as contacts are added.',
        },
        {
          title: 'Duplicate Detection',
          description: 'Find duplicate contacts automatically. Merge them with one click, inheriting all lists, tags, and custom fields.',
        },
      ],
    },
    {
      category: 'Automation',
      icon: '🤖',
      items: [
        {
          title: 'AI Chatbot',
          description: 'Auto-reply to messages with FAQs, capture leads, collect orders, and send payment links. Works 24/7 without human intervention.',
        },
        {
          title: 'Away Messages',
          description: 'Set up auto-replies for outside business hours, weekends, or custom schedules. Prevent duplicate replies with time limits.',
        },
        {
          title: 'Menu Bot',
          description: 'Turn your WhatsApp into an interactive menu. Products, services, downloads — all navigable with numbers or keywords.',
        },
        {
          title: 'Lead Capture',
          description: 'Multi-step flows collect name, email, phone, and custom fields. Leads stored in database and owner gets instant notification.',
        },
        {
          title: 'Human Takeover',
          description: 'Bot pauses automatically when you manually reply to a contact. Resumes after configured timeout (default 30 mins).',
        },
      ],
    },
    {
      category: 'Analytics & Insights',
      icon: '📊',
      items: [
        {
          title: 'Real-Time Dashboard',
          description: 'KPI cards showing reach, messages sent, replies, opt-outs, revenue. Period-over-period comparison to track growth.',
        },
        {
          title: 'Broadcast Analytics',
          description: 'See send rate, delivery rate, reply rate, and opt-out trends. Identify your best and worst performing broadcasts.',
        },
        {
          title: 'Audience Growth',
          description: 'Track contact list growth over time with beautiful area charts. See where your contacts come from (imports, bot captures, manual).',
        },
        {
          title: 'CSV Export',
          description: 'Export broadcast history, contact lists, and analytics data to Excel. Available on Growth and Agency plans.',
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-20 text-center">
            <h1 className="mb-6 font-display text-5xl font-black text-gray-900">
              Everything you need to run a professional WhatsApp TV
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Built specifically for WhatsApp TV owners, agencies, and businesses in Nigeria. 
              All the features you need in one powerful platform.
            </p>
          </div>

          {/* Features by Category */}
          <div className="space-y-20">
            {features.map((category, i) => (
              <div key={i}>
                <div className="mb-8 flex items-center">
                  <span className="mr-4 text-5xl">{category.icon}</span>
                  <h2 className="font-display text-3xl font-black text-gray-900">
                    {category.category}
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, j) => (
                    <div key={j} className="rounded-xl border bg-white p-6 shadow-sm">
                      <h3 className="mb-3 text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="leading-relaxed text-gray-600">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-2xl bg-green-600 p-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-black text-white">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-green-50">
              Try Zappix free for 14 days. No credit card required.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white px-8 py-6 text-lg font-bold text-green-600 hover:bg-gray-100">
                Start Your Free Trial →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
