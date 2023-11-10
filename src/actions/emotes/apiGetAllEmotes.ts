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
  receiverTwitterUsername = null,
  symbol = null,
}) {

  try {
    // TODO: implement these params and one to filter by a certain sender or receiver
    const response = await client.get(`/emote`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        senderTwitterUsername,
        receiverTwitterUsername,
        symbol,
      },
    })

    return response?.data?.data?.emotes
  } catch (error) {
    console.error('Could not get all emotes', error)
    return []
  }
}
