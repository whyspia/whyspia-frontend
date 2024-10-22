"use client"

import Modal from 'components/modals/Modal'
import CircleSpinner from 'components/animations/CircleSpinner'

export default function LoginLoadingModal({
  close,
}: {
  close: () => void
}) {

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <CircleSpinner color="white" bgcolor="#0857e0" />

        <div className="text-2xl font-bold">gimme one second - login in progress...</div>

      </div>
    </Modal>
  )
}
