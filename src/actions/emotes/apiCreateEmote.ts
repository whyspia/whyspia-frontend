import client from 'lib/axios'

/**
 * Create new emote in DB
 */
export const apiNewEmote = async ({
  jwt,
  receiverTwitterUsername,
  symbol,
}) => {
  // TODO: somewhere else need to handle how to get receiverUserTokenID when that twitter handle isnt in our system yet
  const body = {
    receiverTwitterUsername,
    symbol,
  }

  try {
    let response = await client.post(`/emote`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.emote
  } catch (error) {
    console.error(`Could not create new emote`, error)
    return null
  }
}
