"use client"

import Modal from 'components/modals/Modal'
import SavedPeopleUI from './SavedPeopleUI'

export default function SavedPeopleModal({
  close,
}: {
  close: () => void
}) {

  return (
    <Modal close={close}>
      <div className="p-6 w-full md:w-[30rem] text-white">
        <SavedPeopleUI />
      </div>
    </Modal>
  )
}
