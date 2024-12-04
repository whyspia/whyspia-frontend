import client from 'lib/axios'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'

export type TAUResponse = {
  id: string
  senderUser: UserV2PublicProfile
  receiverUser: UserV2PublicProfile
  additionalMessage: string
  createdAt: Date
}

type GetAllTAUInput = {
  jwt: null | string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  senderPrimaryWallet?: null | string
  receiverPrimaryWallet?: null | string
  additionalMessage?: null | string
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
  senderPrimaryWallet = null,
  receiverPrimaryWallet = null,
  additionalMessage = null,
}: GetAllTAUInput) {

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
        senderPrimaryWallet,
        receiverPrimaryWallet,
        additionalMessage,
      },
    })

    return response?.data?.data?.taus
  } catch (error) {
    console.error('could not get all TAU', error)
    return []
  }
}
