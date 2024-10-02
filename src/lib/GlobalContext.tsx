"use client"

import { EmoteNotifResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import React, { useState } from 'react'
import { UserProfile } from 'types/customTypes'

interface GlobalContextState {
  jwtToken: null | string
  setJwtToken: (val: string) => void
  user: UserProfile
  setUser: (val: any) => void
  isModalServiceLoaded: boolean
  setIsModalServiceLoaded: (val: boolean) => void
  
  userNotifData: EmoteNotifResponse | null
  setUserNotifData: (userNotifData: EmoteNotifResponse) => void
}

export const initialState: GlobalContextState = {
  jwtToken: null,
  setJwtToken: (val: string) => {},
  user: {},
  setUser: (val: UserProfile) => {},
  isModalServiceLoaded: false,
  setIsModalServiceLoaded: (val: boolean) => {},

  userNotifData: null,
  setUserNotifData: (userNotifData: EmoteNotifResponse) => {}
}

export const GlobalContext = React.createContext(initialState)

interface Props {}

export const GlobalContextComponent: React.FC<Props> = ({ children }: any) => {
  const [jwtToken, setJwtToken] = useState(null)
  const [user, setUser] = useState({})
  const [isModalServiceLoaded, setIsModalServiceLoaded] = useState(false)
  const [userNotifData, setUserNotifData] = useState(null)

  return (
    <GlobalContext.Provider
      value={{
        jwtToken,
        setJwtToken,
        user,
        setUser,
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
