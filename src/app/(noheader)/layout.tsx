"use client"

import React from 'react'
import 'tailwindcss/tailwind.css'
import '../../styles/globals.css'
import { GlobalContextComponent } from 'lib/GlobalContext'
import { ClientWrapper } from 'lib/ClientWrapper'
import ModalRoot from 'components/modals/ModalRoot'
import { Toaster } from 'react-hot-toast'

import { QueryClient, QueryClientProvider } from 'react-query'

import { ParticleConnectkit } from "modules/particle-network/components/ParticleConnectkit"
import { ThemeProvider } from 'modules/styles/components/ThemeProvider'
import Footer from 'components/Footer'

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
      {/* this adds React devtools for debugging - need browser extension too tho */}
      {/* <script src="http://localhost:8097"></script> */}
      <body className="flex flex-col min-h-screen dark:bg-dark2">
        <QueryClientProvider client={queryClient}>
          <ParticleConnectkit>
            <GlobalContextComponent>
              <ClientWrapper>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                  <div className="flex flex-col min-h-screen dark:text-white">
                    {/* <Header /> */}

                    {isDowntimeMode && (
                      <div className="pb-6 border-b border-red-500">
                        <div className="text-2xl font-bold text-center mb-2 text-red-500">we are dead rn - be back soon...we hope...dont expect things to work lol</div>
                        <div className="text-lg font-bold text-center text-red-500">shmoji&apos;s predicted downtime: 8/28/2024 5pm EST to 8/29/2024 5pm EST</div>
                      </div>
                    )}

                    <main className="flex-1">
                      {children}
                    </main>

                    <Footer />

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
