import Modal from 'components/modals/Modal'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid"
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import { apiNewEmote } from 'actions/emotes/apiCreateEmote'
import { EMOTE_CONTEXTS } from 'modules/context/utils/ContextUtils'
import { GlobalContext } from 'lib/GlobalContext'

const goOnlineEmoteData = {
  id: "previewID",
  senderTwitterUsername: 'you',
  receiverSymbols: [EMOTE_CONTEXTS.PARALLEL],
  sentSymbols: ['im online'],
  createdAt: new Date(),
  context: EMOTE_CONTEXTS.PARALLEL,
}

const enterContextEmoteData = {
  id: "previewID",
  senderTwitterUsername: 'you',
  receiverSymbols: [EMOTE_CONTEXTS.VIBE_CAFE],
  sentSymbols: ['entered'],
  createdAt: new Date(),
  context: EMOTE_CONTEXTS.PARALLEL,
}

const exitContextEmoteData = {
  id: "previewID",
  senderTwitterUsername: 'you',
  receiverSymbols: [EMOTE_CONTEXTS.VIBE_CAFE],
  sentSymbols: ['exited'],
  createdAt: new Date(),
  context: EMOTE_CONTEXTS.PARALLEL,
}

export default function ParallelGoOnlineModal({
  close,
  onGoOnlineSuccess,
}: {
  close: () => void
  onGoOnlineSuccess: () => void
}) {
  const { jwtToken } = useContext(GlobalContext)

  const [isPreviewDropdownOpen, setIsPreviewDropdownOpen] = useState(false)
  const [isEmoteSending, setIsEmoteSending] = useState(false)

  const onSendEmote = async () => {
    setIsEmoteSending(true)

    const emote = await apiNewEmote({
      jwt: jwtToken,
      receiverSymbols: [EMOTE_CONTEXTS.PARALLEL],  // TODO: make so multiple symbols are used here
      sentSymbols: ['im online'],      // TODO: make so multiple symbols are used here
      bAgentDecidedSendNotifToReceiver: false,
    })
  
    if (emote) {
      console.log('emote created successfully:', emote)
    } else {
      console.error('Failed to create emote')
      return false
    }

    setIsEmoteSending(false)

    toast.success(`"im online" has been sent to ${EMOTE_CONTEXTS.PARALLEL}!`)

    return true
  }

  const onGoOnline = async () => {
    const isSuccess = await onSendEmote()

    if (isSuccess) {
      onGoOnlineSuccess()
    }

    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold mb-2">GO ONLINE</div>

        <div>NOTE 1: this will publicly share that you are online</div>
        <div className="mb-2">NOTE 2: all actions in this app are also publicly shared. For example, if you set yourself as a helper, everyone can see that immediately. Going online provides permission for all other emotes to be sent on your behalf by the parallel context (until you exit the parallel context or logout)</div>

        <div
          onClick={(event) => {
            event.stopPropagation()
            setIsPreviewDropdownOpen(!isPreviewDropdownOpen)
          }}
          className="flex items-center mb-2 py-2 px-4 rounded-md bg-dark3 border border-dark3 hover:border-white w-full cursor-pointer"
        >
          <div className="font-bold text-lg mb-1">example of some emotes this context sends</div>
          {isPreviewDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </div>

        {isPreviewDropdownOpen && (
          <>
            <SentEmoteBlock isPreview={true} emote={goOnlineEmoteData} />
            <SentEmoteBlock isPreview={true} emote={enterContextEmoteData} />
            <SentEmoteBlock isPreview={true} emote={exitContextEmoteData} />
          </>
        )}

        {/* Send button */}
        <button
          onClick={onGoOnline}
          className="bg-blue-500 cursor-pointer block rounded-lg text-white px-4 py-2 mt-4 font-bold"
        >
          go online
        </button>

      </div>
    </Modal>
  )
}
