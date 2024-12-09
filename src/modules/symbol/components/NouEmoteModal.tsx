import Modal from 'components/modals/Modal'
import { EmoteResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import NouEmoteUI from './NouEmoteUI'
import { UserV2PublicProfile } from 'modules/users/types/UserNameTypes'


export default function NouEmoteModal({
  close,
  initialSymbol = '', // if replying to emote, this was last symbol sent in chain
  receiverUser,
  initialEmote = null,
}: {
  close: () => void
  initialSymbol: string
  receiverUser: UserV2PublicProfile
  initialEmote?: EmoteResponse
}) {

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <NouEmoteUI initialSymbol={initialSymbol} receiverUser={receiverUser} initialEmote={initialEmote} closeModalIfOpen={close} />

      </div>
    </Modal>
  )
}
