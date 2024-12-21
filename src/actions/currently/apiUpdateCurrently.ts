import client from 'lib/axios'
import { CurrentlyUpdate } from 'modules/places/currently/types/apiCurrentlyTypes'

/**
 * update Currently in DB
 */
export const apiUpdateCurrently = async ({
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
    let response = await client.put(`/currently/update`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.updatedCurrently
  } catch (error) {
    console.error(`could not update Currently`, error)
    return null
  }
}
