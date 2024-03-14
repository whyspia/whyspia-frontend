import client from 'lib/axios'

/**
 * Get all emotes
 */
export default async function apiGetAllEmotes({
  skip,
  limit,
  orderBy,
  orderDirection,
  senderTwitterUsername = null,
  receiverSymbols = null,
  sentSymbols = null,
}: {
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  senderTwitterUsername?: string
  receiverSymbols?: string[]
  sentSymbols?: string[]
}) {
  const commaSeperatedReceiverSymbols = receiverSymbols?.join(",") || null
  const commaSeperatedSentSymbols = sentSymbols?.join(",") || null

  try {
    // TODO: implement these params and one to filter by a certain sender or receiver
    const response = await client.get(`/emote`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        senderTwitterUsername,
        receiverSymbols: commaSeperatedReceiverSymbols,
        sentSymbols: commaSeperatedSentSymbols,
      },
    })

    return response?.data?.data?.emotes
  } catch (error) {
    console.error('Could not get all emotes', error)
    return []
  }
}
