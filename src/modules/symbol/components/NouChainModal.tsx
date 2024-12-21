import Modal from 'components/modals/Modal'
import { flatten } from 'lodash'
import apiGetEmoteReplyChain from 'actions/emotes/apiGetEmoteReplyChain'
import { useInfiniteQuery } from 'react-query'
import { NouEmoteBlock } from 'modules/places/nou/components/NouEmoteBlock'

// take in emoteID and display from that emote and down - all replies in chain (no u context will not have branches)
export default function NouChainModal({
  close,
  emoteID,
}: {
  close: () => void
  emoteID: string
}) {
  const fetchEmoteReplyChain = async ({ pageParam = 0 }) => {
    const { chain } = await apiGetEmoteReplyChain({ emoteID, skip: pageParam, limit: 10, orderBy: 'createdAt', orderDirection: 'desc' }) as any
    return chain
  }

  const { data: infiniteChain, fetchNextPage: fetchChainNextPage, hasNextPage: hasChainNextPage, isFetchingNextPage: isChainFetchingNextPage } = useInfiniteQuery(
    [`emoteReplyChain-${emoteID}`,],
    ({ pageParam = 0 }) =>
    fetchEmoteReplyChain({
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

  const infiniteChainData = flatten(infiniteChain?.pages || [])

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold mb-4">history</div>

        {infiniteChainData && infiniteChainData?.length > 0 && infiniteChainData?.map((emote) => {
                      
          return (
            <NouEmoteBlock context='nou_chain_preview' emote={emote} key={emote?.id} />
          )
        })}

        {hasChainNextPage && <button onClick={() => fetchChainNextPage()} disabled={!hasChainNextPage || isChainFetchingNextPage}>
          {isChainFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>}
        

      </div>
    </Modal>
  )
}
