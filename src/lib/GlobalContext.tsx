"use client"

import { EmoteNotifResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { UserV2PrivateProfile } from 'modules/users/types/UserNameTypes'
import React, { useState } from 'react'
import { UserProfile } from 'types/customTypes'

interface GlobalContextState {
  isWhyspiaLoginHappening: boolean
  setIsWhyspiaLoginHappening: (val: boolean) => void
  isJwtLoadingFinished: boolean
  setIsJwtLoadingFinished: (val: boolean) => void
  jwtToken: null | string
  setJwtToken: (val: string | null) => void
  user: UserProfile
  userV2: UserV2PrivateProfile
  setUser: (val: any) => void
  setUserV2: (val: any) => void
  isModalServiceLoaded: boolean
  setIsModalServiceLoaded: (val: boolean) => void
  
  userNotifData: EmoteNotifResponse | null
  setUserNotifData: (userNotifData: EmoteNotifResponse) => void
}


export const initialState: GlobalContextState = {
  isWhyspiaLoginHappening: false,
  setIsWhyspiaLoginHappening: (val: boolean) => {},
  isJwtLoadingFinished: false,
  setIsJwtLoadingFinished: (val: boolean) => {},
  jwtToken: null,
  setJwtToken: (val: string | null) => {},
  user: {},
  userV2: {},
  setUser: (val: UserProfile) => {},
  setUserV2: (val: UserV2PrivateProfile) => {},
  isModalServiceLoaded: false,
  setIsModalServiceLoaded: (val: boolean) => {},

  userNotifData: null,
  setUserNotifData: (userNotifData: EmoteNotifResponse) => {}
}

export const GlobalContext = React.createContext(initialState)

interface Props {}

export const GlobalContextComponent: React.FC<Props> = ({ children }: any) => {
  const [isWhyspiaLoginHappening, setIsWhyspiaLoginHappening] = useState<boolean>(false)
  const [isJwtLoadingFinished, setIsJwtLoadingFinished] = useState<boolean>(false)
  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [user, setUser] = useState({})
  const [userV2, setUserV2] = useState({})
  const [isModalServiceLoaded, setIsModalServiceLoaded] = useState(false)
  const [userNotifData, setUserNotifData] = useState<any>(null)

  return (
    <GlobalContext.Provider
      value={{
        isWhyspiaLoginHappening,
        setIsWhyspiaLoginHappening,
        isJwtLoadingFinished,
        setIsJwtLoadingFinished,
        jwtToken,
        setJwtToken,
        user,
        userV2,
        setUser,
        setUserV2,
        isModalServiceLoaded,
        setIsModalServiceLoaded,
        userNotifData,
        setUserNotifData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
