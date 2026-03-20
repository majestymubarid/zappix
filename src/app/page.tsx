import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-display text-5xl font-black tracking-tight text-[#0F172A] sm:text-6xl lg:text-7xl">
              Run your WhatsApp TV like a{" "}
              <span className="text-[#16A34A]">real media company</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-[#334155]">
              Schedule posts, automate broadcasts, sell ad slots, and grow your
              audience. Zappix is the operating system for WhatsApp TV businesses.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#16A34A] px-8 py-6 text-lg font-bold hover:bg-[#22C55E]"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-bold"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="mt-24 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <svg
                  className="h-6 w-6 text-[#16A34A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#0F172A]">
                Audience Growth
              </h3>
              <p className="text-[#334155]">
                Schedule status updates, bulk messaging, and smart engagement tools
                to grow your reach.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <svg
                  className="h-6 w-6 text-[#16A34A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#0F172A]">
                Monetization
              </h3>
              <p className="text-[#334155]">
                Public booking pages where brands book and pay for ads
                automatically. Full analytics included.
              </p>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#F0FDF4]">
                <svg
                  className="h-6 w-6 text-[#16A34A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#0F172A]">
                Automation
              </h3>
              <p className="text-[#334155]">
                Chatbots, auto-replies, contact management, and menu bots to run
                your business on autopilot.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 rounded-2xl bg-[#16A34A] p-12 text-center text-white">
            <h2 className="font-display text-3xl font-black sm:text-4xl">
              Join 100+ WhatsApp TV Owners
            </h2>
            <p className="mt-4 text-lg opacity-90">
              First 100 signups get lifetime founding member pricing
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="mt-8 bg-white px-8 py-6 text-lg font-bold text-[#16A34A] hover:bg-gray-100"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center text-sm text-[#334155]">
          <p>&copy; 2026 Zappix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
