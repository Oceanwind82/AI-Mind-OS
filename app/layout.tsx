import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Mind OS',
  description: 'AI-powered learning platform',
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
