import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { EmoteResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { EMOTE_CONTEXTS, getContextPagePath } from 'modules/context/utils/ContextUtils'
import { NouEmoteBlock } from './NouEmoteBlock'


export default function NouEmoteBlockReactModal({
  close,
  emote,
}: {
  close: () => void
  emote: EmoteResponse
}) {

  const onOptionSelected = (option: string) => {
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="pointer-events-none">
          <NouEmoteBlock emote={emote} context={EMOTE_CONTEXTS.NO_CONTEXT} />
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('home')}
            href={getContextPagePath(emote?.context)}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to home page of {emote?.context}
          </A>

          {/* <A
            onClick={() => onOptionSelected('about')}
            href={`/emote/${emote?.id}`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to emote page
          </A> */}
        </div>


      </div>
    </Modal>
  )
}
