import { UserInfo } from "@particle-network/auth-core"

export type UserV2PrivateProfile = {
  id?: string
  primaryWallet?: string
  chosenPublicName?: string
  userInfo?: UserInfo
}

export type UserV2PublicProfile = {
  id?: string
  primaryWallet: string
  chosenPublicName: string
  // this is subjective field - if user that sent request to fetch this data has this person as SavedPerson, then chosenName will be displayed. Otherwise will be publicChosenName
  calculatedDisplayName: string
  requestingPrimaryWallet: string | null
  isRequestedUserSavedByRequestingUser: boolean
}

export type SavedPerson = {
  id?: string
  calculatedDisplayName: string
  chosenName: string
  primaryWalletSaved: string
  primaryWalletSavedUser: UserV2PublicProfile | null
}
