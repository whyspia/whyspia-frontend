import Modal from 'components/modals/Modal'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { GlobalContext } from 'lib/GlobalContext'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import ModalService from 'components/modals/ModalService'
import A from 'components/A'
import { apiCreatePingpplFollow } from 'actions/pingppl/apiCreatePingpplFollow'
import { useQueryClient } from 'react-query'
import { apiDeletePingpplFollow } from 'actions/pingppl/apiDeletePingpplFollow'


export default function PingpplUnfollowConfirmModal({
  close,
  eventNameFollowed,
  eventSender,
  eventDescription,
  pingpplFollowId,
}: {
  close: () => void
  eventNameFollowed: string
  eventSender: string
  eventDescription: string
  pingpplFollowId: string
}) {
  const queryClient = useQueryClient()
  const { jwtToken, userV2: loggedInUser } = useContext(GlobalContext)

  const [isPingpplUnfollowSending, setisPingpplUnfollowSending] = useState(false)

  const onUnfollowSend = async () => {
    setisPingpplUnfollowSending(true)
    
    const response = await apiDeletePingpplFollow({
      jwt: jwtToken,
      pingpplFollowId
    })

    if (response) {
      console.log('unfollow sent successfully:', response)
    } else {
      console.error('Failed to send unfollow')
      setisPingpplUnfollowSending(false)
      return false
    }

    setisPingpplUnfollowSending(false)

    // to refresh data at runtime to show u now unfollow
    queryClient.invalidateQueries([`pingpplFollows-${loggedInUser?.primaryWallet}`])

    toast.success(`you successfully unfollowed "${eventNameFollowed}" from "${eventSender}"!`)

    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold mb-2">are you sure you want to unfollow this planned ping from{' '}
        <A
          onClick={(event) => {
            event.stopPropagation()
            ModalService.open(SymbolSelectModal, { symbol: eventSender })
          }}
        >
          <span className="text-blue-500 hover:text-blue-700 cursor-pointer">{eventSender}</span>
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

        {/* unfollow button */}
        <button
          onClick={onUnfollowSend}
          className="h-10 mt-4 flex items-center bg-red-500 rounded-lg text-md text-white px-2 font-bold border border-purple-500 hover:border-white cursor-pointer"
        >
          unfollow
        </button>

      </div>
    </Modal>
  )
}
