import client from 'lib/axios'

/**
 * Create new defineEventAndSentEvent in DB
 */
export const apiCreateDefinedEventAndThenSentEvent = async ({
  jwt,
  eventName,
  eventDescription,
}) => {
  const body = {
    eventName,
    eventDescription,
  }

  try {
    let response = await client.post(`/pingppl/defineEventAndSentEvent`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data // returns { definedEvent, sentEvent }
  } catch (error) {
    console.error(`Could not create new defineEventAndSentEvent`, error)
    return null
  }
}
