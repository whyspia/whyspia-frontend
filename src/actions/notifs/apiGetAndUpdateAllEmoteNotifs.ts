import client from 'lib/axios'
import { EmoteNotifResponse } from './apiGetAllEmoteNotifs'


/**
 * Get all emote notifs for logged in user (paginated) and also update isCasualRead for all pulled (so we dont have to make 2 api calls)
 */
export default async function apiGetAndUpdateAllEmoteNotifs({
  skip,
  limit,
  orderBy,
  orderDirection,
  jwt,
}): Promise<EmoteNotifResponse> {
  const body = {
    skip,
    limit,
    orderBy,
    orderDirection,
  }

  try {
    const response = await client.put(`/emote-notif/fetchAndUpdate`, body, {
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
