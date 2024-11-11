import client from 'lib/axios'

export const uploadAccountPhoto = ({ formData, token }: any) =>
  client.post(`/user-token/profilePhoto`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'content-Type': 'multipart/form-data',
    },
  })

export const sendVerificationCodeToAccountEmail = ({ token, email }: any) =>
  client.get(`/user-token/emailVerification`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      email,
    },
  })

export const checkAccountEmailVerificationCode = ({ token, code, email }: any) =>
  client.post(
    `/user-token/emailVerification`,
    { code, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

/**
 *
 */
export const initiateTwitterLoginAPI = async (jwt: string | null): Promise<any> => {
  try {
    const response = await client.post(
      `/user-token/initiateTwitterLogin`,
      {
        returnHere: window.location.href
      },
      {
        headers: {
          Authorization: jwt ? `Bearer ${jwt}` : null,
        },
      }
    )
    return response?.data?.data?.twitterVerification
  } catch (error) {
    console.error(
      `Could not generate access token for twitter authentication`,
      error
    )
  }
}

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

/**
 *
 */
export const completeTwitterLogin = async (
  requestToken: string,
  oAuthVerifier: string,
) => {
  try {
    const response = await client.post(
      `/user-token/completeTwitterLogin`,
      { requestToken, oAuthVerifier },
    )
    return response?.data?.data?.twitterVerification
  } catch (error) {
    console.error(`Could not complete twitter login`, error)
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

type GetUserTokenInput = {
  username?: string | null
  jwt?: string | null
}

/**
 * Get account for a walletAddress, username, or jwt
 */
export const getUserToken = async ({
  // walletAddress = null,
  // username = null,
  jwt = null,
}: GetUserTokenInput) => {
  if (!jwt) return null

  try {
    const response = await client.get(`/user-v2/single`, {
      params: {
        // twitterUsername: username,
        // walletAddress,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    return response?.data?.data?.userToken
  } catch (error) {
    console.error(`getUserToken failed`)
    return null
  }
}

/**
 * Get all user tokens
 */
export const getAllUserTokens = async ({
  skip,
  limit,
  orderBy,
  orderDirection,
  search = null,
}: any) => {

  try {
    const response = await client.get(`/user-token`, {
      params: {
        skip,
        limit,
        orderBy,
        orderDirection,
        search,
      },
      // headers: {
      //   Authorization: `Bearer ${jwt}`,
      // },
    })

    return response?.data?.data?.userTokens
  } catch (error) {
    console.error(`getAllUserTokens failed`)
    return null
  }
}

/**
 * 
 * @param username 
 * @returns { isExisting: false, userToken: null }
 */
export async function checkExistingTwitterProfile(username: string) {
  try {
    const response = await client.get('/user-token/checkExistingTwitterProfile', {
      params: {
        username,
      },
    })

    return response?.data?.data
  } catch (error) {
    console.error('Could not check if twitter profile is existing', error)
    return { isExisting: false, userToken: null }
  }
}

type UpdateUserTokenInput = {
  updatedDisplayName: string
  jwt: string
}

/**
 * right now just for changing displayName
 */
export const updateUserToken = async ({
  updatedDisplayName,
  jwt,
}: UpdateUserTokenInput) => {
  if (!jwt || !updatedDisplayName) return null

  const body = {
    updatedDisplayName
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
