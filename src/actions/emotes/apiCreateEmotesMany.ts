import client from 'lib/axios'

type EmoteRequestBody = {
  receiverSymbols: string[]
  sentSymbols: string[]
  bAgentDecidedSendNotifToReceiver: boolean
}

/**
 * Create many new emotes in DB
 */
export const apiNewEmotesMany = async ({
  jwt,
  emotes,
}: {
  jwt: string
  emotes: EmoteRequestBody[]
}) => {

  const body = {
    emotes
  }

  try {
    let response = await client.post(`/emote/many`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.emotes
  } catch (error) {
    console.error(`Could not create new emotes`, error)
    return null
  }
}
