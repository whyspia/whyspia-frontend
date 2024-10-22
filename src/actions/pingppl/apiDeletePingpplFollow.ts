import client from 'lib/axios'

/**
 * Delete pingpplFollow in DB
 */
export const apiDeletePingpplFollow = async ({
  jwt,
  pingpplFollowId,
}: {
  jwt: string | null
  pingpplFollowId: string
}) => {
  
  const body = {
    pingpplFollowId,
  }

  try {
    let response = await client.delete(`/pingppl/pingpplFollow`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
      data: body,
    })

    return response?.data?.data
  } catch (error) {
    console.error(`Could not delete pingpplFollow`, error)
    return null
  }
}
