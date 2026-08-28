import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://reccli.com'),
  title: 'RecCli — Temporal Memory Engine for AI Coding Agents',
  description: 'Give Claude Code long-horizon memory. Tri-layer memory engine that preserves full reasoning, keeps active context small, and recovers exact prior discussion across sessions.',
  keywords: ['AI memory', 'Claude Code memory', 'coding agent memory', 'temporal memory', 'AI coding tools', 'agent memory', 'session memory', 'cross-session continuity', 'MCP server', 'Anthropic Claude', 'developer tools', 'AI agent context', 'long-horizon memory', 'engineering workflow memory'],
  publisher: 'RecCli',
  icons: {
    icon: '/icon.jpg',
    shortcut: '/icon.jpg',
    apple: '/icon.jpg',
  },
  alternates: {
    canonical: 'https://reccli.com',
  },
  openGraph: {
    title: 'RecCli — Temporal Memory Engine for AI Coding Agents',
    description: 'Tri-layer memory for AI coding agents. Preserve full reasoning, keep active context small, recover exact prior discussion across sessions.',
    url: 'https://reccli.com',
    siteName: 'RecCli',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RecCli — Temporal Memory Engine for AI Coding Agents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RecCli — Temporal Memory Engine for AI Coding Agents',
    description: 'Tri-layer memory for AI coding agents. Preserve full reasoning, keep active context small, recover exact prior discussion across sessions.',
    creator: '@reccli_app',
    images: ['/og-image.png'],
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
