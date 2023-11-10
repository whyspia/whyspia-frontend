import client from 'lib/axios'

/**
 * Get all symbols
 */
export default async function apiGetAllSymbols({
  skip,
  limit,
  orderBy,
  orderDirection,
  search,
}) {

  try {
    const response = await client.get(`/symbol`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
      },
    })

    return response?.data?.data?.symbols
  } catch (error) {
    console.error('Could not get all symbols', error)
    return []
  }
}
