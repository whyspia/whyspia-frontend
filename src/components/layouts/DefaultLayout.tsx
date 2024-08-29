import Header from 'components/Header'
import { ReactNode } from 'react'

export default function DefaultLayout({ children }: { children: ReactNode }) {

  const isDowntimeMode = false

  return (
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
    </div>
  )
}
