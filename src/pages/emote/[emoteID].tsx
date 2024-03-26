import DefaultLayout from 'components/layouts/DefaultLayout'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useRouter } from 'next/router'
import CircleSpinner from 'components/animations/CircleSpinner'
import apiGetEmoteSingle from 'actions/emotes/apiGetEmoteSingle'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'

const EmoteSinglePage = () => {
  const router = useRouter()
  const { emoteID } = router.query // This can be DB username or onchain wallet address

  const { data: emoteData, isLoading: isEmoteDataLoading } = useQuery<any>(
    [{ emoteID }],
    () =>
      apiGetEmoteSingle({
        emoteID: emoteID as string,
      }),
    // {
    //   enabled: !isTxPending,
    // }
  )

  console.log('emoteData==', emoteData)

  // TODO: if loading, show loading symbol. If not actually emote type, then say that on the page

  return (
    <div className="h-screen flex flex-col items-center mt-10">

      {isEmoteDataLoading || !emoteData || (emoteData && emoteData?.length <= 0) ? (
        <CircleSpinner color="white" bgcolor="#0857e0" />
      ) : (
        <>
          <SentEmoteBlock emote={emoteData} key={emoteData?.id} />

        </>
      )}
    </div>
  )
}

(EmoteSinglePage as any).layoutProps = {
  Layout: DefaultLayout,
}

export default EmoteSinglePage