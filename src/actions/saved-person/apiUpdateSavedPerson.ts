import client from 'lib/axios'

/**
 * update SavedPerson in DB
 */
export const apiUpdateSavedPerson = async ({
  jwt,
  savedPersonID,
  updatedChosenName,
}: {
  jwt: string
  savedPersonID: string
  updatedChosenName: string
}) => {
  
  const body = {
    savedPersonID,
    updatedChosenName,
  }

  try {
    let response = await client.put(`/saved-person/update`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.updatedSavedPerson
  } catch (error) {
    console.error(`could not update SavedPerson`, error)
    return null
  }
}
