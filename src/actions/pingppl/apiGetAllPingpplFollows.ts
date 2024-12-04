import client from 'lib/axios'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'

export type PingpplFollowResponse = {
  id: string
  eventNameFollowed: string
  eventSender: string
  followSender: string
  followSenderUser: UserV2PublicProfile
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
  jwt,
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
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.pingpplFollows
  } catch (error) {
    console.error('could not get all pingpplFollows', error)
    return []
  }
}
