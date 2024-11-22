import { UserV2TokenPublicResponse } from 'actions/users/apiUserActions'
import client from 'lib/axios'

export type SavedPersonsResponse = {
  id: string
  savedBy: string
  primaryWalletSavedUser: UserV2TokenPublicResponse
  chosenName: string
  createdAt: Date
}

type GetAllSavedPersonsInput = {
  jwt: null | string
  skip: number
  limit: number
  orderBy: string
  orderDirection: string
  search?: null | string
}

/**
 * get all SavedPersons
 */
export default async function apiGetAllSavedPersons({
  jwt,
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
}: GetAllSavedPersonsInput) {

  try {
    const response = await client.get(`/saved-person`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
      },
    })

    return response?.data?.data?.savedPersons
  } catch (error) {
    console.error('could not get all SavedPersons', error)
    return []
  }
}
