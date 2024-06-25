import client from 'lib/axios'

/**
 * Delete defined-event in DB
 */
export const apiDeleteDefinedEvent = async ({
  jwt,
  definedEventId,
}: {
  jwt: string
  definedEventId: string
}) => {
  
  const body = {
    definedEventId,
  }

  try {
    let response = await client.delete(`/pingppl`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      data: body,
    })

    return response?.data?.data
  } catch (error) {
    console.error(`Could not delete defined-event`, error)
    return null
  }
}
