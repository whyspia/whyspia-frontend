import apiGetAllEmoteNotifs from 'actions/notifs/apiGetAllEmoteNotifs'
import { getUserToken } from 'actions/users/apiUserActions'
import { GlobalContext } from 'lib/GlobalContext'
import { deleteCookie } from 'modules/no-category/services/CookieService'
import { useContext } from 'react'

const useAuth = () => {
  const { setJwtToken, setUser, setUserNotifData } = useContext(GlobalContext)

  const setUserFromJwt = async (jwt: string) => {
    if (jwt) {
      const userToken = await getUserToken({ jwt })
      if (userToken) {
        setUser(userToken)
      }
      try {
        // this is only to get hasReadCasuallyFalseCount and hasReadDirectlyFalseCount - i dont think can use this for emoteNotifs bc pagination needs to be done on notification page - not with some global var
        const response = await apiGetAllEmoteNotifs({ skip: 0, limit: 10, orderBy: 'timestamp', orderDirection: 'desc', jwt })
        
        if (response) {
          setUserNotifData(response)
        }
      } catch (error) {
        console.error('useAuth apiGetAllEmoteNotifs failed', error)
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
