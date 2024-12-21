import client from 'lib/axios'
import { CurrentlyResponse } from 'modules/places/currently/types/apiCurrentlyTypes'

type GetAllCurrentlyInput = {
  jwt: null | string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  search?: null | string
  senderPrimaryWallet?: null | string
}

/**
 * get all Currently
 */
export default async function apiGetAllCurrently({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
  senderPrimaryWallet = null,
}: GetAllCurrentlyInput): Promise<CurrentlyResponse[]> {

  try {
    const response = await client.get(`/currently`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
        senderPrimaryWallet,
      },
    })

    return response?.data?.data?.currentlyList
  } catch (error) {
    console.error('could not get all Currently', error)
    return []
  }
}
