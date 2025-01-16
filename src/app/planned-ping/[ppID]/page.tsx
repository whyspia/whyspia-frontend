"use client"

import { useInfiniteQuery, useQuery } from 'react-query'
import CircleSpinner from 'components/animations/CircleSpinner'
import { flatten } from 'lodash'
import apiGetDefinedEventSingle from 'actions/pingppl/apiGetDefinedEventSingle'
import ModalService from 'components/modals/ModalService'
import PingpplFollowConfirmModal from 'modules/places/pingppl/components/PingpplFollowConfirmModal'
import ContextSelectModal from 'modules/place/components/ContextSelectModal'
import { EMOTE_CONTEXTS } from 'modules/place/utils/ContextUtils'
import PingpplUnfollowConfirmModal from 'modules/places/pingppl/components/PingpplUnfollowConfirmModal'
import apiGetAllPingpplFollows from 'actions/pingppl/apiGetAllPingpplFollows'
import { useContext, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import YouGottaLoginModal from 'modules/users/components/YouGottaLoginModal'
import A from 'components/A'
import PersonClickModal from 'modules/users/components/PersonClickModal'
import { useParams } from 'next/navigation'

const PlannedPing = () => {
  const { userV2: loggedInUser, jwtToken } = useContext(GlobalContext)
  const { ppID } = useParams() as any


  const { data: ppData, isLoading: isPPDataLoading } = useQuery<any>(
    [ppID],
    () =>
      apiGetDefinedEventSingle({ definedEventId: ppID as string, jwt: jwtToken }),
    {
      enabled: Boolean(ppID) && Boolean(jwtToken),
    }
  )

  const fetchLoggedInUsersPingpplFollows = async ({ pageParam = 0 }) => {
    const follows = await apiGetAllPingpplFollows({ eventSender: ppData?.eventCreator, eventNameFollowed: ppData?.eventName, followSender: loggedInUser?.primaryWallet, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc', jwt: jwtToken })
    return follows
  }

  const { data: infinitePingpplFollows, fetchNextPage: fetchPingpplFollowsNextPage, hasNextPage: hasPingpplFollowsNextPage, isFetchingNextPage: isPingpplFollowsFetchingNextPage } = useInfiniteQuery(
    [`pingpplFollows-${loggedInUser?.primaryWallet}`, loggedInUser?.primaryWallet, ppData],
    ({ pageParam = 0 }) =>
      fetchLoggedInUsersPingpplFollows({
        pageParam
      }),
    {
      getNextPageParam: (lastGroup, allGroups) => {
        const NUM_FOLLOWS_BEING_PULLED_AT_ONCE = 100 // TODO: this could cause issues in the future
        const morePagesExist = lastGroup?.length === NUM_FOLLOWS_BEING_PULLED_AT_ONCE

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * NUM_FOLLOWS_BEING_PULLED_AT_ONCE
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: (Boolean(loggedInUser?.primaryWallet) && Boolean(ppData)),
      keepPreviousData: true,
    }
  )

  const [followingOrUnfollowHoveredId, setFollowingOrUnfollowHoveredId] = useState<string | null>(null)

  const handleMouseEnter = (id: string) => {
    setFollowingOrUnfollowHoveredId(id)
  }

  const handleMouseLeave = () => {
    setFollowingOrUnfollowHoveredId(null)
  }

  const pingpplFollowsData = flatten(infinitePingpplFollows?.pages || [])

  const pingpplFollow = pingpplFollowsData.find(follow => ((follow.eventNameFollowed === ppData?.eventName) && (follow.eventSender === ppData?.eventCreator)))
  const isFollowed = Boolean(pingpplFollow)
  const pingpplFollowId = pingpplFollow?.id

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      {isPPDataLoading ? (
        <CircleSpinner color="white" bgcolor="#0857e0" />
      ) : (
        <div className="md:w-1/2 w-full text-white">
          <div className="font-bold text-2xl mb-4 text-center">
            planned ping from{' '}
            <A
              onClick={(event) => {
                event.stopPropagation()
                // ModalService.open(SymbolSelectModal, { symbol: ppData?.eventCreator })
                ModalService.open(PersonClickModal, { userToken: ppData?.eventCreatorUser })
              }}
            >
              <span className="text-blue-500 hover:text-blue-700 cursor-pointer">{ppData?.eventCreatorUser?.calculatedDisplayName}</span>
            </A>
          </div>

          <div
            onClick={(event) => ModalService.open(ContextSelectModal, { context: EMOTE_CONTEXTS.NOTIF })}
            className="relative flex w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
          >
            <div>
              <div className="font-bold">{ppData?.eventName}</div>
              <div className="text-xs">{ppData?.eventDescription}</div>
            </div>

            {isFollowed ? (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  if (!jwtToken) {
                    ModalService.open(YouGottaLoginModal, {  })
                  } else {
                    ModalService.open(PingpplUnfollowConfirmModal, { pingpplFollowId, eventNameFollowed: ppData?.eventName, eventSenderUser: ppData?.eventCreatorUser, eventDescription: ppData?.eventDescription })
                  }
                }}
                className="transition-colors duration-300 flex items-center bg-[#1d8f89] rounded-lg text-md text-white ml-auto mr-4 px-2 font-bold border border-[#1d8f89] hover:border-white hover:bg-red-500 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(ppData?.id)}
                onMouseLeave={handleMouseLeave}
              >
                {followingOrUnfollowHoveredId === ppData?.id ? 'unfollow' : 'following'}
              </div>
            ): (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  if (!jwtToken) {
                    ModalService.open(YouGottaLoginModal, {  })
                  } else {
                    ModalService.open(PingpplFollowConfirmModal, { eventNameFollowed: ppData?.eventName, eventSenderUser: ppData?.eventCreatorUser, eventDescription: ppData?.eventDescription })
                  }
                }}
                className="flex items-center bg-[#1d8f89] rounded-lg text-md text-white ml-auto mr-4 px-2 font-bold border border-[#1d8f89] hover:border-white cursor-pointer"
              >
                follow
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default PlannedPing
