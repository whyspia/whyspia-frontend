import client from 'lib/axios'

/**
 * Get all definitions
 */
export default async function apiGetAllDefinitions({
  skip,
  limit,
  orderBy,
  orderDirection,
  senderTwitterUsername = null,
  symbol = null,
}: any) {

  try {
    const response = await client.get(`/symbol-definition`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        senderTwitterUsername,
        symbol,
      },
    })

    return response?.data?.data?.symbolDefinitions
  } catch (error) {
    console.error('Could not get all definitions', error)
    return []
  }
}
