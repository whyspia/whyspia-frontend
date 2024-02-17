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
import { GlobalContext } from './_app'
import { checkExistingTwitterProfile } from 'actions/users/apiUserActions'
import classNames from 'classnames'

const Hug: NextPage = () => {
  const { jwtToken } = useContext(GlobalContext)
  const [receiverSymbol, setreceiverSymbol] = useState(null)
  const [isValid, setIsValid] = useState(false)
  const [isHugSending, setIsHugSending] = useState(false)

  const fetchEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ symbol: 'hug', skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
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

  const onSetReceiverChanged = debounce(async (username: string) => {
    const { isExisting, userToken } = await checkExistingTwitterProfile(username)

    setreceiverSymbol(userToken?.twitterUsername)

    console.log('username==', username)
    console.log('isReceiverExisting==', isExisting)

    // TODO: add other inputs being entered
    setIsValid(isExisting)
  }, 500)

  async function handleSendHug() {
    setIsHugSending(true)

    const emote = await apiNewEmote({
      jwt: jwtToken,
      receiverSymbol: receiverSymbol,
      symbol: 'hug',
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
    <div className="bg-yellow-300 h-screen flex flex-col justify-center items-center font-sans">

      <Emoji text="🤗" className="text-6xl mb-8" />

      <h1 className="text-4xl font-bold mb-8">
        Send "hug"
      </h1>

      <input type="text" placeholder="Enter twitter username..." onChange={(event) => onSetReceiverChanged(event.target.value)} className="p-4 text-xl border-yellow-500 border-4 shadow-lg rounded-lg mb-8" />
      
      <button
        onClick={handleSendHug}
        className={classNames(
          `text-white p-4 text-xl shadow-lg rounded-lg mb-8`,
          isValid ? `bg-yellow-500 cursor-pointer` : `bg-yellow-400`,
        )}
        disabled={!isValid}
      >
        Send
      </button>

      {isHugSending && <CircleSpinner color="white" bgcolor="#0857e0" />}

      {emotesData?.map((emote) => (
        <div className="text-lg" key={emote.id}>
          <A href={`/u/${emote.senderTwitterUsername}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{emote.senderTwitterUsername}</A> sent "<A href={`/symbol/${emote.symbol}`} className="text-red-500 hover:text-red-700 cursor-pointer">{emote.symbol}</A>" to <A href={`/u/${emote.receiverSymbol}`} className="text-blue-500 hover:text-blue-700 cursor-pointer">{emote.receiverSymbol}</A> - {formatTimeAgo(emote.timestamp)}
        </div>
      ))}

      {hasNextPage && <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      </button>}
    </div>
  )
}

(Hug as any).layoutProps = {
  Layout: DefaultLayout,
}

export default Hug
