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
}) {

  try {
    const response = await client.get(`/pingppl`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        eventCreator,
        eventName,
      },
    })

    return response?.data?.data?.definedEvents
  } catch (error) {
    console.error('Could not get all defined-events', error)
    return []
  }
}
