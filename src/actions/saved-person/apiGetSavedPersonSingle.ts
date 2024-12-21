import client from 'lib/axios'

/**
 * Get SavedPerson single
 */
export default async function apiGetSavedPersonSingle({
  jwt,
  savedPersonID,
}: {
  jwt: string
  savedPersonID: string
}) {

  try {
    const response = await client.get(`/saved-person/single`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        savedPersonID
      },
    })

    return response?.data?.data?.savedPerson
  } catch (error) {
    console.error(`Could not get SavedPerson single for savedPersonID==${savedPersonID}`, error)
    return null
  }
}
