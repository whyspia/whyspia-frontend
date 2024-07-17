import client from 'lib/axios'

export type PingpplSentEventResponse = {
  id: string
  eventName: string
  eventSender: string
  createdAt: Date
}

/**
 * Get all sent-events
 */
export default async function apiGetAllSentEvents({
  skip,
  limit,
  orderBy,
  orderDirection,
  eventSender = null,
  eventName = null,
}) {

  try {
    const response = await client.get(`/pingppl/sentEvent`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        eventSender,
        eventName,
      },
    })

    return response?.data?.data?.sentEvents
  } catch (error) {
    console.error('Could not get all sent-events', error)
    return []
  }
}
