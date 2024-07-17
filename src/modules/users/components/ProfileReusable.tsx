import { useInfiniteQuery, useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getUserToken } from 'actions/users/apiUserActions'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { useContext, useEffect, useState } from 'react'
import { flatten } from 'lodash'
import { formatTimeAgo } from 'utils/randomUtils'
import A from 'components/A'
import apiGetAllDefinitions from 'actions/symbol-definitions/apiGetAllDefinitions'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline"
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import apiGetAllSentEvents from 'actions/pingppl/apiGetAllSentEvents'
import apiGetAllDefinedEvents from 'actions/pingppl/apiGetAllDefinedEvents'
import classNames from 'classnames'
import ModalService from 'components/modals/ModalService'
import PingpplFollowConfirmModal from 'modules/contexts/pingppl/components/PingpplFollowConfirmModal'
import apiGetAllPingpplFollows from 'actions/pingppl/apiGetAllPingpplFollows'
import { GlobalContext } from 'lib/GlobalContext'
import PingpplUnfollowConfirmModal from 'modules/contexts/pingppl/components/PingpplUnfollowConfirmModal'

const availableTabs = ['planned-pings', 'sent-pings', 'sent-emotes', 'received-emotes', 'symbols']

const ProfileReusable = () => {
  const router = useRouter()
  const { user: loggedInUser } = useContext(GlobalContext)
  const { username, tabName, symbol } = router.query as any
  const [selectedDefinitionId, setSelectedDefinitionId] = useState(null)

  const [plannedPingSearchBarQuery, setPlannedPingSearchBarQuery] = useState('')

  const { data: userData } = useQuery<any>(
    [{ username }],
    () =>
      getUserToken({
        username,
      }),
    // {
    //   enabled: !isTxPending,
    // }
  )

  const [activeTab, setActiveTab] = useState(null)

  const [followingOrUnfollowHoveredId, setFollowingOrUnfollowHoveredId] = useState<string | null>(null)

  const handleMouseEnter = (id: string) => {
    setFollowingOrUnfollowHoveredId(id)
  }

  const handleMouseLeave = () => {
    setFollowingOrUnfollowHoveredId(null)
  }

  const [searchDefsQuery, setSearchDefsQuery] = useState('')

  useEffect(() => {
    if (tabName && availableTabs.includes(tabName?.toLowerCase())) {
      setActiveTab(tabName)
    } else {
      setActiveTab('planned-pings')
    }
  }, [tabName])

  useEffect(() => {
    if (symbol) {
      setSearchDefsQuery(symbol)
    }
  }, [symbol])

  const fetchDefinedEvents = async ({ pageParam = 0 }) => {
    const definedEvents = await apiGetAllDefinedEvents({ eventCreator: userData?.twitterUsername, search: plannedPingSearchBarQuery, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return definedEvents
  }

  const { data: infiniteDefinedEvents, fetchNextPage: fetchDENextPage, hasNextPage: hasDENextPage, isFetchingNextPage: isFetchingDENextPage } = useInfiniteQuery(
    [`infiniteDefinedEvents-${userData?.twitterUsername}`, plannedPingSearchBarQuery],
    ({ pageParam = 0 }) =>
      fetchDefinedEvents({
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(userData?.twitterUsername),
      keepPreviousData: true,
    }
  )

  const fetchSentEvents = async ({ pageParam = 0 }) => {
    const sentEvents = await apiGetAllSentEvents({ eventSender: userData?.twitterUsername, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return sentEvents
  }

  const { data: infiniteSentEvents, fetchNextPage: fetchSENextPage, hasNextPage: hasSENextPage, isFetchingNextPage: isFetchingSENextPage } = useInfiniteQuery(
    [`infiniteSentEvents-${userData?.twitterUsername}`],
    ({ pageParam = 0 }) =>
      fetchSentEvents({
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(userData?.twitterUsername),
      keepPreviousData: true,
    }
  )

  const fetchSentEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ senderTwitterUsername: username, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteSentEmotes, fetchNextPage: fetchSentNextPage, hasNextPage: hasSentNextPage, isFetchingNextPage: isSentFetchingNextPage } = useInfiniteQuery(
    ['sent-emotes', 10, username],
    ({ pageParam = 0 }) =>
      fetchSentEmotes({
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(userData?.twitterUsername),
      keepPreviousData: true,
    }
  )

  const fetchReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ receiverSymbols: [username], skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    ['received-emotes', 10, username],
    ({ pageParam = 0 }) =>
    fetchReceivedEmotes({
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(userData?.twitterUsername),
      keepPreviousData: true,
    }
  )

  const fetchDefinitions = async ({ pageParam = 0 }) => {
    const defintions = await apiGetAllDefinitions({ symbol: searchDefsQuery, senderTwitterUsername: userData?.twitterUsername, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return defintions
  }

  const { data: infiniteDefinitions, fetchNextPage: fetchDefinitionsNextPage, hasNextPage: hasDefinitionsNextPage, isFetchingNextPage: isDefinitionsFetchingNextPage } = useInfiniteQuery(
    ['definitions', 10, userData?.twitterUsername, searchDefsQuery, symbol],
    ({ pageParam = 0 }) =>
    fetchDefinitions({
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: Boolean(userData?.twitterUsername),
      keepPreviousData: true,
    }
  )

  const fetchLoggedInUsersPingpplFollows = async ({ pageParam = 0 }) => {
    const follows = await apiGetAllPingpplFollows({ eventSender: userData?.twitterUsername, followSender: loggedInUser?.twitterUsername, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return follows
  }

  const { data: infinitePingpplFollows, fetchNextPage: fetchPingpplFollowsNextPage, hasNextPage: hasPingpplFollowsNextPage, isFetchingNextPage: isPingpplFollowsFetchingNextPage } = useInfiniteQuery(
    [`pingpplFollows-${loggedInUser?.twitterUsername}`],
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
      enabled: Boolean(userData?.twitterUsername),
      keepPreviousData: true,
    }
  )

  const onTabChanged = (tabName: string) => {
    setActiveTab(tabName)
    const updatedURL = `/u/${username}/${tabName}`
    window.history.pushState(null, null, updatedURL)
    setSelectedDefinitionId(null)
  }

  const onSymbolTyped = (symbol: string) => {
    setSearchDefsQuery(symbol)

    const updatedURL = `/u/${username}/symbols/${symbol}`
    window.history.pushState(null, null, updatedURL)
    setSelectedDefinitionId(null)
  }

  const definedEventsData = flatten(infiniteDefinedEvents?.pages || [])
  const sentEventsData = flatten(infiniteSentEvents?.pages || [])
  const sentEmotesData = flatten(infiniteSentEmotes?.pages || [])
  const receivedEmotesData = flatten(infiniteReceivedEmotes?.pages || [])
  const definitionsData = flatten(infiniteDefinitions?.pages || [])
  const pingpplFollowsData = flatten(infinitePingpplFollows?.pages || [])

  // console.log('sentEmotesData==', sentEmotesData)
  // console.log('receivedEmotesData==', receivedEmotesData)

  // console.log('userData==', userData)

  if (!userData) {
    return (
      <div className="h-screen flex flex-col items-center mt-10">

        <h1 className="text-4xl font-bold mb-4">dang bruh - no user found in the DB</h1>

      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <h1 className="text-4xl font-bold mb-4">{userData?.twitterUsername}</h1>

      <div className="flex flex-wrap mb-4">

        <button
          onClick={() => onTabChanged('planned-pings')}
          className={classNames(
            'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
            activeTab === 'planned-pings' ? 'bg-purple-500' : '',
          )}
        >
          planned pings
        </button>

        <button
          onClick={() => onTabChanged('sent-pings')}
          className={classNames(
            'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
            activeTab === 'sent-pings' ? 'bg-purple-500' : '',
          )}
        >
          sent pings
        </button>

        <button
          onClick={() => onTabChanged('sent-emotes')}
          className={classNames(
            'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
            activeTab === 'sent-emotes' ? 'bg-purple-500' : '',
          )}
        >
          sent emotes
        </button>

        <button
          onClick={() => onTabChanged('received-emotes')}
          className={classNames(
            'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
            activeTab === 'received-emotes' ? 'bg-purple-500' : '',
          )}
        >
          received emotes
        </button>

        <button
          onClick={() => onTabChanged('symbols')}
          className={classNames(
            'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
            activeTab === 'symbols' ? 'bg-purple-500' : '',
          )}
        >
          symbols
        </button>
      </div>

      {activeTab === 'planned-pings' && (
        <div className="md:w-1/2 w-full text-white">

          <input
            type="text"
            value={plannedPingSearchBarQuery}
            onChange={(e) => setPlannedPingSearchBarQuery(e.target.value)}
            placeholder="search planned pings..."
            className="hidden md:block w-[30rem] mx-auto mb-4 border border-gray-300 rounded px-3 py-2"
          />

          {definedEventsData.map((event) => {
            const pingpplFollow = pingpplFollowsData.find(follow => ((follow.eventNameFollowed === event.eventName) && (follow.eventSender === event.eventCreator)))
            const isFollowed = Boolean(pingpplFollow)
            const pingpplFollowId = pingpplFollow?.id
            return (
              <div
                key={event.id}
                // onClick={(event) => ModalService.open(EmoteSelectModal, { emote: notif?.notifData })}
                className="relative flex w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
              >
                <div>
                  <div className="font-bold">{event.eventName}</div>
                  <div className="text-xs">{event.eventDescription}</div>
                </div>

                {isFollowed ? (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      ModalService.open(PingpplUnfollowConfirmModal, { pingpplFollowId, eventNameFollowed: event.eventName, eventSender: userData?.twitterUsername, eventDescription: event.eventDescription })
                    }}
                    className="transition-colors duration-300 flex items-center bg-purple-500 rounded-lg text-md text-white ml-auto mr-4 px-2 font-bold border border-purple-500 hover:border-white hover:bg-red-500 cursor-pointer"
                    onMouseEnter={() => handleMouseEnter(event.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {followingOrUnfollowHoveredId === event.id ? 'unfollow' : 'following'}
                  </div>
                ): (
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      ModalService.open(PingpplFollowConfirmModal, { eventNameFollowed: event.eventName, eventSender: userData?.twitterUsername, eventDescription: event.eventDescription })
                    }}
                    className="flex items-center bg-purple-500 rounded-lg text-md text-white ml-auto mr-4 px-2 font-bold border border-purple-500 hover:border-white cursor-pointer"
                  >
                    follow
                  </div>
                )}
              </div>
            )
          })}

          {hasDENextPage && <button onClick={() => fetchDENextPage()} disabled={!hasDENextPage || isFetchingDENextPage}>
            {isFetchingDENextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}

      {activeTab === 'sent-pings' && (
        <div className="md:w-1/2 w-full text-white">
          {sentEventsData.map((event) => (
            <div
              key={event.id}
              // onClick={(event) => ModalService.open(EmoteSelectModal, { emote: notif?.notifData })}
              className="relative w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
            >
              <div className="">you sent{' '}
              <A
                onClick={(e) => {
                  e.stopPropagation()
                  // ModalService.open(SymbolSelectModal, { symbol: event.eventName })
                }}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                {event.eventName}
              </A>{' '}
              - {formatTimeAgo((event)?.createdAt)}</div>
            </div>
          ))}

          {hasSENextPage && <button onClick={() => fetchSENextPage()} disabled={!hasSENextPage || isFetchingSENextPage}>
            {isFetchingSENextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}

      {activeTab === 'sent-emotes' && (
        <>
          {sentEmotesData?.map((emote) => {
            
            return (
              <SentEmoteBlock emote={emote} key={emote.id} />
            )
          })}

          {hasSentNextPage && <button onClick={() => fetchSentNextPage()} disabled={!hasSentNextPage || isSentFetchingNextPage}>
            {isSentFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </>
      )}

      {activeTab === 'received-emotes' && (
        <>
          {receivedEmotesData?.map((emote) => {
            
            return (
              <SentEmoteBlock emote={emote} key={emote.id} />
            )
          })}

          {hasReceivedNextPage && <button onClick={() => fetchReceivedNextPage()} disabled={!hasReceivedNextPage || isReceivedFetchingNextPage}>
            {isReceivedFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </>
      )}

      {activeTab === 'symbols' && (
        <div className="w-[30rem]">
          {/* {definitionsData?.map((definition) => (
            <div className="text-lg" key={definition.id}>
              <A href={`/u/${definition.senderTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{definition.senderTwitterUsername}</A> defined "<A href={`/symbol/${definition.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">{definition.symbol}</A>" - {formatTimeAgo(definition.timestamp)}
            </div>
          ))}

          {hasDefinitionsNextPage && <button onClick={() => fetchDefinitionsNextPage()} disabled={!hasDefinitionsNextPage || isDefinitionsFetchingNextPage}>
            {isDefinitionsFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>} */}

          <input
            type="text"
            value={searchDefsQuery}
            onChange={(e) => onSymbolTyped(e.target.value)}
            placeholder="Enter exact symbol..."
            className="w-[30rem] border border-gray-300 rounded px-3 py-2 my-8"
          />

          {definitionsData?.map((definitionItem) => (
            <div className="w-full flex flex-col items-center py-3 mb-8 border border-gray-300" key={definitionItem.id}>
              <div className="font-bold text-4xl mb-2">{definitionItem.symbol}</div>
              <div className="text-lg mb-2">{definitionItem.currentDefinition}</div>
              <div className="text-xs mb-2">Last updated - {formatTimeAgo(definitionItem.timestamp) }</div>

              {definitionItem?.pastDefinitions && definitionItem?.pastDefinitions?.length > 0 && (
                <div className="mb-4 flex items-center text-blue-500">
                  <div className="mr-1 font-bold text-sm cursor-pointer">Previous definitions</div>
                  
                  <div
                    onClick={() => setSelectedDefinitionId(selectedDefinitionId === definitionItem.id ? null : definitionItem.id)}
                    className="cursor-pointer"
                  >
                    {selectedDefinitionId === definitionItem.id ? (
                      <ChevronUpIcon className="w-5" />
                    ) : (
                      <ChevronDownIcon className="w-5" />
                    )}
                  </div>
                </div>
              )}

              {selectedDefinitionId === definitionItem.id && (
                <div className="w-full flex flex-col items-center">
                  {definitionItem?.pastDefinitions?.map((prevDefinitionData) => (
                    <div className="w-full flex flex-col items-center py-4 border-t border-gray-300" key={prevDefinitionData._id}>
                      <div className="text-lg mb-2">{prevDefinitionData.definition}</div>
                      <div className="text-xs">Created {formatTimeAgo(prevDefinitionData.dateCreated) }</div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}

          {hasDefinitionsNextPage && <button onClick={() => fetchDefinitionsNextPage()} disabled={!hasDefinitionsNextPage || isDefinitionsFetchingNextPage}>
            {isDefinitionsFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}
    </div>
  )
}

export default ProfileReusable
