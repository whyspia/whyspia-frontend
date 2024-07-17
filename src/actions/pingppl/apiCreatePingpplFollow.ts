import client from 'lib/axios'

/**
 * Create new pingpplFollow in DB
 */
export const apiCreatePingpplFollow = async ({
  jwt,
  eventNameFollowed,
  eventSender,
}) => {
  const body = {
    eventNameFollowed,
    eventSender,
  }

  try {
    let response = await client.post(`/pingppl/pingpplFollow`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.pingpplFollow
  } catch (error) {
    console.error(`Could not create new pingpplFollow`, error)
    return null
  }
}
