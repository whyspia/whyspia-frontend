"use client"

import { GlobalContext } from './GlobalContext'
import { useContext, useEffect, useState } from 'react'
import { getCookie } from 'modules/no-category/services/CookieService'
import useAuth from 'modules/users/hooks/useAuth'

import {
  useAccount,
  useDisconnect,
  usePublicClient,
  useParticleAuth,
  useWallets,
  useModal,
} from "@particle-network/connectkit"

// maybe rename to UserDataInitializer or UserInitializer?
export const ClientWrapper = ({ children }: any) => {
  // Initialize account-related states from Particle's useAccount hook
  const {
    status,
  } = useAccount()
  const { disconnect, disconnectAsync } = useDisconnect()
  const { getUserInfo } = useParticleAuth()
  // Retrieve the primary wallet from the Particle Wallets
  const [primaryWallet] = useWallets()
  // TODO: prob move these state values out to other places like GlobalContext or useAuth
  const [userInfo, setUserInfo] = useState<any>(null); // Store user's information
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(false); // Loading state for fetching user info
  const [userInfoError, setUserInfoError] = useState<string | null>(null); // Error state for fetching user info

  // const { setJwtToken } = useContext(GlobalContext)

  // const { setUserFromJwt } = useAuth()

  // useEffect(() => {
  //   const initUserData = async () => {
  //     const jwtValue = getCookie('tt') || null

  //     // If there is JWT (they are signed in or faking it), then fetch user data using JWT
  //     if (jwtValue) {
  //       await setUserFromJwt(jwtValue)
  //       setJwtToken(jwtValue)
  //     }
  //   }

  //   initUserData()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUserInfo(true)
      setUserInfoError(null)

      if (primaryWallet?.connector?.walletConnectorType === "particleAuth") {
        try {
          const userInfo = getUserInfo();
          setUserInfo(userInfo);
          console.log("userInfo ", userInfo);
        } catch (error) {
          console.log("getUserInfo error: ", error);
        } finally {
          setIsLoadingUserInfo(false);
        }
      } else {
        setIsLoadingUserInfo(false); // Ensure to stop loading if connector type doesn't match
      }
    };

    if (status === "connected") {
      fetchUserInfo();
    }
  }, [status, primaryWallet, getUserInfo])

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
    } catch (error) {
      console.error("Error disconnecting:", error);
    }
  }

  return <>{children}</>
}
