import client from 'lib/axios'

/**
 * Create new emote in DB
 */
export const apiNewEmote = async ({
  jwt,
  receiverSymbols,
  symbol,
}: {
  jwt: string
  receiverSymbols: string[]
  symbol: string
}) => {
  const commaSeperatedReceiverSymbols = receiverSymbols.join(",")
  // TODO: somewhere else need to handle how to get receiverUserTokenID when that twitter handle isnt in our system yet
  const body = {
    receiverSymbols: commaSeperatedReceiverSymbols,
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
