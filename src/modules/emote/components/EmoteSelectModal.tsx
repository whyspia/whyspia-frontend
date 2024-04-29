import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { EmoteResponse } from 'actions/notifs/apiGetAllEmoteNotifs'
import { SentEmoteBlock } from 'modules/symbol/components/SentEmoteBlock'
import { EMOTE_CONTEXTS, getContextPagePath } from 'modules/context/utils/ContextUtils'


export default function EmoteSelectModal({
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
          <SentEmoteBlock emote={emote} context={EMOTE_CONTEXTS.NO_CONTEXT} />
        </div>

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('home')}
            href={getContextPagePath(emote?.context)}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer'
            )}
          >
            go to home page of {emote?.context}
          </A>

          <A
            onClick={() => onOptionSelected('about')}
            href={`/emote/${emote?.id}`}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-purple-600 border border-purple-600 cursor-pointer'
            )}
          >
            go to emote page
          </A>
        </div>


      </div>
    </Modal>
  )
}
