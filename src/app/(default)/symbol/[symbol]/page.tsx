"use client"

import { useInfiniteQuery, useQuery } from 'react-query'
import apiGetAllSymbols from 'actions/symbol/apiGetAllSymbols'
import CircleSpinner from 'components/animations/CircleSpinner'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { flatten } from 'lodash'
import classNames from 'classnames'
import Emoji from 'react-emoji-render'
import toast from 'react-hot-toast'
import { useContext, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import { EmoteTypesWithEmojis } from 'modules/symbol/utils/EmoteTypeUtil'
import DefineUI2 from 'modules/symbol/components/DefineUI2'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import { SavedPerson, UserV2PublicProfile } from 'modules/users/types/UserNameTypes'
import ChoosePersonButton from 'modules/users/components/ChoosePersonButton'
import useAuth from 'modules/users/hooks/useAuth'
import { useParams } from 'next/navigation'

const SymbolPage = () => {
  const { symbol } = useParams() as any

  const { jwtToken } = useContext(GlobalContext)
  const { handleParticleAndWhyspiaLogin } = useAuth()

  const [isValid, setIsValid] = useState(false)
  const [isEmoteSending, setIsEmoteSending] = useState(false)

  const [selectedButton, setSelectedButton] = useState('define')

  const [selectedPerson, setSelectedPerson] = useState<Partial<SavedPerson & UserV2PublicProfile> | null>(null)

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

  async function handleSendEmote() {
    setIsEmoteSending(true)

    const emote = await apiNewEmote({
      jwt: jwtToken,
      receiverSymbols: [selectedPerson?.primaryWallet],
      sentSymbols: [(symbol as string).toLowerCase()], // TODO: sending URL param here - will need to fix this one day
      bAgentDecidedSendNotifToReceiver: true,
    })
  
    if (emote) {
      console.log('emote created successfully:', emote)
    } else {
      console.error('failed to create emote')
    }

    setIsEmoteSending(false)

    toast.success(`"${symbol}" has been sent to ${selectedPerson?.calculatedDisplayName}!`)
  }

  const onDesireClicked = (desire: string) => {
    // window.history.pushState(null, null, `/desire/${desire}`)
    setSelectedButton(desire)
  }

  const setNewSelectedPerson = (newSelectedPerson: Partial<SavedPerson & { primaryWallet: string }>) => {
    if (newSelectedPerson) {
      setSelectedPerson(newSelectedPerson)
    }
  }

  const emotesData = flatten(infiniteEmotes?.pages || [])

  // TODO: if loading, show loading symbol. If not actually emote type, then say that on the page

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <div className="md:w-[36rem] w-full flex flex-col items-center ">
        {isSymbolDataLoading ? (
          <CircleSpinner color="white" bgcolor="#0857e0" />
        ) : (
          <div className="flex flex-col justify-center items-center">
            {EmoteTypesWithEmojis.includes(symbol ? (symbol as string).toLowerCase() : null) && (
              <Emoji text="🤗" className="text-6xl mb-8" />
            )}

            <h1 className="text-4xl font-bold mb-8">
              {selectedButton === 'send' ? "send" : "define"} &quot;{symbol ? (symbol as string).toLowerCase() : ""}&quot;
            </h1>

            {/* <div className="flex items-center space-x-2">
              <button
                onClick={() => onDesireClicked('send')}
                className={classNames(
                  'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                  selectedButton === 'send' ? 'bg-[#1d8f89]' : '',
                )}
              >
                send
              </button>
              <button
                onClick={() => onDesireClicked('define')}
                className={classNames(
                  'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                  selectedButton === 'define' ? 'bg-[#1d8f89]' : '',
                )}
              >
                define
              </button>
            </div> */}

            {selectedButton === 'send' ? (
              <>
              
                {!jwtToken ? (
                  <>
                    <div
                      onClick={handleParticleAndWhyspiaLogin}
                      className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
                    >
                      login
                    </div>
                  </>
                ): (
                  <>
                    <ChoosePersonButton selectedPerson={selectedPerson} setNewSelectedPerson={setNewSelectedPerson} />

                    <button
                      onClick={handleSendEmote}
                      className={classNames(
                        `text-white p-4 text-xl shadow-lg rounded-lg mb-8 border border-[#1d8f89] hover:border-white`,
                        isValid ? `bg-[#1d8f89] cursor-pointer` : `bg-[#1d8f89]/50`,
                      )}
                      disabled={!isValid}
                    >
                      send
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
              <DefineUI2 jwtToken={jwtToken} symbolData={symbolData ? symbolData[0] : null} symbolText={symbol ? (symbol as string).toLowerCase() : null} />
            )}

          </div>
        )}
      </div>
    </div>
  )
}

export default SymbolPage
