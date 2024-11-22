import client from 'lib/axios'

/**
 * delete SavedPerson in DB
 */
export const apiDeleteSavedPerson = async ({
  jwt,
  savedPersonID,
}: {
  jwt: string
  savedPersonID: string
}) => {
  
  const body = {
    savedPersonID,
  }

  try {
    let response = await client.delete(`/saved-person`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      data: body,
    })

    return response?.data?.data
  } catch (error) {
    console.error(`could not delete SavedPerson`, error)
    return null
  }
}
