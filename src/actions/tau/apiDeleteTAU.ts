import client from 'lib/axios'

/**
 * Delete TAU in DB
 */
export const apiDeleteTAU = async ({
  jwt,
  tauId,
}: {
  jwt: string
  tauId: string
}) => {
  
  const body = {
    tauId,
  }

  try {
    let response = await client.delete(`/tau`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      data: body,
    })

    return response?.data?.data
  } catch (error) {
    console.error(`Could not delete TAU`, error)
    return null
  }
}
