import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mutual NDA Creator',
  description: 'Create a Mutual Non-Disclosure Agreement using the Common Paper standard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
