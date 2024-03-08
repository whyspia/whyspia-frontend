import client from 'lib/axios'

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
}) => {
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

    return response?.data?.data?.emote
  } catch (error) {
    console.error(`Could not update notifs`, error)
    return null
  }
}
