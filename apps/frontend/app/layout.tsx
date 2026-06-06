import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Qred',
  description: 'Qred business finance dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
