import client from 'lib/axios'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'

export type PingpplSentEventResponse = {
  id: string
  eventName: string
  eventSender: string
  eventSenderUser: UserV2PublicProfile
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
  jwt,
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
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.sentEvents
  } catch (error) {
    console.error('Could not get all sent-events', error)
    return []
  }
}
