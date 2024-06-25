import client from 'lib/axios'

/**
 * Create new definedEvent in DB
 */
export const apiCreateDefinedEvent = async ({
  jwt,
  eventCreator,
  eventName,
  eventDescription,
}) => {
  const body = {
    eventCreator,
    eventName,
    eventDescription,
  }

  try {
    let response = await client.post(`/pingppl`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.definedEvent
  } catch (error) {
    console.error(`Could not create new defined-event`, error)
    return null
  }
}
