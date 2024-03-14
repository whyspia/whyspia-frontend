import client from 'lib/axios'

export type EmoteResponse = {
  id: string
  senderTwitterUsername: string
  receiverSymbols: string[]
  sentSymbols: string[]
  timestamp: Date
}

export type EmoteNotifSingleResponse = {
  id: string
  emoteData: EmoteResponse
  receiverSymbol: string
  hasReadCasually: boolean
  hasReadDirectly: boolean
  timestamp: Date
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
}): Promise<EmoteNotifResponse> {

  try {
    const response = await client.get(`/emote-notif`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
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
