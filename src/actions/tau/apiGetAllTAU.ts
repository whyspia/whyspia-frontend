import client from 'lib/axios'

export type TAUResponse = {
  id: string
  senderSymbol: string
  receiverSymbol: string
  additionalMessage: string
  createdAt: Date
}

/**
 * get all TAU
 */
export default async function apiGetAllTAU({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  senderSymbol = null,
  receiverSymbol = null,
  additionalMessage = null,
}) {

  try {
    const response = await client.get(`/tau`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        senderSymbol,
        receiverSymbol,
        additionalMessage,
      },
    })

    return response?.data?.data?.taus
  } catch (error) {
    console.error('could not get all TAU', error)
    return []
  }
}
