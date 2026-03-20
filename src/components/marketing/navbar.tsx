import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
              <span className="text-xl font-black text-white">Z</span>
            </div>
            <span className="text-xl font-black text-gray-900">Zappix</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-green-600 hover:bg-green-700">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
