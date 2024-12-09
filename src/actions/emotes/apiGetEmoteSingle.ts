import client from 'lib/axios'

/**
 * Get emote single
 */
export default async function apiGetEmoteSingle({
  emoteID,
  jwt,
}: {
  emoteID: string
  jwt?: string
}) {

  try {
    // TODO: implement these params and one to filter by a certain sender or receiver
    const response = await client.get(`/emote/single`, {
      params: {
        emoteID
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.emote
  } catch (error) {
    console.error(`Could not get emotes single for emoteID==${emoteID}`, error)
    return []
  }
}
