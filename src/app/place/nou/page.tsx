"use client"

import { useInfiniteQuery } from 'react-query'
import { flatten } from 'lodash'
import { useContext, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import apiGetUnrespondedEmotes from 'actions/emotes/apiGetUnrespondedEmotes'
import { EMOTE_CONTEXTS } from 'modules/place/utils/ContextUtils'
import { NouEmoteBlock } from 'modules/places/nou/components/NouEmoteBlock'
import classNames from 'classnames'
import useAuth from 'modules/users/hooks/useAuth'
import { SavedPerson, UserV2PublicProfile } from 'modules/users/types/UserNameTypes'
import ChoosePersonButton from 'modules/users/components/ChoosePersonButton'
import NouEmoteUI from 'modules/symbol/components/NouEmoteUI'


// i noticed this nou page is just YOUR received symbols. Which is different from notifications which can be so much more - especially once you can follow all kinds of things
const NouPage = () => {

  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)
  const { handleParticleAndWhyspiaLogin } = useAuth()

  const [activeTab, setActiveTab] = useState('send')

  const [selectedPerson, setSelectedPerson] = useState<Partial<SavedPerson & UserV2PublicProfile> | null>(null)

  const fetchUnrespondedReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetUnrespondedEmotes({ jwt: jwtToken, fetchSentOrReceived: 'received', skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    [`unrespondedReceivedEmotes-${loggedInUser?.primaryWallet}`,],
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
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const fetchUnrespondedSentEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetUnrespondedEmotes({ jwt: jwtToken, fetchSentOrReceived: 'sent', skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteSentEmotes, fetchNextPage: fetchSentNextPage, hasNextPage: hasSentNextPage, isFetchingNextPage: isSentFetchingNextPage } = useInfiniteQuery(
    [`unrespondedSentEmotes-${loggedInUser?.primaryWallet}`,],
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
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      enabled: Boolean(jwtToken),
      keepPreviousData: true,
    }
  )

  const onTabChanged = (tabName: string) => {
    setActiveTab(tabName)
  }

  const setNewSelectedPerson = (newSelectedPerson: Partial<SavedPerson & { primaryWallet: string }>) => {
    if (newSelectedPerson) {
      setSelectedPerson(newSelectedPerson)
    }
  }

  const receivedEmotesData = flatten(infiniteReceivedEmotes?.pages || [])
  const sentEmotesData = flatten(infiniteSentEmotes?.pages || [])

  return (
    <div className="h-screen flex flex-col items-center mt-10 px-4">

      <div className="md:w-[36rem] w-full flex flex-col justify-center items-center">
        <h1 className="text-lg md:text-3xl font-bold mb-8">
          NoU: send symbol (like &quot;hug&quot; or &quot;poke&quot;) back and forth with someone. keep streaks
        </h1>

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
            <div className="w-full flex flex-col justify-center items-center">
              

              <div className="flex items-center mb-4 space-x-2">

                <button
                  className={classNames(
                    'relative p-3 mb-4 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer',
                    activeTab === 'send' ? 'bg-[#1d8f89] selected-tab-triangle' : '',
                  )}
                  onClick={() => onTabChanged('send')}
                >
                  send
                </button>

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

              {activeTab === 'send' && (
                <div className="w-full">
                  <ChoosePersonButton selectedPerson={selectedPerson} setNewSelectedPerson={setNewSelectedPerson} />
                
                  {/* TODO: will need non-default values for when emote button clicked on a receivedUser...or just use modal lol */}
                  <NouEmoteUI initialSymbol={'hug'} receiverUser={selectedPerson as UserV2PublicProfile} initialEmote={null} closeModalIfOpen={null} key={selectedPerson?.primaryWallet} />

                </div>
              )}

              {activeTab === 'received' && (
                <>
                  {receivedEmotesData?.map((emote) => {
                  
                    return (
                      <NouEmoteBlock context={EMOTE_CONTEXTS.NOU} isPersonal={true} emote={emote} jwt={jwtToken} user={loggedInUser as UserV2PublicProfile} key={emote.id} />
                    )
                  })}

                  {hasReceivedNextPage && <button onClick={() => fetchReceivedNextPage()} disabled={!hasReceivedNextPage || isReceivedFetchingNextPage}>
                    {isReceivedFetchingNextPage ? 'Loading...' : 'Load More'}
                  </button>}
                </>
              )}
              
              {activeTab === 'sent' && (
                <>
                  {sentEmotesData?.map((emote) => {
                  
                    return (
                      <NouEmoteBlock context='nou_sent' isPersonal={true} emote={emote} jwt={jwtToken} user={loggedInUser as UserV2PublicProfile} key={emote.id} />
                    )
                  })}

                  {hasSentNextPage && <button onClick={() => fetchSentNextPage()} disabled={!hasSentNextPage || isSentFetchingNextPage}>
                    {isSentFetchingNextPage ? 'loading...' : 'load more'}
                  </button>}
                </>
              )}

            </div>
          )}

          
        </>

      </div>
    </div>
  )
}

export default NouPage
