import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import { Fragment, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { GlobalContextComponent } from 'lib/GlobalContext'
export { GlobalContext } from 'lib/GlobalContext'
import { ClientWrapper } from 'lib/ClientWrapper'
import ModalRoot from 'components/modals/ModalRoot'
import { Toaster } from 'react-hot-toast'

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  const Layout =
    (
      Component as typeof Component & {
        layoutProps: {
          Layout: (props: { children: ReactNode } & unknown) => JSX.Element
        }
      }
    ).layoutProps?.Layout || Fragment

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextComponent>
        <ClientWrapper>
          <ThemeProvider attribute="class" defaultTheme="dark">
              <Layout>
                <Component {...pageProps} />
              </Layout>

              <ModalRoot />

              <Toaster />

          </ThemeProvider>
        </ClientWrapper>
      </GlobalContextComponent>
    </QueryClientProvider>
  )
}

export default MyApp
