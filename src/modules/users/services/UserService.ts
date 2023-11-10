import { getUserToken, initiateTwitterLoginAPI } from 'actions/users/apiUserActions'

/**
 * User clicked to login to Twitter. Take user to external Twitter login page if account NOT already logged in. This should never get called when user already has JWT. The frontend just won't offer button to verify.
 * @returns true if account is already verified
 */
export const twitterLogin = async (jwt: string): Promise<boolean> => {
  const userToken = await getUserToken({ jwt })
  const alreadyVerified = userToken?.twitterUsername

  if (!alreadyVerified) {
    const authorizationUrl = (await initiateTwitterLoginAPI(jwt)).authorizationUrl
    window.location.href = authorizationUrl // Open user's new tab with external Twitter login page
    // window.open(authorizationUrl, '_blank') // Open user's new tab with external Twitter login page
  }

  return alreadyVerified
}

export type IdeamarketTwitterUser = {
  id: string
  twitterUserId: string
  twitterUsername: string
}
