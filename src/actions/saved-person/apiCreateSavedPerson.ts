import client from 'lib/axios'

/**
 * Create new SavedPerson in DB
 */
export const apiCreateSavedPerson = async ({
  jwt,
  primaryWalletSaved,
  chosenName,
}) => {
  const body = {
    primaryWalletSaved,
    chosenName,
  }

  try {
    let response = await client.post(`/saved-person`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.savedPerson
  } catch (error) {
    console.error(`could not create new SavedPerson`, error)
    return null
  }
}
