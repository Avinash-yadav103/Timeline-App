import type { Metadata } from 'next'
import './globals.css'
import { WorkspaceDashboard } from '@/components/workspace-dashboard'

export const metadata: Metadata = {
  title: 'Timeline Workspace',
  description: 'Manage your projects, tasks, and notes in a visual timeline',
  generator: 'https://github.com/Avinash-yadav103',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden">
        <WorkspaceDashboard />
      </body>
    </html>
  )
}
