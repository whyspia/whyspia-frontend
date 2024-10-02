"use client"

import React from 'react'
import Header from '../components/Header'
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { GlobalContextComponent } from 'lib/GlobalContext'
export { GlobalContext } from 'lib/GlobalContext'
import { ClientWrapper } from 'lib/ClientWrapper'
import ModalRoot from 'components/modals/ModalRoot'
import { Toaster } from 'react-hot-toast'

import { QueryClient, QueryClientProvider } from 'react-query'

import { ParticleConnectkit } from "modules/particle-network/components/ParticleConnectkit"

const queryClient = new QueryClient()

export default function ClientLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {
  const isDowntimeMode = false

  return (
    // suppressHydrationWarning is needed bc warning caused by next-themes adding stuffz
    <html lang="en" suppressHydrationWarning> 
      <body>
        <QueryClientProvider client={queryClient}>
          <ParticleConnectkit>
            <GlobalContextComponent>
              <ClientWrapper>
                <ThemeProvider attribute="class" defaultTheme="dark">
                  <div className="min-h-screen py-20 dark:text-white">
                    <Header />

                    {isDowntimeMode && (
                      <div className="pb-6 border-b border-red-500">
                        <div className="text-2xl font-bold text-center mb-2 text-red-500">we are dead rn - be back soon...we hope...dont expect things to work lol</div>
                        <div className="text-lg font-bold text-center text-red-500">shmoji&apos;s predicted downtime: 8/28/2024 5pm EST to 8/29/2024 5pm EST</div>
                      </div>
                    )}

                    <div>
                      {children}
                    </div>

                    <ModalRoot />

                    <Toaster />
                  </div>
                </ThemeProvider>
              </ClientWrapper>
            </GlobalContextComponent>
          </ParticleConnectkit>
        </QueryClientProvider>
      </body>
    </html>
  )
}
