import classNames from 'classnames'
import Modal from 'components/modals/Modal'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext, useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import toast from 'react-hot-toast'
import { SentEmoteBlock } from './SentEmoteBlock'
import { getFrontendURL } from 'utils/seo-constants'
import { EmoteResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'
import { useQueryClient } from 'react-query'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'


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

  const [isShowAdditionaEmotesChecked, setIsShowAdditionaEmotesChecked] = useState(false)

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

    queryClient.invalidateQueries(['unrespondedReceivedEmotes'])
    queryClient.invalidateQueries(['unrespondedSentEmotes'])

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
          <div className="font-bold text-lg mb-1">preview emotes:</div>
          {isPreviewDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5 ml-2" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 ml-2" />
          )}
        </div>

        {isPreviewDropdownOpen && (
          <>
            <SentEmoteBlock isPreview={true} emote={mainEmoteData} jwt={jwtToken} />

            <div className="flex items-center mt-2">
              <input
                id="toggleCheckbox"
                type="checkbox"
                checked={isShowAdditionaEmotesChecked}
                onChange={() => setIsShowAdditionaEmotesChecked(!isShowAdditionaEmotesChecked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="toggleCheckbox" className="ml-2 text-sm text-white">
                show additional emotes
              </label>
            </div>

            {isShowAdditionaEmotesChecked && (
              <div className="mt-2">
                <div className='text-sm text-red-600 my-2'>NOTE: these are emotes being sent from your account by No U. if you're not cool with this, dont use the No U context</div>
                <SentEmoteBlock isPreview={true} emote={nouContextEmoteData} jwt={jwtToken} />
                {initialEmote && <SentEmoteBlock isPreview={true} emote={replyEmoteData} jwt={jwtToken} />}
              </div>
            )}
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
              'bg-blue-500 cursor-pointer': isValid,
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
