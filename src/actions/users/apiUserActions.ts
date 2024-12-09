import client from 'lib/axios'


type ParticleWallet = {
  chain_name: string
  public_address: string
  uuid: string
}

export const initiateUserV2LoginAPI = async (particleUUID: string, wallets: ParticleWallet[], primaryWallet: string): Promise<any> => {
  try {
    const response = await client.post(
      `/user-v2/initiateLogin`,
      {
        particleUUID,
        wallets,
        primaryWallet,
      },
      // {
      //   headers: {
      //     Authorization: jwt ? `Bearer ${jwt}` : null,
      //   },
      // }
    )
    return response?.data?.data?.messageToSign
  } catch (error) {
    console.error(
      `could not generate access token for userv2 authentication`,
      error
    )
    throw error // rethrow the error to be caught
  }
}

export const completeUserV2Login = async (
  signature: string,
  signingAddress: string,
) => {
  try {
    const response = await client.post(
      `/user-v2/completeLogin`,
      { signature, signingAddress },
      { withCredentials: true } // TODO: if issues arise, may need to make this only true in dev envs
    )
    return response?.data?.data?.userV2Verification
  } catch (error) {
    console.error(`could not complete userv2 login`, error)
    throw error // rethrow the error to be caught
  }
}

type GetUserTokenPrivateInput = {
  username?: string | null
  jwt?: string | null
}

/**
 * get private account for a jwt
 */
export const getUserTokenPrivate = async ({
  // walletAddress = null,
  // username = null,
  jwt = null,
}: GetUserTokenPrivateInput) => {
  if (!jwt) return null

  try {
    const response = await client.get(`/user-v2/single-private`, {
      params: {
        // walletAddress,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    return response?.data?.data?.userToken
  } catch (error) {
    console.error(`getUserTokenPrivate failed`)
    return null
  }
}

type GetUserTokenPublicInput = {
  primaryWallet?: string | null
  jwt?: string | null
}

/**
 * get public account for a primaryWallet
 */
export const getUserTokenPublic = async ({
  primaryWallet = null,
  jwt = null,
}: GetUserTokenPublicInput) => {
  if (!primaryWallet) return null

  try {
    const response = await client.get(`/user-v2/single-public`, {
      params: {
        primaryWallet,
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.userToken
  } catch (error) {
    console.error(`getUserTokenPublic failed`)
    return null
  }
}

/**
 * get all user tokens
 */
export const getAllUserTokens = async ({
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
  jwt = null,
}: any) => {

  try {
    const response = await client.get(`/user-v2`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
      },
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.userTokens
  } catch (error) {
    console.error(`getAllUserTokens failed`)
    return null
  }
}

type UpdateUserTokenInput = {
  updatedChosenPublicName: string
  jwt: string
}

/**
 * right now just for changing chosenPublicName
 */
export const updateUserToken = async ({
  updatedChosenPublicName,
  jwt,
}: UpdateUserTokenInput) => {
  if (!jwt || !updatedChosenPublicName) return null

  const body = {
    updatedChosenPublicName
  }

  try {
    const response = await client.put(`/user-v2/update-profile`, body, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : null,
      },
    })

    return response?.data?.data?.userToken
  } catch (error) {
    console.error(`updateUserToken failed`)
    return null
  }
}
