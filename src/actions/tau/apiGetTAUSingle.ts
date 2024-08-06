import client from 'lib/axios'

/**
 * Get TAU single
 */
export default async function apiGetTAUSingle({
  jwt,
  tauId,
}: {
  jwt: string
  tauId: string
}) {

  try {
    const response = await client.get(`/tau/single`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      params: {
        tauId
      },
    })

    return response?.data?.data?.tau
  } catch (error) {
    console.error(`Could not get tau single for tauId==${tauId}`, error)
    return []
  }
}
