import DefaultLayout from 'components/layouts/DefaultLayout'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useRouter } from 'next/router'
import apiGetAllSymbols from 'actions/symbol/apiGetAllSymbols'
import apiGetAllEmotes from 'actions/emotes/apiGetAllEmotes'
import { flatten } from 'lodash'
import toast from 'react-hot-toast'
import { useContext, useState } from 'react'
import { GlobalContext } from 'lib/GlobalContext'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import { twitterLogin } from 'modules/users/services/UserService'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'

// i noticed this nou page is just YOUR received symbols. Which is different from notifications which can be so much more - especially once you can follow all kinds of things
const NouPage = () => {

  const { jwtToken, user } = useContext(GlobalContext)

  const fetchReceivedEmotes = async ({ pageParam = 0 }) => {
    const emotes = await apiGetAllEmotes({ receiverSymbols: [user?.twitterUsername], skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' })
    return emotes
  }

  const { data: infiniteReceivedEmotes, fetchNextPage: fetchReceivedNextPage, hasNextPage: hasReceivedNextPage, isFetchingNextPage: isReceivedFetchingNextPage } = useInfiniteQuery(
    ['received', 10, user?.twitterUsername, user],
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

  const receivedEmotesData = flatten(infiniteReceivedEmotes?.pages || [])

  console.log('receivedEmotesData==', receivedEmotesData)

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      <>
        <h1 className="text-4xl font-bold mb-8">
          no u
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
              {receivedEmotesData?.map((emote) => {
            
                return (
                  <SentEmoteBlock isPersonal={true} emote={emote} jwt={jwtToken} key={emote.id} />
                )
              })}

              {hasReceivedNextPage && <button onClick={() => fetchReceivedNextPage()} disabled={!hasReceivedNextPage || isReceivedFetchingNextPage}>
                {isReceivedFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>}
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