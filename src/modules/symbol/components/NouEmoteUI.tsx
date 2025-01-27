"use client"

import classNames from 'classnames'
import { GlobalContext } from 'lib/GlobalContext'
import { useContext, useState } from 'react'
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid"
import toast from 'react-hot-toast'
import { getFrontendURL } from 'utils/seo-constants'
import { EmoteResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { apiNewEmotesMany } from 'actions/emotes/apiCreateEmotesMany'
import { useQueryClient } from 'react-query'
import { EMOTE_CONTEXTS } from 'modules/place/utils/ContextUtils'
import { NouEmoteBlock } from 'modules/places/nou/components/NouEmoteBlock'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'


export default function NouEmoteUI({
  closeModalIfOpen = null,
  initialSymbol = '', // if replying to emote, this was last symbol sent in chain
  receiverUser,
  initialEmote = null,
}: {
  closeModalIfOpen: () => void
  initialSymbol: string
  receiverUser: UserV2PublicProfile
  initialEmote?: EmoteResponse
}) {
  const queryClient = useQueryClient()
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)
  

  const [isValid, setIsValid] = useState(Boolean(receiverUser?.primaryWallet))
  const [isEmoteSending, setIsEmoteSending] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol)

  const [isPreviewDropdownOpen, setIsPreviewDropdownOpen] = useState(false)

  const mainEmoteData = {
    id: "previewID",
    senderPrimaryWallet: loggedInUser.primaryWallet,
    senderUser: loggedInUser as UserV2PublicProfile,
    receiverSymbols: [receiverUser?.primaryWallet],
    receiverUsers: [receiverUser],
    sentSymbols: [selectedSymbol],
    createdAt: new Date(),
    bAgentDecidedSendNotifToReceiver: true,
    context: EMOTE_CONTEXTS.NOU
  }

  // this is preview emote data to identify no u context being used
  const nouContextEmoteData = {
    id: "previewID",
    senderPrimaryWallet: loggedInUser.primaryWallet,
    senderUser: loggedInUser as UserV2PublicProfile,
    receiverSymbols: ['No U'],
    sentSymbols: ['symbol'],
    createdAt: new Date(),
    bAgentDecidedSendNotifToReceiver: false,
    context: EMOTE_CONTEXTS.NOU
  }

  // this is preview emote data to identify which emote is being replied to
  const replyEmoteData = {
    id: "previewID",
    senderPrimaryWallet: loggedInUser.primaryWallet,
    senderUser: loggedInUser as UserV2PublicProfile,
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

    queryClient.invalidateQueries([`unrespondedReceivedEmotes-${loggedInUser?.primaryWallet}`])
    queryClient.invalidateQueries([`unrespondedSentEmotes-${loggedInUser?.primaryWallet}`])

    toast.success(`"${selectedSymbol}" has been sent to ${receiverUser?.calculatedDisplayName}!`)

    Boolean(closeModalIfOpen) && closeModalIfOpen()
  }

  const onSymbolTyped = (symbol: string) => {
    setSelectedSymbol(symbol)
    setIsValid(symbol !== '')
  }

  return (
    <div className="flex flex-col items-center">

      <div className="w-full font-bold text-lg mb-1">symbol to send:</div>

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
        <div className="font-bold text-lg mb-1">preview:</div>
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
          'w-full block rounded-lg text-white px-4 py-2 mt-4 font-bold',
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
  )
}
