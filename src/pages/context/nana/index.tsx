import DefaultLayout from 'components/layouts/DefaultLayout'
import toast from 'react-hot-toast'
import { flatten } from 'lodash'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { useContext, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { GlobalContext } from 'lib/GlobalContext'
import { twitterLogin } from 'modules/users/services/UserService'
import classNames from 'classnames'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'

const NanaPage = () => {
  const queryClient = useQueryClient()

  const { jwtToken, user } = useContext(GlobalContext)
  const [selectedSymbol, setSelectedSymbol] = useState('hey')
  const [isMesageSending, setIsMessageSending] = useState(false)

  const [isAdditionalInfoDropdownOpen, setIsAdditionalInfoDropdownOpen] = useState(false)

  const isValid = selectedSymbol?.length > 0

  const fetchEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ context: EMOTE_CONTEXTS.NANA, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteNanaEmotes, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infiniteNanaEmotes'],
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

  const mainEmoteData = {
    id: "previewID",
    senderTwitterUsername: user.twitterUsername,
    receiverSymbols: ['nana'],
    sentSymbols: [selectedSymbol],
    timestamp: new Date()
  }

  // this is preview emote data to identify nana context being used
  const nanaContextEmoteData = {
    id: "previewID",
    senderTwitterUsername: user.twitterUsername,
    receiverSymbols: [EMOTE_CONTEXTS.NANA],
    sentSymbols: ['symbol'],
    timestamp: new Date()
  }

  async function handleSendMessage() {
    setIsMessageSending(true)

    const emotes = [mainEmoteData, nanaContextEmoteData]

    const responseEmotes = await apiNewEmotesMany({
      jwt: jwtToken,
      emotes
    })
  
    if (responseEmotes) {
      console.log('emotes created successfully:', responseEmotes)
    } else {
      console.error('Failed to create emotes')
    }

    setIsMessageSending(false)

    queryClient.invalidateQueries(['infiniteNanaEmotes'])

    toast.success(`"${selectedSymbol}" has been sent to nana!`)
  }

  const nanaEmotesData = flatten(infiniteNanaEmotes?.pages || [])

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <>
        <h1 className="text-4xl font-bold mb-8">
          send message to nana
        </h1>

        <>
        
          {!user?.twitterUsername ? (
            <>
              <div
                onClick={() => twitterLogin(null)}
                className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl"
              >
                connect X
              </div>
            </>
          ): (
            <>

              <input placeholder="enter message for nana..." value={selectedSymbol} onChange={(event) => setSelectedSymbol(event.target.value)} className="p-4 text-xl border-yellow-500 border-4 shadow-lg rounded-lg mb-8" />
              
              <button
                onClick={handleSendMessage}
                className={classNames(
                  `text-white p-4 text-xl shadow-lg rounded-lg mb-8`,
                  isValid ? `bg-yellow-500 cursor-pointer` : `bg-yellow-400`,
                )}
                disabled={!isValid}
              >
                send
              </button>

              
            </>
          )}

          <div className="mt-3">

            <button
              onClick={(event) => {
                event.stopPropagation()
                setIsAdditionalInfoDropdownOpen(!isAdditionalInfoDropdownOpen)
              }}
              className="flex items-center py-2 px-4 rounded-md bg-[#374151] border border-[#374151] hover:border-white w-full"
            >
              <div>additional information:</div>
              {isAdditionalInfoDropdownOpen ? (
                <ChevronUpIcon className="w-5 h-5 ml-2" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 ml-2" />
              )}
            </button>

            {isAdditionalInfoDropdownOpen && (
              <ul className="ml-10 list-disc">
                <li>this is shmoji. i love my nana and wanted to make a context for her</li>
                <li>she is the most loving person i have ever known and that love is the foundation of this project. the motivation. the inspiration</li>
                <li>you can just send her the default "hey" or send any message</li>
              </ul>
            )}

          </div>

          <div className="mt-4 w-full flex flex-col items-center">
            {nanaEmotesData?.map((emote) => {
            
              return (
                <SentEmoteBlock context={EMOTE_CONTEXTS.NANA} emote={emote} jwt={jwtToken} user={user} key={emote.id} />
              )
            })}

            {hasNextPage && <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>}
          </div>

          
        </>

      </>
    </div>
  )
}

(NanaPage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default NanaPage