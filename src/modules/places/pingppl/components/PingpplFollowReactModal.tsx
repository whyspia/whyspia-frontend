import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { EmoteNotifSingleResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { getContextPagePath } from 'modules/place/utils/ContextUtils'
import { NotifBlock } from 'modules/notifs/components/NotifBlock'


// just used for when clicking on notif rn, but maybe used other places eventually like some activity item
export default function PingpplFollowReactModal({
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
            href={getContextPagePath(notif?.context)}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            view ur planned pings
          </A>

        </div>


      </div>
    </Modal>
  )
}
