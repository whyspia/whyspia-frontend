import DefaultLayout from 'components/layouts/DefaultLayout'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useRouter } from 'next/router'
import apiGetAllSymbols from 'actions/symbol/apiGetAllSymbols'
import CircleSpinner from 'components/animations/CircleSpinner'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { debounce, flatten } from 'lodash'
import A from 'components/A'
import { formatTimeAgo } from 'utils/randomUtils'
import classNames from 'classnames'
import Emoji from 'react-emoji-render'
import toast from 'react-hot-toast'
import { useContext, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { checkExistingTwitterProfile } from 'actions/users/apiUserActions'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import { EmoteTypesWithEmojis } from 'modules/symbol/utils/EmoteTypeUtil'
import DefineUI2 from 'modules/symbol/components/DefineUI2'
import { twitterLogin } from 'modules/users/services/UserService'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'

const SymbolPage = () => {
  const router = useRouter()
  const { symbol } = router.query // This can be DB username or onchain wallet address

  const { jwtToken, user } = useContext(GlobalContext)
  const [receiverSymbol, setreceiverSymbol] = useState(null)
  const [isValid, setIsValid] = useState(false)
  const [isEmoteSending, setIsEmoteSending] = useState(false)

  const [selectedButton, setSelectedButton] = useState('send')

  const { data: symbolData, isLoading: isSymbolDataLoading } = useQuery<any>(
    [{ symbol }],
    () =>
      apiGetAllSymbols({
        skip: 0,
        limit: 10,
        orderBy: 'name',  // TODO: this hardcoding could cause issues in the future
        orderDirection: 'desc',
        search: symbol,
      }),
    // {
    //   enabled: !isTxPending,
    // }
  )

  const fetchEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ sentSymbols: symbol ? [(symbol as string).toLowerCase()] : null, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteEmotes, fetchNextPage: fetchEmotesNextPage, hasNextPage: hasEmotesNextPage, isFetchingNextPage: isEmotesFetchingNextPage } = useInfiniteQuery(
    ['emotes', 10, isEmoteSending, symbolData],
    ({ pageParam = 0 }) =>
      fetchEmotes({
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

  const onSetReceiverChanged = debounce(async (username: string) => {
    const { isExisting, userToken } = await checkExistingTwitterProfile(username)

    setreceiverSymbol(userToken?.twitterUsername)

    console.log('username==', username)
    console.log('isReceiverExisting==', isExisting)

    // TODO: add other inputs being entered
    setIsValid(isExisting)
  }, 500)

  async function handleSendEmote() {
    setIsEmoteSending(true)

    const emote = await apiNewEmote({
      jwt: jwtToken,
      receiverSymbols: [receiverSymbol],
      sentSymbols: [(symbol as string).toLowerCase()], // TODO: sending URL param here - will need to fix this one day
    })
  
    if (emote) {
      console.log('emote created successfully:', emote)
    } else {
      console.error('Failed to create emote')
    }

    setIsEmoteSending(false)

    toast.success(`"${symbol}" has been sent to ${receiverSymbol}!`)
  }

  const onDesireClicked = (desire: string) => {
    // window.history.pushState(null, null, `/desire/${desire}`)
    setSelectedButton(desire)
  }

  const emotesData = flatten(infiniteEmotes?.pages || [])

  // console.log('emotesData==', emotesData)

  // console.log('symbolData==', symbolData)

  // TODO: if loading, show loading symbol. If not actually emote type, then say that on the page

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      {isSymbolDataLoading ? (
        <CircleSpinner color="white" bgcolor="#0857e0" />
      ) : (
        <>
          {EmoteTypesWithEmojis.includes(symbol ? (symbol as string).toLowerCase() : null) && (
            <Emoji text="🤗" className="text-6xl mb-8" />
          )}

          <h1 className="text-4xl font-bold mb-8">
            {selectedButton === 'send' ? "Send" : "Define"} "{symbol ? (symbol as string).toLowerCase() : ""}"
          </h1>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDesireClicked('send')}
              className={classNames(
                'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
                selectedButton === 'send' ? 'bg-purple-500' : '',
              )}
            >
              send
            </button>
            <button
              onClick={() => onDesireClicked('define')}
              className={classNames(
                'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer',
                selectedButton === 'define' ? 'bg-purple-500' : '',
              )}
            >
              define
            </button>
          </div>

          {selectedButton === 'send' ? (
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
              ) : (
                <>
                  <input type="text" placeholder="Enter X username..." onChange={(event) => onSetReceiverChanged(event.target.value)} className="p-4 text-xl border-yellow-500 border-4 shadow-lg rounded-lg mb-8" />

                  <button
                    onClick={handleSendEmote}
                    className={classNames(
                      `text-white p-4 text-xl shadow-lg rounded-lg mb-8`,
                      isValid ? `bg-yellow-500 cursor-pointer` : `bg-yellow-400`,
                    )}
                    disabled={!isValid}
                  >
                    Send
                  </button>

                  {isEmoteSending && <CircleSpinner color="white" bgcolor="#0857e0" />}
                </>
              )}

              {emotesData?.map((emote) => {
                
                return (
                  <SentEmoteBlock emote={emote} jwt={jwtToken} key={emote.id} />
                )
              })}

              {hasEmotesNextPage && <button onClick={() => fetchEmotesNextPage()} disabled={!hasEmotesNextPage || isEmotesFetchingNextPage}>
                {isEmotesFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>}
            </>
          ) : (
            <DefineUI2 jwtToken={jwtToken} user={user} symbolData={symbolData ? symbolData[0] : null} symbolText={symbol ? (symbol as string).toLowerCase() : null} />
          )}

        </>
      )}
    </div>
  )
}

(SymbolPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default SymbolPage