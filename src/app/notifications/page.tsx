"use client"

import { useInfiniteQuery } from 'react-query'
import { flatten } from 'lodash'
import apiGetAllEmoteNotifs from 'actions/notifs/apiGetAllEmoteNotifs'
import { useContext } from 'react'
import { NotifBlock } from 'modules/notifs/components/NotifBlock'
import apiGetAndUpdateAllEmoteNotifs from 'actions/notifs/apiGetAndUpdateAllEmoteNotifs'
import { GlobalContext } from 'lib/GlobalContext'


const Notifications = () => {
  const { jwtToken, setUserNotifData, userNotifData } = useContext(GlobalContext)

  const fetchNotifs = async ({ pageParam = 0 }) => {
    let notifs = null
    if (userNotifData && userNotifData?.hasReadCasuallyFalseCount <= 0) {
      notifs = await apiGetAllEmoteNotifs({ jwt: jwtToken, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    } else {
      notifs = await apiGetAndUpdateAllEmoteNotifs({ jwt: jwtToken, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    }
    setUserNotifData(notifs)
    return notifs ? notifs.emoteNotifs : []
  }

  const { data: infiniteNotifs, fetchNextPage: fetchNotifsNextPage, hasNextPage: hasNotifsNextPage, isFetchingNextPage: isNotifsFetchingNextPage } = useInfiniteQuery(
    ['notifs', jwtToken],
    ({ pageParam = 0 }) =>
      fetchNotifs({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const notifsData = flatten(infiniteNotifs?.pages || [])

  // console.log('notifsData==', notifsData)

  return (
    <div className="h-screen flex flex-col items-center mt-4 px-4">

      <h1 className="text-4xl font-bold mb-8">notifications</h1>

      <>
        {notifsData?.map((notif) => {
          

          return (
            <NotifBlock notif={notif} jwt={jwtToken} key={notif?.id} />
          )
        })}

        {hasNotifsNextPage && <button onClick={() => fetchNotifsNextPage()} disabled={!hasNotifsNextPage || isNotifsFetchingNextPage}>
          {isNotifsFetchingNextPage ? 'loading...' : 'load more'}
        </button>}
      </>

    </div>
  )
}

export default Notifications
