import { UserInfo } from "@particle-network/auth-core"

export type UserProfile = {
  id?: string
  twitterUserId?: string
  twitterUsername?: string
}

export type UserV2Profile = {
  id?: string
  primaryWallet?: string
  displayName?: string
  userInfo?: UserInfo
}