import client from 'lib/axios'

/**
 * Get defined event single
 */
export default async function apiGetDefinedEventSingle({
  definedEventId,
  jwt,
}: {
  definedEventId: string
  jwt: null | string
}) {

  try {
    const response = await client.get(`/pingppl/definedEvent/single`, {
      params: {
        definedEventId
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.definedEvent
  } catch (error) {
    console.error(`Could not get definedEvent single for definedEventId==${definedEventId}`, error)
    return []
  }
}
