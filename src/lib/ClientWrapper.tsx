"use client"

import { GlobalContext } from './GlobalContext'
import { useContext, useEffect, } from 'react'
import { getCookie } from 'modules/no-category/services/CookieService'
import useAuth from 'modules/users/hooks/useAuth'
import { useAccount } from '@particle-network/connectkit'

// maybe rename to UserDataInitializer or UserInitializer?
export const ClientWrapper = ({ children }: any) => {
  const { setJwtToken, setIsJwtLoadingFinished, isWhyspiaLoginHappening } = useContext(GlobalContext)

  const { setUserFromJwt, handleParticleAndWhyspiaDisconnect } = useAuth()

  const { isConnected, } = useAccount()

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

      console.log("setIsJwtLoadingFinished(true)")

      setIsJwtLoadingFinished(true)  // no longer loading
    }

    // TODO: this condition may screw things up i have no idea tho. But without it, setIsJwtLoadingFinished basically doesnt work bc it gets called twice and first time is wrong
    if (isConnected) {
      initUserData()
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  return <>{children}</>
}
