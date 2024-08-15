import classNames from 'classnames'
import Modal from 'components/modals/Modal'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext, useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import toast from 'react-hot-toast'
import { getFrontendURL } from 'utils/seo-constants'
import { EmoteResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'
import { useQueryClient } from 'react-query'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { NouEmoteBlock } from 'modules/contexts/nou/components/NouEmoteBlock'


export default function NouEmoteModal({
  close,
  initialSymbol = '', // if replying to emote, this was last symbol sent in chain
  receiverSymbol = null,
  initialEmote = null,
}: {
  close: () => void
  initialSymbol: string
  receiverSymbol: string
  initialEmote?: EmoteResponse
}) {
  const queryClient = useQueryClient()
  const { jwtToken, user, } = useContext(GlobalContext)
  

  const [isValid, setIsValid] = useState(Boolean(receiverSymbol))
  const [isEmoteSending, setIsEmoteSending] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol)

  const [isPreviewDropdownOpen, setIsPreviewDropdownOpen] = useState(false)

  const mainEmoteData = {
    id: "previewID",
    senderTwitterUsername: user.twitterUsername,
    receiverSymbols: [receiverSymbol],
    sentSymbols: [selectedSymbol],
    createdAt: new Date(),
    bAgentDecidedSendNotifToReceiver: true,
    context: EMOTE_CONTEXTS.NOU
  }

  // this is preview emote data to identify no u context being used
  const nouContextEmoteData = {
    id: "previewID",
    senderTwitterUsername: user.twitterUsername,
    receiverSymbols: ['No U'],
    sentSymbols: ['symbol'],
    createdAt: new Date(),
    bAgentDecidedSendNotifToReceiver: false,
    context: EMOTE_CONTEXTS.NOU
  }

  // this is preview emote data to identify which emote is being replied to
  const replyEmoteData = {
    id: "previewID",
    senderTwitterUsername: user.twitterUsername,
    receiverSymbols: [`${getFrontendURL()}/emote/${initialEmote?.id}`],
    sentSymbols: ['reply'],
    createdAt: new Date(),
    bAgentDecidedSendNotifToReceiver: false,
    context: EMOTE_CONTEXTS.NOU
  }

  const onSendEmote = async () => {
    setIsEmoteSending(true)

    const emotes = [mainEmoteData, nouContextEmoteData, ...(initialEmote ? [replyEmoteData] : [])] // if initialEmote exists, then there is reply data

    const responseEmotes = await apiNewEmotesMany({
      jwt: jwtToken,
      emotes
    })

    if (responseEmotes) {
      console.log('emotes created successfully:', responseEmotes)
    } else {
      console.error('Failed to create emotes')
      setIsEmoteSending(false)
      return false
    }

    setIsEmoteSending(false)

    queryClient.invalidateQueries([`unrespondedReceivedEmotes-${user?.twitterUsername}`])
    queryClient.invalidateQueries([`unrespondedSentEmotes-${user?.twitterUsername}`])

    toast.success(`"${selectedSymbol}" has been sent to ${receiverSymbol}!`)

    close()
  }

  const onSymbolTyped = (symbol: string) => {
    setSelectedSymbol(symbol)
    setIsValid(symbol !== '')
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="font-bold text-lg mb-1">symbol to send:</div>

        <textarea
          value={selectedSymbol}
          onChange={(event) => onSymbolTyped(event.target.value)}
          placeholder="enter symbol..."
          className="w-full rounded-lg px-2 py-1"
        />


        <div
          onClick={(event) => {
            event.stopPropagation()
            setIsPreviewDropdownOpen(!isPreviewDropdownOpen)
          }}
          className="flex items-center py-2 w-full cursor-pointer"
        >
          <div className="font-bold text-lg mb-1">preview emote:</div>
          {isPreviewDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          )}
        </div>

        {isPreviewDropdownOpen && (
          <>
            <NouEmoteBlock isPreview={true} emote={mainEmoteData} jwt={jwtToken} />
          </>
        )}

        {/* maybe add chevron for preview. add preview for main emote and then hidden additional emotes */}


        {/* Send button */}
        <button
          onClick={onSendEmote}
          className={classNames(
            'block rounded-lg text-white px-4 py-2 mt-4 font-bold',
            {
              'bg-gray-400': !isValid,
              'bg-[#1d8f89] border border-[#1d8f89] hover:border-white cursor-pointer': isValid,
            }
          )}
          disabled={!isValid}
        >
          send
        </button>

      </div>
    </Modal>
  )
}
