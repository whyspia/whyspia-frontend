import { useInfiniteQuery, useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { getUserToken } from 'actions/users/apiUserActions'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { useEffect, useState } from 'react'
import { flatten } from 'lodash'
import { formatTimeAgo } from 'utils/randomUtils'
import A from 'components/A'
import apiGetAllDefinitions from 'actions/symbol-definitions/apiGetAllDefinitions'
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline"

const availableTabs = ['sent', 'received', 'symbols']

const ProfileReusable = () => {
  const router = useRouter()
  const { username, tabName, symbol } = router.query as any
  const [selectedDefinitionId, setSelectedDefinitionId] = useState(null)


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

  const [searchDefsQuery, setSearchDefsQuery] = useState('')

  useEffect(() => {
    if (tabName && availableTabs.includes(tabName?.toLowerCase())) {
      setActiveTab(tabName)
    } else {
      setActiveTab('sent')
    }
  }, [tabName])

  useEffect(() => {
    if (symbol) {
      setSearchDefsQuery(symbol)
    }
  }, [symbol])

  const fetchSentEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ senderTwitterUsername: username, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteSentEmotes, fetchNextPage: fetchSentNextPage, hasNextPage: hasSentNextPage, isFetchingNextPage: isSentFetchingNextPage } = useInfiniteQuery(
    ['sent', 10, username],
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
      enabled: true,
      keepPreviousData: true,
    }
  )

  const fetchReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ receiverTwitterUsername: username, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    ['received', 10, username],
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
      enabled: true,
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
      enabled: true,
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

  const sentEmotesData = flatten(infiniteSentEmotes?.pages || [])
  const receivedEmotesData = flatten(infiniteReceivedEmotes?.pages || [])
  const definitionsData = flatten(infiniteDefinitions?.pages || [])

  // console.log('sentEmotesData==', sentEmotesData)
  // console.log('receivedEmotesData==', receivedEmotesData)

  // console.log('userData==', userData)

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <h1 className="text-4xl font-bold mb-4">{userData?.twitterUsername}</h1>

      <div className="flex">
        <button
          className={`px-4 py-2 ${
            activeTab === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
          onClick={() => onTabChanged('sent')}
        >
          SENT
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'received' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
          onClick={() => onTabChanged('received')}
        >
          RECEIVED
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'symbols' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}
          onClick={() => onTabChanged('symbols')}
        >
          SYMBOLS
        </button>
      </div>

      {activeTab === 'sent' && (
        <>
          {sentEmotesData?.map((emote) => (
            <div className="text-lg" key={emote.id}>
              <A href={`/u/${emote.senderTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{emote.senderTwitterUsername}</A> sent "<A href={`/symbol/${emote.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">{emote.symbol}</A>" to <A href={`/u/${emote.receiverTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{emote.receiverTwitterUsername}</A> - {formatTimeAgo(emote.timestamp)}
            </div>
          ))}

          {hasSentNextPage && <button onClick={() => fetchSentNextPage()} disabled={!hasSentNextPage || isSentFetchingNextPage}>
            {isSentFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>}
        </>
      )}

      {activeTab === 'received' && (
        <>
          {receivedEmotesData?.map((emote) => (
            <div className="text-lg" key={emote.id}>
              <A href={`/u/${emote.senderTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{emote.senderTwitterUsername}</A> sent "<A href={`/symbol/${emote.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">{emote.symbol}</A>" to <A href={`/u/${emote.receiverTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{emote.receiverTwitterUsername}</A> - {formatTimeAgo(emote.timestamp)}
            </div>
          ))}

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
