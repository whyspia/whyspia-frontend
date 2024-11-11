"use client"

import { GlobalContext } from './GlobalContext'
import { useContext, useEffect, } from 'react'
import { getCookie } from 'modules/no-category/services/CookieService'
import useAuth from 'modules/users/hooks/useAuth'
import { useAccount } from '@particle-network/connectkit'

// maybe rename to UserDataInitializer or UserInitializer?
export const ClientWrapper = ({ children }: any) => {
  const { setJwtToken, jwtToken, setUserV2, setIsJwtLoadingFinished, isWhyspiaLoginHappening } = useContext(GlobalContext)

  const { setUserFromJwt, handleParticleDisconnect } = useAuth()

  const { isConnected, } = useAccount()

  useEffect(() => {
    const initUserData = async () => {
      const jwtValue = getCookie('tt') || null

      // If there is JWT (they are signed in or faking it), then fetch user data using JWT
      if (jwtValue) {
        await setUserFromJwt(jwtValue)
        setJwtToken(jwtValue)
      }
      // if no JWT, but Particle is connected AND no whyspia login is happening, then disconnect it to sync it with whyspia auth
      if (!jwtValue && isConnected && !isWhyspiaLoginHappening) {
        // console.error('~~calling Particle disconnect bc JWT expired~~')
        handleParticleDisconnect()
      }

      setIsJwtLoadingFinished(true)  // no longer loading
    }

    initUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  return <>{children}</>
}
