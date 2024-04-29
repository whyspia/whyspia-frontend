import DefaultLayout from 'components/layouts/DefaultLayout'
import { useInfiniteQuery } from 'react-query'
import { flatten } from 'lodash'
import { useContext, useRef, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { twitterLogin } from 'modules/users/services/UserService'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import { getAllUserTokens } from 'actions/users/apiUserActions'
import A from 'components/A'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import ModalService from 'components/modals/ModalService'
import NouEmoteModal from 'modules/symbol/components/NouEmoteModal'
import apiGetUnrespondedEmotes from 'actions/emotes/apiGetUnrespondedEmotes'

// i noticed this nou page is just YOUR received symbols. Which is different from notifications which can be so much more - especially once you can follow all kinds of things
const NouPage = () => {

  const { jwtToken, user } = useContext(GlobalContext)

  const [searchBarQuery, setSearchBarQuery] = useState('')
  const searchBarRef = useRef(null)

  const [activeTab, setActiveTab] = useState('received')

  const fetchUserTokens = async ({ pageParam = 0 }) => {
    const userTokens = await getAllUserTokens({ search: searchBarQuery, skip: pageParam, limit: 3, orderBy: 'createdAt', orderDirection: 'desc' })
    return userTokens
  }

  const { data: infiniteUserTokens, fetchNextPage: fetchSearchNextPage, hasNextPage: hasSearchNextPage, isFetchingNextPage: isSearchFetchingNextPage } = useInfiniteQuery(
    ['search', 10, searchBarQuery],
    ({ pageParam = 0 }) =>
      fetchUserTokens({
        pageParam
      }),
    {
      enabled: Boolean(searchBarQuery && searchBarQuery?.length > 0), // disables query if this is not true
      getNextPageParam: (lastGroup, allGroups) => {
        const morePagesExist = lastGroup?.length === 10

        if (!morePagesExist) {
          return false
        }

        return allGroups.length * 10
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  )

  const fetchUnrespondedReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetUnrespondedEmotes({ jwt: jwtToken, fetchSentOrReceived: 'received', skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    ['unrespondedReceivedEmotes',],
    ({ pageParam = 0 }) =>
    fetchUnrespondedReceivedEmotes({
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
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const fetchUnrespondedSentEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetUnrespondedEmotes({ jwt: jwtToken, fetchSentOrReceived: 'sent', skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteSentEmotes, fetchNextPage: fetchSentNextPage, hasNextPage: hasSentNextPage, isFetchingNextPage: isSentFetchingNextPage } = useInfiniteQuery(
    ['unrespondedSentEmotes',],
    ({ pageParam = 0 }) =>
    fetchUnrespondedSentEmotes({
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
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const onTabChanged = (tabName: string) => {
    setActiveTab(tabName)
  }

  const onSearchBarTyped = (symbol: string) => {
    setSearchBarQuery(symbol)
  }

  const receivedEmotesData = flatten(infiniteReceivedEmotes?.pages || [])
  const sentEmotesData = flatten(infiniteSentEmotes?.pages || [])

  const userTokens = flatten(infiniteUserTokens?.pages || [])

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <>
        <h1 className="text-4xl font-bold mb-8">
          No U
        </h1>

        <>
        
          {!user?.twitterUsername ? (
            <>
              <div
                onClick={() => twitterLogin(null)}
                className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl"
              >
                Connect X
              </div>
            </>
          ): (
            <>
              <div className="relative mb-8" ref={searchBarRef}>
                
                <input
                  type="text"
                  value={searchBarQuery}
                  onChange={(e) => onSearchBarTyped(e.target.value)}
                  placeholder="search for someone to send symbols to"
                  className="hidden md:block w-[30rem] border border-gray-300 rounded px-3 py-2"
                />
                {/* {searchbarTooltipVisibility && (
                  <div
                    onClick={() => setSearchbarTooltipVisibility(false)}
                    className="absolute h-[10rem] w-full inset-y-0 left-0 top-full text-sm text-black rounded-xl shadow bg-white overflow-auto z-[600]"
                  >
                    <SearchbarTooltipContent userTokens={userTokens} searchText={searchBarQuery} />
                  </div>
                )} */}
              </div>

              {Boolean(searchBarQuery && searchBarQuery?.length > 0) ? (
                <>
                  {userTokens?.map((searchedUser) => {

                    return (
                      <div
                        // onClick={(event) => router.push(`/emote/${emote?.id}`)}
                        className="relative md:w-1/2 w-full text-lg p-4 md:pl-12 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] flex items-center cursor-pointer"
                        key={searchedUser.id}
                      >
                        <div>
                          <A
                            onClick={(event) => {
                              event.stopPropagation()
                              ModalService.open(SymbolSelectModal, { symbol: searchedUser?.twitterUsername })
                            }}
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                          >
                            {searchedUser?.twitterUsername}
                          </A>
                
                        </div>

                        {/* Emote button */}
                        <div
                          onClick={(event) => {
                            event.stopPropagation()
                            ModalService.open(NouEmoteModal, { initialSymbol: 'hug', receiverSymbol: searchedUser?.twitterUsername })
                          }}
                          className="bg-blue-500 rounded-lg text-md text-white ml-auto mr-10 px-2 py-1 font-bold border border-blue-500 hover:border-white cursor-pointer"
                        >
                          emote
                        </div>
                  
                      </div>
                    )
                  })}
                </>
 
              ): (
                <>

                  <div className="flex mb-4">

                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'received' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => onTabChanged('received')}
                    >
                      received
                    </button>

                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'sent' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                      onClick={() => onTabChanged('sent')}
                    >
                      sent
                    </button>
                    
                  </div>

                  {activeTab === 'received' ? (
                    <>
                      {receivedEmotesData?.map((emote) => {
                      
                        return (
                          <SentEmoteBlock context='nou' isPersonal={true} emote={emote} jwt={jwtToken} user={user} key={emote.id} />
                        )
                      })}

                      {hasReceivedNextPage && <button onClick={() => fetchReceivedNextPage()} disabled={!hasReceivedNextPage || isReceivedFetchingNextPage}>
                        {isReceivedFetchingNextPage ? 'Loading...' : 'Load More'}
                      </button>}
                    </>
                  ): (
                    <>
                      {sentEmotesData?.map((emote) => {
                      
                        return (
                          <SentEmoteBlock context='nou_sent' isPersonal={true} emote={emote} jwt={jwtToken} user={user} key={emote.id} />
                        )
                      })}

                      {hasSentNextPage && <button onClick={() => fetchSentNextPage()} disabled={!hasSentNextPage || isSentFetchingNextPage}>
                        {isSentFetchingNextPage ? 'Loading...' : 'Load More'}
                      </button>}
                    </>
                  )}

                  
                </>
              )}

              
            </>
          )}

          
        </>

      </>
    </div>
  )
}

(NouPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default NouPage