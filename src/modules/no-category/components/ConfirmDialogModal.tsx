import React from 'react'
import Modal from 'components/modals/Modal'

interface ConfirmationDialogProps {
  close: () => void
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialogModal: React.FC<ConfirmationDialogProps> = ({ close, message, onConfirm, onCancel }) => {
  const localOnConfirm = () => {
    onConfirm()
    close()
  }

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">
        <p className="text-lg font-semibold">{message}</p>
        <div className="mt-6 flex space-x-2">
          <button onClick={localOnConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">yes</button>
          <button onClick={close} className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-500">no</button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialogModal
