import type { ReactNode } from 'react'
import '../styles/globals.css'

export const metadata = {
  title: 'whyspia',
  description: 'welcome to whyspia frens',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-dark3 text-white">
        {children}
      </body>
    </html>
  )
}
