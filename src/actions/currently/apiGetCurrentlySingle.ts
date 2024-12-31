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

/**
 * get single Currently that is active at all (good for just getting a specific user's currently)
 * it fetches Currently of senderPrimaryWallet, not of jwt user
 */
export async function apiGetCurrentlySingleWithAnyActiveField({
  jwt = null,
  senderPrimaryWallet = null,
}: {
  jwt?: string
  senderPrimaryWallet: string
}): Promise<CurrentlyResponse> {

  try {
    const response = await client.get(`/currently`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        senderPrimaryWallet,
        anyActiveField: true,
      },
    })

    return response?.data?.data?.currentlyList[0] ?? null
  } catch (error) {
    console.error('could not get single CurrentlyWithAnyActiveField', error)
    return null
  }
}
