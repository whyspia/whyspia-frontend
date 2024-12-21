"use client"

import Modal from 'components/modals/Modal'
import classNames from 'classnames'
import A from 'components/A'
import { getContextPagePath } from '../utils/ContextUtils'


export default function ContextSelectModal({
  close,
  context = '',
}: {
  close: () => void
  context: string
}) {

  const onOptionSelected = (option: string) => {
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold">{context}</div>

        <div className="flex flex-wrap justify-center mt-6">
          <A
            onClick={() => onOptionSelected('home')}
            href={getContextPagePath(context)}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to home page of place
          </A>

          <A
            onClick={() => onOptionSelected('about')}
            href={getContextPagePath(context) + '/about'}
            className={classNames(
              'p-3 mb-4 mr-2 text-white rounded-lg hover:bg-[#1d8f89] border border-[#1d8f89] cursor-pointer'
            )}
          >
            go to about page of place
          </A>
        </div>


      </div>
    </Modal>
  )
}
