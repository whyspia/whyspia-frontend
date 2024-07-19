import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { EmoteNotifSingleResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { getContextPagePath } from 'modules/context/utils/ContextUtils'
import { NotifBlock } from 'modules/notifs/components/NotifBlock'
import { PingpplSentEventResponse } from 'actions/pingppl/apiGetAllSentEvents'


// just used for when clicking on notif rn, but maybe used other places eventually like some activity item
export default function PingpplSentEventReactModal({
  close,
  notif,
}: {
  close: () => void
  notif: EmoteNotifSingleResponse
}) {

  const onOptionSelected = (option: string) => {
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="pointer-events-none">
          <NotifBlock notif={notif} jwt={null} key={notif?.id} isFullWidth={true} />
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('home')}
            href={`/u/${(notif?.notifData as PingpplSentEventResponse)?.eventSender}`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer'
            )}
          >
            view this planned ping on user profile of {(notif?.notifData as PingpplSentEventResponse)?.eventSender} 
          </A>

        </div>


      </div>
    </Modal>
  )
}
