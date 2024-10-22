import client from 'lib/axios'

export type PingpplFollowResponse = {
  id: string
  eventNameFollowed: string
  eventSender: string
  followSender: string
  createdAt: Date
}

/**
 * Get all pingpplFollows
 */
export default async function apiGetAllPingpplFollows({
  skip,
  limit,
  orderBy,
  orderDirection,
  eventNameFollowed = null,
  eventSender = null,
  followSender = null,
}: any): Promise<PingpplFollowResponse[]> {

  try {
    const response = await client.get(`/pingppl/pingpplFollow`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        eventNameFollowed,
        eventSender,
        followSender,
      },
    })

    return response?.data?.data?.pingpplFollows
  } catch (error) {
    console.error('Could not get all pingpplFollows', error)
    return []
  }
}
