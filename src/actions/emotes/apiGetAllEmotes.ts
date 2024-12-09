import client from 'lib/axios'

/**
 * Get all emotes
 */
export default async function apiGetAllEmotes({
  skip,
  limit,
  orderBy,
  orderDirection,
  senderPrimaryWallet = null,
  receiverSymbols = null,
  sentSymbols = null,
  context = null,
  jwt,
}: {
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  senderPrimaryWallet?: string
  receiverSymbols?: string[]
  sentSymbols?: string[]
  context?: string
  jwt?: string,
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
        senderPrimaryWallet,
        receiverSymbols: commaSeperatedReceiverSymbols,
        sentSymbols: commaSeperatedSentSymbols,
        context
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.emotes
  } catch (error) {
    console.error('Could not get all emotes', error)
    return []
  }
}
