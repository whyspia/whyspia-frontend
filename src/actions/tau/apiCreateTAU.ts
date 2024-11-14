import client from 'lib/axios'

/**
 * Create new TAU in DB
 */
export const apiCreateTAU = async ({
  jwt,
  receiverPrimaryWallet,
  additionalMessage,
}) => {
  const body = {
    receiverPrimaryWallet,
    additionalMessage,
  }

  try {
    let response = await client.post(`/tau`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.tau
  } catch (error) {
    console.error(`Could not create new tau`, error)
    return null
  }
}
