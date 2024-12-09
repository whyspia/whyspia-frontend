"use client"

import Modal from 'components/modals/Modal'
import useAuth from '../hooks/useAuth'

export default function YouGottaLoginModal({
  close,
}: {
  close: () => void
}) {
  const { handleParticleAndWhyspiaLogin } = useAuth()

  return (
    <Modal close={close}>
      <div className="p-6 w-96 md:w-[30rem] text-white">

        <div className="text-2xl font-bold">aye yo - you gotta login first</div>

        <div
          onClick={handleParticleAndWhyspiaLogin}
          className="relative h-20 flex justify-center items-center px-4 py-2 ml-2 mb-8 text-xs font-bold text-white rounded-xl bg-[#1DA1F2] rounded-xl cursor-pointer"
        >
          login
        </div>

      </div>
    </Modal>
  )
}
