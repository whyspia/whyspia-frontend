import Modal from 'components/modals/Modal'
import DoStuffUI from './DoStuffUI'


export default function DoStuffModal({
  close,
}: {
  close: () => void
}) {

  return (
    <Modal close={close}>
      <DoStuffUI close={close} />
    </Modal>
  )
}
