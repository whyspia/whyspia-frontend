import Modal from 'components/modals/Modal'
import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { GlobalContext } from 'lib/GlobalContext'
import SymbolSelectModal from 'modules/symbol/components/SymbolSelectModal'
import ModalService from 'components/modals/ModalService'
import A from 'components/A'
import { apiCreatePingpplFollow } from 'actions/pingppl/apiCreatePingpplFollow'
import { useQueryClient } from 'react-query'


export default function PingpplFollowConfirmModal({
  close,
  eventNameFollowed,
  eventSender,
  eventDescription,
}: {
  close: () => void
  eventNameFollowed: string
  eventSender: string
  eventDescription: string
}) {
  const queryClient = useQueryClient()
  const { jwtToken, user: loggedInUser } = useContext(GlobalContext)

  const [isPingpplFollowSending, setisPingpplFollowSending] = useState(false)

  const onFollowSend = async () => {
    setisPingpplFollowSending(true)
    
    const response = await apiCreatePingpplFollow({
      jwt: jwtToken,
      eventNameFollowed,
      eventSender,
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
    queryClient.invalidateQueries([`pingpplFollows-${loggedInUser?.twitterUsername}`])

    toast.success(`you successfully followed "${eventNameFollowed}" from "${eventSender}"!`)

    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold mb-2">are you sure you want to follow this planned ping from{' '}
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
