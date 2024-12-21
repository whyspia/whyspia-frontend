import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { EMOTE_CONTEXTS, getContextPagePath } from 'modules/place/utils/ContextUtils'
import { PublicPlannedPingBlock } from './PublicPlannedPingBlock'
import { getFrontendURL } from 'utils/seo-constants'


// used for when clicking on PP on user profile page
export default function PlannedPingReactModal({
  close,
  plannedEvent,
}: {
  close: () => void
  plannedEvent: any
}) {

  const onOptionSelected = (option: string) => {
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="pointer-events-none">
          <PublicPlannedPingBlock plannedEvent={plannedEvent} />
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('home')}
            href={getContextPagePath(EMOTE_CONTEXTS.PINGPPL)}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to home page of {EMOTE_CONTEXTS.PINGPPL}
          </A>

          <A
            onClick={() => onOptionSelected('about')}
            href={getContextPagePath(EMOTE_CONTEXTS.PINGPPL) + '/about'}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to about page of {EMOTE_CONTEXTS.PINGPPL}
          </A>

          <A
            onClick={() => onOptionSelected('about')}
            href={`${getFrontendURL()}/planned-ping/${plannedEvent?.id}`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to this planned ping page
          </A>

        </div>


      </div>
    </Modal>
  )
}
