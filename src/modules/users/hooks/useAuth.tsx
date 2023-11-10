import { getUserToken } from 'actions/users/apiUserActions'
import { GlobalContext } from 'lib/GlobalContext'
import { deleteCookie } from 'modules/no-category/services/CookieService'
import { useContext } from 'react'

const useAuth = () => {
  const { setJwtToken, setUser } = useContext(GlobalContext)

  const setUserFromJwt = async (jwt: string) => {
    if (jwt) {
      const userToken = await getUserToken({ jwt })
      if (userToken) {
        setUser(userToken)
      }
    }
  }

  const twitterLogout = (): void => {
    deleteCookie('tt')
    setUser(null)
    setJwtToken(null)
  }

  return { setUserFromJwt, twitterLogout, }
}

export default useAuth
