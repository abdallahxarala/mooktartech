// Force dynamic rendering globally
export const dynamic = 'force-dynamic'
export const revalidate = 0

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Multitenant Platform',
  description: 'Foire Dakar 2025, Xarala Solutions, Mooktar Tech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}

