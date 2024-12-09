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
  jwt,
}: {
  emoteID: string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  jwt?: string
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
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    const { chain, totalChainLength } = response?.data?.data?.emotes

    return { chain, totalChainLength }
  } catch (error) {
    console.error('Could not get fetchEmoteReplyChain', error)
    return []
  }
}
