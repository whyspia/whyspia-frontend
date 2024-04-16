import client from 'lib/axios'

/**
 * get unresponded received emotes in the no u context (these conditions based on emotes sent at same timestamp as main emote)
 */
export default async function apiGetUnrespondedReceivedEmotes({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  senderTwitterUsername = null,
  receiverSymbols = null,
  sentSymbols = null,
}: {
  jwt: string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  senderTwitterUsername?: string
  receiverSymbols?: string[]
  sentSymbols?: string[]
}) {

  try {
    const response = await client.get(`/emote/fetchUnrespondedReceivedEmotes`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        senderTwitterUsername,
        receiverSymbols,
        sentSymbols,
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.emotes
  } catch (error) {
    console.error('Could not get UnrespondedReceivedEmotes', error)
    return []
  }
}
