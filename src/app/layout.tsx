import type { Metadata } from 'next'
import { Nunito, Fraunces } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['800', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'Zappix - The Operating System for WhatsApp TV Businesses',
    template: '%s | Zappix',
  },
  description: 'Run your WhatsApp TV like a real media company. Schedule posts, automate broadcasts, sell ad slots, and grow your audience. Built for Nigerian WhatsApp TV owners.',
  keywords: ['WhatsApp TV', 'WhatsApp Business', 'Broadcast', 'Status Scheduler', 'Nigeria', 'Ad Slots', 'Chatbot', 'Analytics'],
  authors: [{ name: 'Zappix' }],
  creator: 'Zappix',
  publisher: 'Zappix',
  metadataBase: new URL('https://zappix.ng'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://zappix.ng',
    title: 'Zappix - The Operating System for WhatsApp TV Businesses',
    description: 'Run your WhatsApp TV like a real media company. Schedule posts, automate broadcasts, sell ad slots, and grow your audience.',
    siteName: 'Zappix',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zappix - WhatsApp TV Management Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zappix - The Operating System for WhatsApp TV Businesses',
    description: 'Run your WhatsApp TV like a real media company. Schedule posts, automate broadcasts, sell ad slots, and grow your audience.',
    images: ['/og-image.png'],
    creator: '@zappix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${fraunces.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
