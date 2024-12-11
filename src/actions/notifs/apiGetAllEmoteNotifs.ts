import { PingpplFollowResponse } from 'actions/pingppl/apiGetAllPingpplFollows'
import { PingpplSentEventResponse } from 'actions/pingppl/apiGetAllSentEvents'
import { TAUResponse } from 'actions/tau/apiGetAllTAU'
import client from 'lib/axios'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'

export enum NOTIF_TYPE {
  EMOTE = 'EMOTE',
  PINGPPL_FOLLOW = 'PINGPPL_FOLLOW',
  PINGPPL_SENTEVENT = 'PINGPPL_SENTEVENT',
  TAU_SENT = 'TAU_SENT',
}

export type EmoteResponse = {
  id: string
  senderPrimaryWallet: string
  senderUser?: UserV2PublicProfile
  receiverSymbols: string[]
  receiverUsers?: UserV2PublicProfile[]
  sentSymbols: string[]
  createdAt: Date
  chainPreview?: EmoteResponse[]
  totalChainLength?: number
  context?: string
}

export type EmoteNotifSingleResponse = {
  id: string
  notifData: EmoteResponse | PingpplFollowResponse | PingpplSentEventResponse | TAUResponse | null
  notifType: NOTIF_TYPE
  receiverSymbol: string
  hasReadCasually: boolean
  hasReadDirectly: boolean
  context?: string
  createdAt: Date
}

export type EmoteNotifResponse = {
  emoteNotifs: EmoteNotifSingleResponse[]
  hasReadCasuallyFalseCount: number
  hasReadDirectlyFalseCount: number
}

/**
 * Get all emote notifs for logged in user
 */
export default async function apiGetAllEmoteNotifs({
  skip,
  limit,
  orderBy,
  orderDirection,
  jwt,
  notifType = null
}): Promise<EmoteNotifResponse> {

  try {
    const response = await client.get(`/emote-notif`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        notifType
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    const responseData = response?.data?.data

    return responseData // for now returns { emoteNotifs, hasReadCasuallyFalseCount, hasReadDirectlyFalseCount }
  } catch (error) {
    console.error('Could not get all emote notifs', error)
    return null
  }
}
