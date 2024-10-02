import DefaultLayout from 'components/layouts/DefaultLayout'
import { useInfiniteQuery } from 'react-query'
import { flatten } from 'lodash'
import { useContext, useRef, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { twitterLogin } from 'modules/users/services/UserService'
import A from 'components/A'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import ModalService from 'components/modals/ModalService'
import NouEmoteModal from 'modules/symbol/components/NouEmoteModal'
import apiGetUnrespondedEmotes from 'actions/emotes/apiGetUnrespondedEmotes'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { NouEmoteBlock } from 'modules/contexts/nou/components/NouEmoteBlock'
import classNames from 'classnames'

const xUsernamePAttern = /^@?(\w){1,15}$/

// i noticed this nou page is just YOUR received symbols. Which is different from notifications which can be so much more - especially once you can follow all kinds of things
const NouPage = () => {

  const { jwtToken, user } = useContext(GlobalContext)

  const [searchBarQuery, setSearchBarQuery] = useState('')
  const searchBarRef = useRef(null)

  const [activeTab, setActiveTab] = useState('received')

  const fetchUnrespondedReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetUnrespondedEmotes({ jwt: jwtToken, fetchSentOrReceived: 'received', skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    [`unrespondedReceivedEmotes-${user?.twitterUsername}`,],
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
    [`unrespondedSentEmotes-${user?.twitterUsername}`,],
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

  
  const isPossibleXUser = xUsernamePAttern.test(searchBarQuery)
  const isSearchQueryValid = isPossibleXUser

  return (
    <div className="h-screen flex flex-col items-center mt-10 px-4">

      <div className="md:w-[36rem] w-full flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-8">
          No U
        </h1>

        <>
        
          {!user?.twitterUsername ? (
            <>
              <div
                onClick={() => twitterLogin(null)}
                className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
              >
                connect X
              </div>
            </>
          ): (
            <>
              <div className="relative w-full mb-8 flex justify-center" ref={searchBarRef}>
                
                <input
                  type="text"
                  value={searchBarQuery}
                  onChange={(e) => onSearchBarTyped(e.target.value)}
                  placeholder="enter X user (case matters)"
                  className="block md:w-[30rem] w-full border border-gray-300 rounded px-3 py-2"
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
                  {isSearchQueryValid && (
                    <div
                      className="relative w-full text-lg p-4 md:pl-12 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] flex items-center cursor-pointer"
                    >
                      <div>
                        <A
                          onClick={(event) => {
                            event.stopPropagation()
                            ModalService.open(SymbolSelectModal, { symbol: searchBarQuery })
                          }}
                          className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        >
                          {searchBarQuery}
                        </A>
              
                      </div>

                      {/* emote button */}
                      <div
                        onClick={(event) => {
                          event.stopPropagation()
                          ModalService.open(NouEmoteModal, { initialSymbol: 'hug', receiverSymbol: searchBarQuery }, () => {
                            setSearchBarQuery('')
                          })
                        }}
                        className="bg-[#1d8f89] rounded-lg text-md text-white ml-auto mr-10 px-2 py-1 font-bold border border-[#1d8f89] hover:border-white cursor-pointer"
                      >
                        emote
                      </div>
                
                    </div>
                  )}

                  {!isSearchQueryValid && (
                    <div className="text-red-500">
                      enter a real X username pls
                    </div>
                  )}

                </>
 
              ): (
                <>

                  <div className="flex mb-4 space-x-2">

                    <button
                      className={classNames(
                        'relative p-3 mb-4 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                        activeTab === 'received' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                      )}
                      onClick={() => onTabChanged('received')}
                    >
                      received
                    </button>

                    <button
                      className={classNames(
                        'relative p-3 mb-4 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                        activeTab === 'sent' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                      )}
                      onClick={() => onTabChanged('sent')}
                    >
                      sent
                    </button>
                    
                  </div>

                  {activeTab === 'received' ? (
                    <>
                      {receivedEmotesData?.map((emote) => {
                      
                        return (
                          <NouEmoteBlock context={EMOTE_CONTEXTS.NOU} isPersonal={true} emote={emote} jwt={jwtToken} user={user} key={emote.id} />
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
                          <NouEmoteBlock context='nou_sent' isPersonal={true} emote={emote} jwt={jwtToken} user={user} key={emote.id} />
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

      </div>
    </div>
  )
}

(NouPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default NouPage