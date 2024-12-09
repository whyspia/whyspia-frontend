import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import A from 'components/A'
import CircleSpinner from 'components/animations/CircleSpinner'
import DefaultLayout from 'components/layouts/DefaultLayout'
import { debounce, flatten } from 'lodash'
import type { NextPage } from 'next'
import { useContext, useState } from 'react'
import Emoji from 'react-emoji-render'
import toast from 'react-hot-toast'
import { useInfiniteQuery } from 'react-query'
import { formatTimeAgo } from 'utils/randomUtils'
import classNames from 'classnames'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import { GlobalContext } from 'lib/GlobalContext'

const Hug: NextPage = () => {
  const { jwtToken } = useContext(GlobalContext)
  const [receiverSymbol, setreceiverSymbol] = useState(null)
  const [isValid, setIsValid] = useState(false)
  const [isHugSending, setIsHugSending] = useState(false)

  const fetchEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ sentSymbols: ['hug'], skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteEmotes, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    [10, isHugSending],
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

  // const onSetReceiverChanged = debounce(async (username: string) => {

  //   setreceiverSymbol(userToken?.primaryWallet)

  //   console.log('username==', username)
  //   console.log('isReceiverExisting==', isExisting)

  //   // TODO: add other inputs being entered
  //   setIsValid(isExisting)
  // }, 500)

  const onSetReceiverChanged = (username: string) => null

  async function handleSendHug() {
    setIsHugSending(true)

    const emote = await apiNewEmote({
      jwt: jwtToken,
      receiverSymbols: [receiverSymbol],
      sentSymbols: ['hug'],
      bAgentDecidedSendNotifToReceiver: true,
    })
  
    if (emote) {
      console.log('emote created successfully:', emote)
    } else {
      console.error('Failed to create emote')
    }

    setIsHugSending(false)

    toast.success(`"hug" has been sent to ${receiverSymbol}!`)
  }

  const emotesData = flatten(infiniteEmotes?.pages || [])

  // console.log('emotesData==', emotesData)

  return (
    <div className="bg-yellow-300 h-screen font-sans flex flex-col justify-center items-center">

      <div className="md:w-[36rem] w-full flex flex-col justify-center items-center">

        <Emoji text="🤗" className="text-6xl mb-8" />

        <h1 className="text-4xl font-bold mb-8">
          send &quot;hug&quot;
        </h1>

        <input type="text" placeholder="enter X username..." onChange={(event) => onSetReceiverChanged(event.target.value)} className="p-4 text-xl border-yellow-500 border-4 shadow-lg rounded-lg mb-8" />
        
        <button
          onClick={handleSendHug}
          className={classNames(
            `text-white p-4 text-xl shadow-lg rounded-lg mb-8`,
            isValid ? `bg-yellow-500 cursor-pointer` : `bg-yellow-400`,
          )}
          disabled={!isValid}
        >
          send
        </button>

        {isHugSending && <CircleSpinner color="white" bgcolor="#0857e0" />}

        {emotesData?.map((emote) => {
          
          return (
            <SentEmoteBlock emote={emote} jwt={jwtToken} key={emote?.id} />
          )
        })}

        {hasNextPage && <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>}

      </div>
    </div>
  )
}

(Hug as any).layoutProps = {
  Layout: DefaultLayout,
}

export default Hug
