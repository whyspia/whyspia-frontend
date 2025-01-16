import Modal from 'components/modals/Modal'

interface CurrentlyRemoveConfirmModalProps {
  close: () => void
  title: string
  message: string
  onConfirm: () => void
}

export default function CurrentlyRemoveConfirmModal({ 
  close, 
  title, 
  message, 
  onConfirm 
}: CurrentlyRemoveConfirmModalProps) {
  return (
    <Modal close={close}>
      <div className="w-[500px] bg-[#0E1114] rounded-xl p-6">
        <div className="text-xl font-bold mb-4">{title}</div>
        <div className="text-gray-300 mb-6">{message}</div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              close()
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            yes
          </button>
        </div>
      </div>
    </Modal>
  )
} 