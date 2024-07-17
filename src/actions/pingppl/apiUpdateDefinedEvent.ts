import client from 'lib/axios'

/**
 * Update defined-event in DB
 */
export const apiUpdateDefinedEvent = async ({
  jwt,
  definedEventId,
  updatedEventName,
  updatedEventDescription,
}: {
  jwt: string
  definedEventId: string
  updatedEventName: string
  updatedEventDescription: string
}) => {
  
  const body = {
    definedEventId,
    updatedEventName,
    updatedEventDescription,
  }

  try {
    let response = await client.put(`/pingppl/definedEvent`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.updatedDefinedEvent
  } catch (error) {
    console.error(`Could not update defined-event`, error)
    return null
  }
}
