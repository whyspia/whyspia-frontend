import client from 'lib/axios'

/**
 * Create new symbolDefinition in DB
 */
export const apiCreateSymbolDefinition = async ({
  jwt,
  symbol,
  symbolDefinition,
}) => {
  const body = {
    symbol,
    symbolDefinition,
  }

  try {
    let response = await client.post(`/symbol-definition`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.symbolDefinition
  } catch (error) {
    console.error(`Could not create new symbolDefinition`, error)
    return null
  }
}
