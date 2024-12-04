"use client"

import Modal from 'components/modals/Modal'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { GlobalContext } from 'lib/GlobalContext'
import ModalService from 'components/modals/ModalService'
import A from 'components/A'
import { apiCreatePingpplFollow } from 'actions/pingppl/apiCreatePingpplFollow'
import { useQueryClient } from 'react-query'
import PersonClickModal from 'modules/users/components/PersonClickModal'


export default function PingpplFollowConfirmModal({
  close,
  eventNameFollowed,
  eventSenderUser,
  eventDescription,
}: {
  close: () => void
  eventNameFollowed: string
  eventSenderUser: any
  eventDescription: string
}) {
  const queryClient = useQueryClient()
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)

  const [isPingpplFollowSending, setisPingpplFollowSending] = useState(false)

  const onFollowSend = async () => {
    setisPingpplFollowSending(true)
    
    const response = await apiCreatePingpplFollow({
      jwt: jwtToken,
      eventNameFollowed,
      eventSender: eventSenderUser?.primaryWallet,
    })

    if (response) {
      console.log('follow created successfully:', response)
    } else {
      console.error('Failed to create follow')
      setisPingpplFollowSending(false)
      return false
    }

    setisPingpplFollowSending(false)

    // to refresh data at runtime to show u now follow
    queryClient.invalidateQueries([`pingpplFollows-${loggedInUser?.primaryWallet}`])

    toast.success(`you successfully followed "${eventNameFollowed}" from "${eventSenderUser?.calculatedDisplayName}"!`)

    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold mb-2">are you sure you want to follow this planned ping from{' '}
        <A
          onClick={(event) => {
            event.stopPropagation()
            // ModalService.open(SymbolSelectModal, { symbol: eventSenderUser?.primaryWallet })
            ModalService.open(PersonClickModal, { userToken: eventSenderUser })
          }}
        >
          <span className="text-blue-500 hover:text-blue-700 cursor-pointer">{eventSenderUser?.calculatedDisplayName}</span>
        </A>?
        </div>

        <div
          className="relative flex w-full text-lg p-4 border border-white hover:bg-gray-100 hover:bg-opacity-[.1] cursor-pointer"
        >
          <div>
            <div className="font-bold">{eventNameFollowed}</div>
            <div className="text-xs">{eventDescription}</div>
          </div>
        </div>

        {/* follow button */}
        <button
          onClick={onFollowSend}
          className="h-10 mt-4 flex items-center bg-[#1d8f89] rounded-lg text-md text-white px-2 font-bold border border-[#1d8f89] hover:border-white cursor-pointer"
        >
          follow
        </button>

      </div>
    </Modal>
  )
}
