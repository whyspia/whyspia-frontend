import client from 'lib/axios'

/**
 * Create new definedEvent in DB
 */
export const apiCreateDefinedEvent = async ({
  jwt,
  eventName,
  eventDescription,
}) => {
  const body = {
    eventName,
    eventDescription,
  }

  try {
    let response = await client.post(`/pingppl/definedEvent`, body, {
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
