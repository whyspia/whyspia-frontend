import Modal from 'components/modals/Modal'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { EMOTE_CONTEXTS } from 'modules/place/utils/ContextUtils'
import { GlobalContext } from 'lib/GlobalContext'
import DropdownSelectMenu from 'modules/forms/components/DropdownSelectMenu'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'

enum POST_TYPE {
  HELP_REQUEST = 'help request',
  DESIRE = 'desire',
}

export default function ParallelHelpRequestModal({
  close,
  chosenContext,
}: {
  close: () => void
  chosenContext: string
}) {
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)

  const [isEmoteSending, setIsEmoteSending] = useState(false)

  const [selectedPostType, setSelectedPostType] = useState(POST_TYPE.HELP_REQUEST as string)
  const [helpOrDesireText, setHelpOrDesireText] = useState('')

  const onSendEmotes = async () => {
    setIsEmoteSending(true)

    const parallelHelpRequestIdentifierEmoteData = {
      id: "previewID",
      senderPrimaryWallet: loggedInUser.primaryWallet,
      receiverSymbols: [EMOTE_CONTEXTS.PARALLEL],
      sentSymbols: [selectedPostType],
      timestamp: new Date(),
      context: EMOTE_CONTEXTS.PARALLEL,
      bAgentDecidedSendNotifToReceiver: false,
    }
    
    const parallelHelpRequestContentEmoteData = {
      id: "previewID",
      senderPrimaryWallet: loggedInUser.primaryWallet,
      receiverSymbols: [selectedPostType],
      sentSymbols: [helpOrDesireText],
      timestamp: new Date(),
      context: EMOTE_CONTEXTS.PARALLEL,
      bAgentDecidedSendNotifToReceiver: false,
    }

    const emotes = [parallelHelpRequestIdentifierEmoteData, parallelHelpRequestContentEmoteData]

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

    // TODO: to refresh help board data at runtime
    // queryClient.invalidateQueries(['unrespondedReceivedEmotes'])

    toast.success(`"${selectedPostType}" has been sent to ${EMOTE_CONTEXTS.PARALLEL}!`)
    toast.success(`"${helpOrDesireText}" has been sent to "${selectedPostType}"!`)

    return true
  }

  const onPostSend = async () => {
    const isSuccess = await onSendEmotes()

    // if (isSuccess) {
    //   onPostSuccess()
    // }

    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold mb-2">post what you need help with OR a desire</div>

        <div className="">chosen context: {chosenContext}</div>

        <div>
          <div className="font-bold text-lg mb-1">choose post type:</div>

          <DropdownSelectMenu
            options={[POST_TYPE.HELP_REQUEST, POST_TYPE.DESIRE]}
            selectedOption={selectedPostType}
            setSelectedOption={setSelectedPostType}
          />
        </div>

        <textarea
          value={helpOrDesireText}
          onChange={(event) => setHelpOrDesireText(event.target.value)}
          placeholder="enter what you need help with OR a desire..."
          className="w-full rounded-lg px-2 py-1"
        />

        {/* Send button */}
        <button
          onClick={onPostSend}
          className="bg-[#1d8f89] cursor-pointer block rounded-lg text-white px-4 py-2 mt-4 font-bold"
        >
          post
        </button>

      </div>
    </Modal>
  )
}
