"use client"

import { GlobalContext } from './GlobalContext'
import { useContext, useEffect, } from 'react'
import { getCookie } from 'modules/no-category/services/CookieService'
import useAuth from 'modules/users/hooks/useAuth'
import { useAccount } from '@particle-network/connectkit'
import { usePathname } from 'next/navigation'

// maybe rename to UserDataInitializer or UserInitializer?
// TODO: rn we are pinging getUser API every time window focuses AND when user changes page/url - this gets and notifies user if they have new notifications. in future, we should delete this and just use serverside websockets for notifications OR periodic polling
export const ClientWrapper = ({ children }: any) => {
  const { setJwtToken, setIsJwtLoadingFinished, isWhyspiaLoginHappening } = useContext(GlobalContext)

  const { setUserFromJwt, handleParticleAndWhyspiaDisconnect } = useAuth()

  const { isConnected, } = useAccount()

  const pathname = usePathname()

  useEffect(() => {
    const initUserData = async () => {
      const jwtValue = getCookie('tt') || null

      // If there is JWT (they are signed in or faking it) AND connected to Particle, then fetch user data using JWT
      if (jwtValue && isConnected) {
        await setUserFromJwt(jwtValue)
        setJwtToken(jwtValue)
      }
      // if no JWT, but Particle is connected AND no whyspia login is happening, then disconnect it to sync it with whyspia auth
      if (!jwtValue && isConnected && !isWhyspiaLoginHappening) {
        // console.error('~~calling Particle disconnect bc JWT expired~~')
        handleParticleAndWhyspiaDisconnect()
      }

      setIsJwtLoadingFinished(true)  // no longer loading
    }

    // TODO: this condition may screw things up i have no idea tho. But without it, setIsJwtLoadingFinished basically doesnt work bc it gets called twice and first time is wrong
    if (isConnected) {
      initUserData()
    }

    // Add focus event listener
    const handleFocus = () => {
      if (isConnected) {
        initUserData()
      }
    }

    window.addEventListener('focus', handleFocus)

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, pathname])

  return <>{children}</>
}
