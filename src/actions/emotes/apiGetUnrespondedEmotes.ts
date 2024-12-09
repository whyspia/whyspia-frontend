import client from 'lib/axios'

/**
 * get unresponded received emotes in the no u context (these conditions based on emotes sent at same timestamp as main emote)
 */
export default async function apiGetUnrespondedEmotes({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  senderPrimaryWallet = null,
  receiverSymbols = null,
  sentSymbols = null,
  fetchSentOrReceived = 'received',
}: {
  jwt: string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  senderPrimaryWallet?: string
  receiverSymbols?: string[]
  sentSymbols?: string[]
  fetchSentOrReceived: string
}) {

  try {
    const response = await client.get(`/emote/fetchUnrespondedEmotes`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        senderPrimaryWallet,
        receiverSymbols,
        sentSymbols,
        fetchSentOrReceived,
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.emotes
  } catch (error) {
    console.error('Could not get UnrespondedEmotes', error)
    return []
  }
}
