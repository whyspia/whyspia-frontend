import apiGetAllEmoteNotifs from 'actions/notifs/apiGetAllEmoteNotifs'
import { completeUserV2Login, getUserTokenPrivate, initiateUserV2LoginAPI } from 'actions/users/apiUserActions'
import ModalService from 'components/modals/ModalService'
import { GlobalContext } from 'lib/GlobalContext'
import { deleteCookie } from 'modules/no-category/services/CookieService'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import {
  useConnect,
  useAccount,
  useConnectors,
  useAddress,
  useDisconnect,
  useParticleAuth,
  useWallets,
} from "@particle-network/connectkit"
import { type Connector } from '@particle-network/connector-core'

const useAuth = () => {
  // Initialize account-related states from Particle's useAccount hook
  const {
    status,
    isConnected,
  } = useAccount()
  const address = useAddress()
  const { disconnectAsync } = useDisconnect()
  const { getUserInfo } = useParticleAuth()
  // Retrieve the primary wallet from the Particle Wallets
  const [primaryWallet] = useWallets()
  // TODO: prob move these state values out to other places like GlobalContext or useAuth- formerly did stuff like setUserFromJwt in ClientWrapper
  const [userInfo, setUserInfo] = useState<any>(null); // Store user's information
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(false); // Loading state for fetching user info
  const { setJwtToken, setUserNotifData, setUserV2, jwtToken, isJwtLoadingFinished, setIsWhyspiaLoginHappening } = useContext(GlobalContext)
  // used to call method to init whyspia login...but only once all values are ready
  const [bInitWhyspiaLoginFlag, setInitWhyspiaLoginFlag] = useState<boolean>(false)

  const setUserFromJwt = async (jwt: string) => {
    if (jwt) {
      const userToken = await getUserTokenPrivate({ jwt })
      if (userToken) {
        // setUser(userToken)
        setUserV2({
          id: userToken?.id,
          primaryWallet: userToken?.primaryWallet,
          chosenPublicName: userToken?.chosenPublicName,
          // TODO: we dont need userInfo anymore do we?
          userInfo, // should this be from userToken instead??
        })
      }
      try {
        // this is only to get hasReadCasuallyFalseCount and hasReadDirectlyFalseCount - i dont think can use this for emoteNotifs bc pagination needs to be done on notification page - not with some global var
        const response = await apiGetAllEmoteNotifs({ skip: 0, limit: 10, orderBy: 'timestamp', orderDirection: 'desc', jwt })
        
        if (response) {
          setUserNotifData(response)
        }
      } catch (error) {
        console.error('useAuth apiGetAllEmoteNotifs failed', error)
      }
    }
  }

  const whyspiaLogout = (): void => {
    deleteCookie('tt')
    setUserV2(null)
    setJwtToken(null)
    toast.error(`logout success!`)
  }

  const fetchUserInfo = async () => {
    setIsLoadingUserInfo(true)

    if (primaryWallet?.connector?.walletConnectorType === "particleAuth") {
      try {
        const userInfo = getUserInfo()
        setUserInfo(userInfo)
      } catch (error) {
        console.log("getUserInfo error: ", error)
      } finally {
        setIsLoadingUserInfo(false)
      }
    } else {
      setIsLoadingUserInfo(false); // Ensure to stop loading if connector type doesn't match
    }
  }

  const handleParticleDisconnect = async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error("error disconnecting:", error);
    }
  }

  // the reusable main method for logging out in general
  const handleParticleAndWhyspiaDisconnect = async () => {
    // if (isConnected) {
      await handleParticleDisconnect()
      whyspiaLogout()
    // }
  }

  const initiateWhyspiaLogin = async () => {
    try {
      // console.log('userInfo inside initWhyspiaLogin==', userInfo)
      // console.log('address inside initWhyspiaLogin==', address)
      // console.log('primaryWallet inside initWhyspiaLogin==', primaryWallet)
      const messageToSign = await initiateUserV2LoginAPI(userInfo?.uuid, userInfo?.wallets, address as string)
      const walletClient = primaryWallet?.getWalletClient() ?? null
      const sig = await walletClient.signMessage({ account: address as any, message: messageToSign })
      const userV2Verification = await completeUserV2Login(sig, address as string)
      setJwtToken(userV2Verification?.jwt)
      setUserV2({
        id: userV2Verification?.userToken?.id,
        primaryWallet: address,
        chosenPublicName: userV2Verification?.userToken?.chosenPublicName,
        userInfo,
      })
    } catch(err) {
      // close loading modal that is blocking action while user was logging in
      ModalService.closeAll()
      console.error('~~calling Particle disconnect in catch block~~', err)
      await handleParticleDisconnect()
      setIsWhyspiaLoginHappening(false)
    }

    // close loading modal that is blocking action while user was logging in
    ModalService.closeAll()
    setIsWhyspiaLoginHappening(false)
  }

  const { connectAsync } = useConnect()
  const connectors = useConnectors()

  // the reusable main method for logging in in general
  const handleParticleAndWhyspiaLogin = async () => {
    if (!isConnected) {
      try {
        const particleEVMConnector: Connector | undefined = connectors.find(connector => connector.id === "particleEVM")
        // console.log('connectors==', connectors)
        await setIsWhyspiaLoginHappening(true)
        await connectAsync({ connector: particleEVMConnector as Connector })
        await setInitWhyspiaLoginFlag(true)
      } catch(err) {
        console.error('particle login failed')
      }
    }
  }

  useEffect(() => {
    if (status === "connected") {
      fetchUserInfo()
    }
    // if Particle connected, but no JWT - that signals it's time for final step to auth with whyspia backend (wallet auth). If it fails, then need to sign out of Particle too
    // if (isConnected && (!isJwtLoading && !jwtToken) && !hasInitiatedLogin.current && userInfo && address && primaryWallet) {
    //   // TODO: maybe use this for disconnecting once jwt expires
    // }

    // login was inited with bInitWhyspiaLoginFlag 
    if (bInitWhyspiaLoginFlag && isConnected && !jwtToken && userInfo && address && primaryWallet) {
      setInitWhyspiaLoginFlag(false)
      initiateWhyspiaLogin()
    }

    // if (status === "connecting" || status === "reconnecting") {
    //   console.log('~~particle is either connecting or reconnecting~~')
    // }
  }, [isConnected, primaryWallet, getUserInfo, address, jwtToken, isJwtLoadingFinished])

  return { setUserFromJwt, whyspiaLogout, setInitWhyspiaLoginFlag, handleParticleAndWhyspiaDisconnect, handleParticleAndWhyspiaLogin }
}

export default useAuth
