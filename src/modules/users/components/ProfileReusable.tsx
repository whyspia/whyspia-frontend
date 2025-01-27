"use client"

import { useInfiniteQuery, useQuery } from 'react-query'
import { useParams  } from 'next/navigation'
import { getUserTokenPublic } from 'actions/users/apiUserActions'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { useContext, useEffect, useState } from 'react'
import { flatten } from 'lodash'
import { formatTimeAgo } from 'utils/randomUtils'
import toast from 'react-hot-toast'
import copy from 'copy-to-clipboard'
import { LinkIcon } from '@heroicons/react/24/outline'
import A from 'components/A'
import apiGetAllDefinitions from 'actions/symbol-definitions/apiGetAllDefinitions'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import apiGetAllSentEvents from 'actions/pingppl/apiGetAllSentEvents'
import apiGetAllDefinedEvents from 'actions/pingppl/apiGetAllDefinedEvents'
import classNames from 'classnames'
import ModalService from 'components/modals/ModalService'
import apiGetAllPingpplFollows from 'actions/pingppl/apiGetAllPingpplFollows'
import { GlobalContext } from 'lib/GlobalContext'
import { PublicPlannedPingBlock } from 'modules/places/pingppl/components/PublicPlannedPingBlock'
import PlannedPingReactModal from 'modules/places/pingppl/components/PlannedPingReactModal'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import { formatWalletAddress } from '../utils/WalletUtils'
import { CurrentlyResponse } from 'modules/places/currently/types/apiCurrentlyTypes'
import { apiGetCurrentlySingleWithAnyActiveField } from 'actions/currently/apiGetCurrentlySingle'
import { getDisplayTimeLeft } from 'modules/places/currently/types/durationTypes'
import CurrentlyFollowModal from 'modules/places/currently/components/CurrentlyFollowModal'
import PersonClickModal from './PersonClickModal'

const availableTabs = ['currently', 'planned-notifs', 'sent-notifs', 'sent-emotes', 'received-emotes', 'symbols']

const ProfileReusable = () => {
  const { userV2: loggedInUser, jwtToken } = useContext(GlobalContext)

  const { primaryWallet, tabName, symbol } = useParams() as any

  const [selectedDefinitionId, setSelectedDefinitionId] = useState(null)

  const [plannedPingSearchBarQuery, setPlannedPingSearchBarQuery] = useState('')

  const { data: userData } = useQuery<any>(
    [{ primaryWallet }],
    () =>
      getUserTokenPublic({
        primaryWallet,
        jwt: jwtToken,
      }),
    {
      enabled: Boolean(jwtToken),
    }
  )

  const [activeTab, setActiveTab] = useState<string | null>(null)

  const [searchDefsQuery, setSearchDefsQuery] = useState('')

  const { data: currentlyData } = useQuery<CurrentlyResponse>(
    ['currently', primaryWallet],
    () => apiGetCurrentlySingleWithAnyActiveField({
      jwt: jwtToken,
      senderPrimaryWallet: primaryWallet
    }),
    {
      enabled: Boolean(primaryWallet),
      refetchOnMount: true,
      refetchOnWindowFocus: true
    }
  )

  useEffect(() => {
    if (tabName && availableTabs.includes(tabName?.toLowerCase())) {
      setActiveTab(tabName)
    } else {
      setActiveTab('currently')
    }
  }, [tabName])

  useEffect(() => {
    if (symbol) {
      setSearchDefsQuery(symbol)
    }
  }, [symbol])

  const fetchDefinedEvents = async ({ pageParam = 0 }) => {
    const definedEvents = await apiGetAllDefinedEvents({ eventCreator: userData?.primaryWallet, search: plannedPingSearchBarQuery, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc', jwt: jwtToken })
    return definedEvents
  }

  const { data: infiniteDefinedEvents, fetchNextPage: fetchDENextPage, hasNextPage: hasDENextPage, isFetchingNextPage: isFetchingDENextPage } = useInfiniteQuery(
    [`infiniteDefinedEvents-${userData?.primaryWallet}`, plannedPingSearchBarQuery],
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
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: Boolean(userData?.primaryWallet),
      keepPreviousData: true,
    }
  )

  const fetchSentEvents = async ({ pageParam = 0 }) => {
    const sentEvents = await apiGetAllSentEvents({ eventSender: userData?.primaryWallet, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc', jwt: jwtToken })
    return sentEvents
  }

  const { data: infiniteSentEvents, fetchNextPage: fetchSENextPage, hasNextPage: hasSENextPage, isFetchingNextPage: isFetchingSENextPage } = useInfiniteQuery(
    [`infiniteSentEvents-${userData?.primaryWallet}`],
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
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: Boolean(userData?.primaryWallet),
      keepPreviousData: true,
    }
  )

  const fetchSentEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ senderPrimaryWallet: primaryWallet, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteSentEmotes, fetchNextPage: fetchSentNextPage, hasNextPage: hasSentNextPage, isFetchingNextPage: isSentFetchingNextPage } = useInfiniteQuery(
    ['sent-emotes', 10, primaryWallet],
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
      enabled: Boolean(userData?.primaryWallet),
      keepPreviousData: true,
    }
  )

  const fetchReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ receiverSymbols: [primaryWallet], skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    ['received-emotes', 10, primaryWallet],
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
      enabled: Boolean(userData?.primaryWallet),
      keepPreviousData: true,
    }
  )

  const fetchDefinitions = async ({ pageParam = 0 }) => {
    const defintions = await apiGetAllDefinitions({ symbol: searchDefsQuery, senderPrimaryWallet: userData?.primaryWallet, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return defintions
  }

  const { data: infiniteDefinitions, fetchNextPage: fetchDefinitionsNextPage, hasNextPage: hasDefinitionsNextPage, isFetchingNextPage: isDefinitionsFetchingNextPage } = useInfiniteQuery(
    ['definitions', 10, userData?.primaryWallet, searchDefsQuery, symbol],
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
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: Boolean(userData?.primaryWallet),
      keepPreviousData: true,
    }
  )

  const fetchLoggedInUsersPingpplFollows = async ({ pageParam = 0 }) => {
    const follows = await apiGetAllPingpplFollows({ eventSender: userData?.primaryWallet, followSender: loggedInUser?.primaryWallet, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc', jwt: jwtToken })
    return follows
  }

  const { data: infinitePingpplFollows, fetchNextPage: fetchPingpplFollowsNextPage, hasNextPage: hasPingpplFollowsNextPage, isFetchingNextPage: isPingpplFollowsFetchingNextPage } = useInfiniteQuery(
    [`pingpplFollows-${loggedInUser?.primaryWallet}`],
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
      enabled: Boolean(userData?.primaryWallet),
      keepPreviousData: true,
    }
  )

  const onTabChanged = (tabName: string) => {
    setActiveTab(tabName)
    const updatedURL = `/u/${primaryWallet}/${tabName}`
    window.history.pushState(null, null, updatedURL)
    setSelectedDefinitionId(null)
  }

  const onSymbolTyped = (symbol: string) => {
    setSearchDefsQuery(symbol)

    const updatedURL = `/u/${primaryWallet}/symbols/${symbol}`
    window.history.pushState(null, null, updatedURL)
    setSelectedDefinitionId(null)
  }

  const handleCopyWalletID = () => {
    if (userData?.primaryWallet) {
      copy(userData.primaryWallet) // Copy the wallet ID to clipboard
      toast.success('whyspia ID copied to clipboard') // Show success toast
    }
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

  const showCalculatedDisplayNameIfDiff = (userData?.calculatedDisplayName && userData?.calculatedDisplayName !== userData?.chosenPublicName) ? userData?.calculatedDisplayName : null

  return (
    <div className="h-screen flex flex-col items-center mt-10 px-4">

      <h1 className="text-4xl font-bold mb-4">
        {userData?.chosenPublicName}
        {showCalculatedDisplayNameIfDiff && (<span className="text-xs ml-2">({userData?.calculatedDisplayName})</span>)}
      </h1>
      <div
        onClick={handleCopyWalletID}
        className="text-xs text-gray-500 mb-4 flex items-center cursor-pointer"
      >
        <LinkIcon
          className={'w-4 h-4'}
        />
        <span className="ml-1">{formatWalletAddress(userData.primaryWallet)}</span>
      </div>

      <div className="flex flex-wrap mb-4">

        <button
          onClick={() => onTabChanged('currently')}
          className={classNames(
            'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            activeTab === 'currently' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
        >
          currently
        </button>

        <button
          onClick={() => onTabChanged('planned-notifs')}
          className={classNames(
            'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            activeTab === 'planned-notifs' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
        >
          planned notifs
        </button>

        <button
          onClick={() => onTabChanged('sent-notifs')}
          className={classNames(
            'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            activeTab === 'sent-notifs' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
        >
          sent notifs
        </button>

        {/* <button
          onClick={() => onTabChanged('sent-emotes')}
          className={classNames(
            'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            activeTab === 'sent-emotes' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
        >
          sent emotes
        </button>

        <button
          onClick={() => onTabChanged('received-emotes')}
          className={classNames(
            'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            activeTab === 'received-emotes' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
        >
          received emotes
        </button> */}

        <button
          onClick={() => onTabChanged('symbols')}
          className={classNames(
            'relative p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
            activeTab === 'symbols' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
          )}
        >
          definitions
        </button>
      </div>

      {activeTab === 'currently' && (
        <div className="md:w-[37rem] w-full">
          <div className="relative group">
            <div className="absolute top-2 right-2 hidden md:block z-[600]">
              <button 
                className="px-3 py-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  ModalService.open(CurrentlyFollowModal, {
                    userToken: userData
                  })
                }}
              >
                follow options
              </button>
            </div>

            <div className="absolute top-2 right-2 md:hidden block z-[600]">
              <button 
                className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-md cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  ModalService.open(CurrentlyFollowModal, {
                    userToken: userData
                  })
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </button>
            </div>

            <div className="p-6 border-2 border-white rounded-2xl group/main relative">
              <A
                onClick={(event) => {
                  event.stopPropagation()
                  ModalService.open(PersonClickModal, { userToken: userData })
                }}
                className="text-blue-500 hover:text-blue-700 cursor-pointer text-lg"
              >
                {userData?.chosenPublicName}
              </A>

              {currentlyData?.place && (
                <div 
                  className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative cursor-pointer hover:bg-[#1d8f89]/60"
                  onClick={(e) => {
                    e.stopPropagation()
                    ModalService.open(CurrentlyFollowModal, {
                      userToken: userData,
                      selectedPlace: currentlyData.place
                    })
                  }}
                >
                  <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                    <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                      {getDisplayTimeLeft(currentlyData.place.duration, currentlyData.place.updatedDurationAt)}
                    </div>
                    <div className="absolute inset-0 bg-[#1d8f89]/50 rounded-tr-lg rounded-bl-lg" style={{ zIndex: -1 }}></div>
                  </div>
                  <span className="text-gray-400 font-semibold font-mono">PLACE:</span>
                  <div className="mt-2">
                    <div className="text-sm">
                      {currentlyData.place.text}
                    </div>
                  </div>
                </div>
              )}

              {currentlyData?.wantOthersToKnowTags?.length > 0 && (
                <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg">
                  <span className="text-gray-400 font-semibold font-mono">WANT_YOU_TO_KNOW_TAGS:</span>
                  <div className="mt-2">
                    {currentlyData.wantOthersToKnowTags.map((tag, index) => (
                      <div 
                        key={index} 
                        className="inline-block bg-[#1d8f89] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-[#1d8f89]/80"
                        onClick={(e) => {
                          e.stopPropagation()
                          ModalService.open(CurrentlyFollowModal, {
                            userToken: userData,
                            selectedTag: tag
                          })
                        }}
                      >
                        <span>{tag.tag}</span>
                        <span className="mx-1 opacity-60">·</span>
                        <span className="opacity-60">
                          {getDisplayTimeLeft(tag.duration, tag.updatedDurationAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentlyData?.status && (
                <div className="mt-2 p-4 bg-[#1d8f89]/50 rounded-lg relative">
                  <div className="absolute top-0 right-0 text-xs rounded-tr-lg rounded-bl-lg" style={{ background: 'rgb(29 143 137)' }}>
                    <div className="bg-[#1d8f89] px-3 py-1 rounded-tr-lg rounded-bl-lg">
                      {getDisplayTimeLeft(currentlyData.status.duration, currentlyData.status.updatedDurationAt)}
                    </div>
                    <div className="absolute inset-0 bg-[#1d8f89]/50 rounded-tr-lg rounded-bl-lg" style={{ zIndex: -1 }}></div>
                  </div>
                  <span className="text-gray-400 font-semibold font-mono">STATUS:</span>
                  <div className="mt-2">
                    <div className="text-sm">
                      {currentlyData.status.text}
                    </div>
                  </div>
                </div>
              )}

              {!currentlyData?.place && !currentlyData?.status && (!currentlyData?.wantOthersToKnowTags || currentlyData.wantOthersToKnowTags.length === 0) && (
                <div className="text-xs text-gray-500">nothing shared yet...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'planned-notifs' && (
        <div className="md:w-1/2 w-full text-white">

          <input
            type="text"
            value={plannedPingSearchBarQuery}
            onChange={(e) => setPlannedPingSearchBarQuery(e.target.value)}
            placeholder="search planned notifs..."
            className="block md:w-[30rem] w-full mx-auto mb-4 border border-gray-300 rounded px-3 py-2"
          />

          {definedEventsData.map((plannedEvent) => {
            const pingpplFollow = pingpplFollowsData.find(follow => ((follow.eventNameFollowed === plannedEvent?.eventName) && (follow.eventSender === plannedEvent?.eventCreator)))
            const isFollowed = Boolean(pingpplFollow)
            const pingpplFollowId = pingpplFollow?.id
            return (
              <PublicPlannedPingBlock plannedEvent={plannedEvent} key={plannedEvent.id} jwt={jwtToken} isLoggedInUserFollowing={isFollowed} pingpplFollowId={pingpplFollowId} />
            )
          })}

          {hasDENextPage && <button onClick={() => fetchDENextPage()} disabled={!hasDENextPage || isFetchingDENextPage}>
            {isFetchingDENextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}

      {activeTab === 'sent-notifs' && (
        <div className="md:w-1/2 w-full text-white">
          {sentEventsData.map((sentEvent) => (
            <div
              key={sentEvent.id}
              onClick={(event) => ModalService.open(PlannedPingReactModal, { plannedEvent: sentEvent?.definedEvent })}
              className="relative w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
            >
              <div className="">{sentEvent?.eventSenderUser?.calculatedDisplayName} sent{' '}
              <A
                onClick={(e) => {
                  e.stopPropagation()
                  ModalService.open(PlannedPingReactModal, { plannedEvent: sentEvent?.definedEvent })
                }}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                {sentEvent.eventName}
              </A>{' '}
              - {formatTimeAgo((sentEvent)?.createdAt)}</div>
            </div>
          ))}

          {hasSENextPage && <button onClick={() => fetchSENextPage()} disabled={!hasSENextPage || isFetchingSENextPage}>
            {isFetchingSENextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}

      {activeTab === 'sent-emotes' && (
        <div className="md:w-[36rem] w-full">
          {sentEmotesData?.map((emote) => {
            
            return (
              <SentEmoteBlock emote={emote} key={emote.id} />
            )
          })}

          {hasSentNextPage && <button onClick={() => fetchSentNextPage()} disabled={!hasSentNextPage || isSentFetchingNextPage}>
            {isSentFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}

      {activeTab === 'received-emotes' && (
        <div className="md:w-[36rem] w-full">
          {receivedEmotesData?.map((emote) => {
            
            return (
              <SentEmoteBlock emote={emote} key={emote.id} />
            )
          })}

          {hasReceivedNextPage && <button onClick={() => fetchReceivedNextPage()} disabled={!hasReceivedNextPage || isReceivedFetchingNextPage}>
            {isReceivedFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </div>
      )}

      {activeTab === 'symbols' && (
        <div className="md:w-[30rem] w-full">
          {/* {definitionsData?.map((definition) => (
            <div className="text-lg" key={definition.id}>
              <A href={`/u/${definition.senderPrimaryWallet}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{definition.senderPrimaryWallet}</A> defined "<A href={`/symbol/${definition.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">{definition.symbol}</A>" - {formatTimeAgo(definition.timestamp)}
            </div>
          ))}

          {hasDefinitionsNextPage && <button onClick={() => fetchDefinitionsNextPage()} disabled={!hasDefinitionsNextPage || isDefinitionsFetchingNextPage}>
            {isDefinitionsFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>} */}

          <input
            type="text"
            value={searchDefsQuery}
            onChange={(e) => onSymbolTyped(e.target.value)}
            placeholder="enter exact symbol..."
            className="md:w-[30rem] w-full border border-gray-300 rounded px-3 py-2 my-8"
          />

          {definitionsData?.map((definitionItem) => (
            <div className="w-full flex flex-col items-center py-3 mb-8 border border-gray-300" key={definitionItem.id}>
              <A
                onClick={(event) => {
                  event.stopPropagation()
                  ModalService.open(SymbolSelectModal, { symbol: definitionItem.symbol })
                }}
                className="font-bold text-4xl mb-2 text-red-500 hover:text-red-700 cursor-pointer"
              >
                {definitionItem.symbol}
              </A>
              <div className="text-lg mb-2 whitespace-pre-wrap break-words leading-5">{definitionItem.currentDefinition}</div>
              <div className="text-xs mb-2">last updated - {formatTimeAgo(definitionItem.timestamp) }</div>

              {definitionItem?.pastDefinitions && definitionItem?.pastDefinitions?.length > 0 && (
                <div
                  onClick={() => setSelectedDefinitionId(selectedDefinitionId === definitionItem.id ? null : definitionItem.id)}
                  className="mb-4 flex items-center text-blue-500"
                >
                  <div className="mr-1 font-bold text-sm cursor-pointer">previous definitions</div>
                  
                  <div className="cursor-pointer">
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
                      <div className="text-lg mb-2 whitespace-pre-wrap break-words leading-5">{prevDefinitionData.definition}</div>
                      <div className="text-xs">created {formatTimeAgo(prevDefinitionData.dateCreated) }</div>
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
