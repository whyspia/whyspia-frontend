import client from 'lib/axios'

/**
 * Get emote reply chain
 */
export default async function apiGetEmoteReplyChain({
  emoteID,
  skip,
  limit,
  orderBy,
  orderDirection,
}: {
  emoteID: string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
}) {

  try {
    const response = await client.get(`/emote/fetchEmoteReplyChain`, {
      params: {
        emoteID,
        skip,
        limit,
        orderBy,
        orderDirection,
      },
    })

    const { chain, totalChainLength } = response?.data?.data?.emotes

    return { chain, totalChainLength }
  } catch (error) {
    console.error('Could not get fetchEmoteReplyChain', error)
    return []
  }
}
