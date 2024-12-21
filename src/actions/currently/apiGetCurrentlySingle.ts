import client from 'lib/axios'
import { CurrentlyResponse } from 'modules/places/currently/types/apiCurrentlyTypes'

/**
 * Get Currently single
 */
export default async function apiGetCurrentlySingle({
  jwt,
  currentlyID,
}: {
  jwt: string
  currentlyID: string
}): Promise<CurrentlyResponse> {

  try {
    const response = await client.get(`/currently/single`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        currentlyID,
      },
    })

    return response?.data?.data?.currently
  } catch (error) {
    console.error(`Could not get Currently single for currentlyID==${currentlyID}`, error)
    return null
  }
}
