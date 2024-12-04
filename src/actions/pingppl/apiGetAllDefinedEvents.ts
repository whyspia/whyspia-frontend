import client from 'lib/axios'

/**
 * Get all defined-events
 */
export default async function apiGetAllDefinedEvents({
  skip,
  limit,
  orderBy,
  orderDirection,
  eventCreator = null,
  eventName = null,
  search = null,
  jwt,
}: any) {

  try {
    const response = await client.get(`/pingppl/definedEvent`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        eventCreator,
        eventName,
        search,
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.definedEvents
  } catch (error) {
    console.error('could not get all defined-events', error)
    return []
  }
}
