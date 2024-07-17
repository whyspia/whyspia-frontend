import client from 'lib/axios'

/**
 * Create new sentEvent in DB
 */
export const apiCreateSentEvent = async ({
  jwt,
  eventName,
  definedEventID,
}) => {
  const body = {
    eventName,
    definedEventID,
  }

  try {
    let response = await client.post(`/pingppl/sentEvent`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.sentEvent
  } catch (error) {
    console.error(`Could not create new sent-event`, error)
    return null
  }
}
