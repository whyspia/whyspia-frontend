import React, { ReactNode } from 'react'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'whyspia',
  description: 'welcome to whyspia frens',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}
