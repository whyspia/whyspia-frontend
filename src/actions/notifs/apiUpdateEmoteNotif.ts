import client from 'lib/axios'
import { EmoteNotifResponse } from './apiGetAllEmoteNotifs'

/**
 * Update emote notif in DB
 */
export const apiUpdateEmoteNotif = async ({
  jwt,
  notifIDs,
  isCasualOrDirect,
  isMarkingUnread,
}: {
  jwt: string
  notifIDs: string[]
  isCasualOrDirect: string
  isMarkingUnread: boolean
}): Promise<Partial<EmoteNotifResponse>> => {
  const commaSeperatedNotifIDs = notifIDs.join(",")
  
  const body = {
    emoteNotifIDs: commaSeperatedNotifIDs,
    isCasualOrDirect,
    isMarkingUnread,
  }

  try {
    let response = await client.put(`/emote-notif`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data // for now returns { hasReadCasuallyFalseCount, hasReadDirectlyFalseCount }
  } catch (error) {
    console.error(`Could not update notifs`, error)
    return null
  }
}
