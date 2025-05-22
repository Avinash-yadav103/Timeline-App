import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Timeline Workspace',
  description: 'Avinash',
  generator: 'https://github.com/Avinash-yadav103',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
