import client from 'lib/axios'
import { CurrentlyUpdate } from 'modules/places/currently/types/apiCurrentlyTypes'

/**
 * Create new Currently in DB
 */
export const apiCreateCurrently = async ({
  jwt,
  updates,
}: {
  jwt: string
  updates: CurrentlyUpdate[]
}) => {
  const body = {
    updates,
  }

  try {
    let response = await client.post(`/currently`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.currently
  } catch (error) {
    console.error(`could not create new Currently`, error)
    return null
  }
}
